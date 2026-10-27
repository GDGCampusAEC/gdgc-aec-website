import { db } from "@/lib/firebaseAdmin";
import {
  getCompetitionConfig,
  updateCompetitionConfig,
  CONTRIBUTIONS_PATH,
  LEADERBOARD_PATH,
} from "./db";
import { fetchClosedPullRequests } from "./github";
import { evaluatePullRequest } from "./scoring";
import { AutoLeaderboardEntry, ContributionRecord, SyncResult } from "./types";

/**
 * Sync Latest:
 * Scans closed PRs and idempotently processes new qualifying contributions.
 * Does not re-award points for already processed PRs.
 */
export async function syncLatest(): Promise<SyncResult> {
  const startTime = Date.now();
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  const config = await getCompetitionConfig();

  if (config.status !== "active") {
    throw new Error(
      `Cannot run Sync Latest while competition is '${config.status}'. Please set status to 'active' first.`
    );
  }

  // Set status to in_progress
  await updateCompetitionConfig({
    lastSyncStatus: "in_progress",
    lastSyncError: null,
  });

  try {
    const prs = await fetchClosedPullRequests(config.repositoryUrl);

    let newCounted = 0;
    let skipped = 0;
    let ineligible = 0;

    const touchedUserIds = new Set<number>();

    for (const pr of prs) {
      const evaluation = evaluatePullRequest(
        pr,
        config.startAt,
        config.endAt,
        config.scoringRules
      );

      if (!evaluation.eligible) {
        ineligible++;
        continue;
      }

      const docId = String(pr.id);
      const contribRef = db.doc(`${CONTRIBUTIONS_PATH}/${docId}`);
      const contribSnap = await contribRef.get();

      if (contribSnap.exists) {
        const existing = contribSnap.data() as ContributionRecord;
        if (
          existing.status === "COUNTED" &&
          existing.points === evaluation.points &&
          existing.difficulty === evaluation.difficulty
        ) {
          skipped++;
          continue;
        }
      }

      const record: ContributionRecord = {
        githubPRId: docId,
        prNumber: pr.number,
        prTitle: pr.title || `PR #${pr.number}`,
        prUrl: pr.html_url,
        githubUserId: pr.user.id,
        githubUsername: pr.user.login,
        avatarUrl: pr.user.avatar_url,
        difficulty: evaluation.difficulty!,
        points: evaluation.points!,
        mergedAt: pr.merged_at!,
        processedAt: new Date().toISOString(),
        status: "COUNTED",
      };

      await contribRef.set(record);
      newCounted++;
      touchedUserIds.add(pr.user.id);
    }

    // Recalculate leaderboard for touched users
    for (const userId of touchedUserIds) {
      await recalculateUserLeaderboard(userId);
    }

    const durationMs = Date.now() - startTime;
    const summary = {
      prsScanned: prs.length,
      newCounted,
      reconciled: 0,
      skipped,
      ineligible,
      durationMs,
    };

    await updateCompetitionConfig({
      lastSuccessfulSyncAt: new Date().toISOString(),
      lastSyncStatus: "success",
      lastSyncError: null,
      lastSyncSummary: summary,
    });

    return {
      success: true,
      mode: "latest",
      ...summary,
      timestamp: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const errorMsg = (err instanceof Error ? err.message : String(err)) || "Sync Latest failed";
    await updateCompetitionConfig({
      lastSyncStatus: "failed",
      lastSyncError: errorMsg,
    });
    throw new Error(errorMsg);
  }
}

/**
 * Sync Everything:
 * Full reconciliation operation.
 * Fetches all relevant PRs, re-evaluates rules, recalculates points,
 * invalidates contributions that no longer qualify, and rebuilds the automatic leaderboard.
 */
export async function syncEverything(): Promise<SyncResult> {
  const startTime = Date.now();
  if (!db) {
    throw new Error("Firestore is not configured.");
  }

  const config = await getCompetitionConfig();

  // Set status to in_progress
  await updateCompetitionConfig({
    lastSyncStatus: "in_progress",
    lastSyncError: null,
  });

  try {
    const prs = await fetchClosedPullRequests(config.repositoryUrl);

    // Read all existing contributions in Firestore
    const existingContribsSnap = await db.collection(CONTRIBUTIONS_PATH).get();
    const existingMap = new Map<string, ContributionRecord>();
    existingContribsSnap.forEach((doc) => {
      existingMap.set(doc.id, doc.data() as ContributionRecord);
    });

    let newCounted = 0;
    let reconciled = 0;
    let skipped = 0;
    let ineligible = 0;

    const prMap = new Map<string, (typeof prs)[0]>();
    const userContribs = new Map<number, ContributionRecord[]>();
    const eligibleDocIds = new Set<string>();

    for (const pr of prs) {
      const docId = String(pr.id);
      prMap.set(docId, pr);

      const evaluation = evaluatePullRequest(
        pr,
        config.startAt,
        config.endAt,
        config.scoringRules
      );

      if (!evaluation.eligible) {
        ineligible++;
        continue;
      }

      eligibleDocIds.add(docId);

      // PR is eligible
      const existing = existingMap.get(docId);
      const isNew = !existing;
      const hasChanged =
        existing &&
        (existing.points !== evaluation.points ||
          existing.difficulty !== evaluation.difficulty ||
          existing.status !== "COUNTED");

      const record: ContributionRecord = {
        githubPRId: docId,
        prNumber: pr.number,
        prTitle: pr.title || `PR #${pr.number}`,
        prUrl: pr.html_url,
        githubUserId: pr.user.id,
        githubUsername: pr.user.login,
        avatarUrl: pr.user.avatar_url,
        difficulty: evaluation.difficulty!,
        points: evaluation.points!,
        mergedAt: pr.merged_at!,
        processedAt: new Date().toISOString(),
        status: "COUNTED",
      };

      if (isNew) {
        newCounted++;
        await db.doc(`${CONTRIBUTIONS_PATH}/${docId}`).set(record);
      } else if (hasChanged) {
        reconciled++;
        await db.doc(`${CONTRIBUTIONS_PATH}/${docId}`).set(record);
      } else {
        skipped++;
      }

      // Collect for leaderboard rebuilding
      const list = userContribs.get(pr.user.id) || [];
      list.push(record);
      userContribs.set(pr.user.id, list);
    }

    // Delete any existing contributions from Firestore that do not exist or are not eligible in the current sync
    for (const docId of existingMap.keys()) {
      if (!eligibleDocIds.has(docId)) {
        await db.doc(`${CONTRIBUTIONS_PATH}/${docId}`).delete();
        reconciled++;
      }
    }

    // Completely rebuild automatic leaderboard collection
    const currentLeaderboardSnap = await db.collection(LEADERBOARD_PATH).get();
    const existingLeaderboardUserIds = new Set<string>();
    currentLeaderboardSnap.forEach((doc) => existingLeaderboardUserIds.add(doc.id));

    const activeUserIds = new Set<string>();

    for (const [userId, contribs] of userContribs.entries()) {
      const activeContribs = contribs.filter((c) => c.status === "COUNTED");
      if (activeContribs.length === 0) continue;

      const totalPoints = activeContribs.reduce((sum, c) => sum + c.points, 0);
      const lastMergedAt = activeContribs
        .map((c) => c.mergedAt)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

      const entry: AutoLeaderboardEntry = {
        githubUserId: userId,
        githubUsername: activeContribs[0].githubUsername,
        avatarUrl: activeContribs[0].avatarUrl,
        totalPoints,
        contributionCount: activeContribs.length,
        lastMergedAt,
        updatedAt: new Date().toISOString(),
      };

      const userDocId = String(userId);
      await db.doc(`${LEADERBOARD_PATH}/${userDocId}`).set(entry);
      activeUserIds.add(userDocId);
    }

    // Remove leaderboard documents for users who no longer have qualifying contributions
    for (const oldUserId of existingLeaderboardUserIds) {
      if (!activeUserIds.has(oldUserId)) {
        await db.doc(`${LEADERBOARD_PATH}/${oldUserId}`).delete();
      }
    }

    const durationMs = Date.now() - startTime;
    const summary = {
      prsScanned: prs.length,
      newCounted,
      reconciled,
      skipped,
      ineligible,
      durationMs,
    };

    await updateCompetitionConfig({
      lastSuccessfulSyncAt: new Date().toISOString(),
      lastSyncStatus: "success",
      lastSyncError: null,
      lastSyncSummary: summary,
    });

    return {
      success: true,
      mode: "everything",
      ...summary,
      timestamp: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const errorMsg = (err instanceof Error ? err.message : String(err)) || "Sync Everything failed";
    await updateCompetitionConfig({
      lastSyncStatus: "failed",
      lastSyncError: errorMsg,
    });
    throw new Error(errorMsg);
  }
}

/**
 * Re-derives the leaderboard entry for a single contributor based on all their COUNTED contributions.
 */
async function recalculateUserLeaderboard(userId: number): Promise<void> {
  if (!db) return;

  const snapshot = await db
    .collection(CONTRIBUTIONS_PATH)
    .where("githubUserId", "==", userId)
    .where("status", "==", "COUNTED")
    .get();

  const userDocId = String(userId);

  if (snapshot.empty) {
    await db.doc(`${LEADERBOARD_PATH}/${userDocId}`).delete();
    return;
  }

  let totalPoints = 0;
  let username = "";
  let avatarUrl = "";
  let latestMergedAt = "";

  snapshot.forEach((doc) => {
    const data = doc.data() as ContributionRecord;
    totalPoints += data.points;
    username = data.githubUsername;
    avatarUrl = data.avatarUrl;
    if (!latestMergedAt || new Date(data.mergedAt).getTime() > new Date(latestMergedAt).getTime()) {
      latestMergedAt = data.mergedAt;
    }
  });

  const entry: AutoLeaderboardEntry = {
    githubUserId: userId,
    githubUsername: username,
    avatarUrl,
    totalPoints,
    contributionCount: snapshot.size,
    lastMergedAt: latestMergedAt,
    updatedAt: new Date().toISOString(),
  };

  await db.doc(`${LEADERBOARD_PATH}/${userDocId}`).set(entry);
}
