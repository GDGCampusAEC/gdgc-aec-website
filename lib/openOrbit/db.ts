import { db } from "@/lib/firebaseAdmin";
import {
  AutoLeaderboardEntry,
  CompetitionConfig,
  ContributionRecord,
  ManualLeaderboardEntry,
} from "./types";

export const CONFIG_DOC_PATH = "openOrbit/config";
export const CONTRIBUTIONS_PATH = "openOrbit/contributions/items";
export const LEADERBOARD_PATH = "openOrbit/leaderboard/entries";
export const MANUAL_LEADERBOARD_PATH = "openOrbit/manualLeaderboard/entries";

/**
 * Returns a fallback default configuration if none exists in Firestore.
 */
export function getDefaultConfig(): CompetitionConfig {
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    name: "Open Orbit",
    repositoryUrl: "https://github.com/GDGCampusAEC/gdgc-aec-website",
    startAt: now.toISOString(),
    endAt: thirtyDaysLater.toISOString(),
    status: "active",
    scoringRules: {
      easy: 10,
      medium: 20,
      hard: 30,
    },
    leaderboardMode: "automatic",
    leaderboardEnabled: true,
    lastSuccessfulSyncAt: null,
    lastSyncStatus: "never",
    lastSyncError: null,
    lastSyncSummary: null,
    updatedAt: now.toISOString(),
  };
}

function ensureDb() {
  if (!db) {
    throw new Error(
      "Firestore is not initialized. Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
    );
  }
  return db;
}

/**
 * Reads the competition configuration document.
 * Initializes with defaults if not present.
 */
export async function getCompetitionConfig(): Promise<CompetitionConfig> {
  const database = ensureDb();
  const docRef = database.doc(CONFIG_DOC_PATH);
  const snap = await docRef.get();

  if (!snap.exists) {
    const defaults = getDefaultConfig();
    await docRef.set(defaults);
    return defaults;
  }

  const data = snap.data() as CompetitionConfig;
  return {
    ...getDefaultConfig(),
    ...data,
  };
}

/**
 * Updates competition configuration.
 */
export async function updateCompetitionConfig(
  updates: Partial<CompetitionConfig>
): Promise<CompetitionConfig> {
  const database = ensureDb();
  const docRef = database.doc(CONFIG_DOC_PATH);

  const cleanUpdates = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(cleanUpdates, { merge: true });
  return getCompetitionConfig();
}

/**
 * Retrieves all counted contributions, optionally filtered by GitHub user ID.
 */
export async function getContributions(
  githubUserId?: number
): Promise<ContributionRecord[]> {
  const database = ensureDb();
  let query: FirebaseFirestore.Query = database.collection(CONTRIBUTIONS_PATH);

  if (githubUserId !== undefined) {
    query = query.where("githubUserId", "==", Number(githubUserId));
  }

  const snapshot = await query.get();
  const contributions: ContributionRecord[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data() as ContributionRecord;
    if (data.status === "COUNTED") {
      contributions.push(data);
    }
  });

  // Sort by mergedAt descending
  return contributions.sort(
    (a, b) => new Date(b.mergedAt).getTime() - new Date(a.mergedAt).getTime()
  );
}

/**
 * Retrieves the automatic leaderboard with deterministic tie-breaking.
 *
 * Tie-breaker rule:
 * 1. totalPoints DESC
 * 2. contributionCount DESC
 * 3. lastMergedAt ASC (earlier achiever ranks higher)
 * 4. githubUsername ASC
 */
export async function getAutoLeaderboard(): Promise<AutoLeaderboardEntry[]> {
  const database = ensureDb();
  const snapshot = await database.collection(LEADERBOARD_PATH).get();

  const entries: AutoLeaderboardEntry[] = [];
  snapshot.forEach((doc) => {
    entries.push(doc.data() as AutoLeaderboardEntry);
  });

  // Deterministic sorting
  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (b.contributionCount !== a.contributionCount) {
      return b.contributionCount - a.contributionCount;
    }
    const aTime = a.lastMergedAt ? new Date(a.lastMergedAt).getTime() : 0;
    const bTime = b.lastMergedAt ? new Date(b.lastMergedAt).getTime() : 0;
    if (aTime !== bTime) {
      return aTime - bTime;
    }
    return a.githubUsername.localeCompare(b.githubUsername);
  });

  // Assign ranks
  return entries.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}

/**
 * Retrieves the manual leaderboard. Preserves admin-entered ranks.
 */
export async function getManualLeaderboard(): Promise<ManualLeaderboardEntry[]> {
  const database = ensureDb();
  const snapshot = await database
    .collection(MANUAL_LEADERBOARD_PATH)
    .get();

  const entries: ManualLeaderboardEntry[] = [];
  snapshot.forEach((doc) => {
    entries.push({
      id: doc.id,
      ...(doc.data() as Omit<ManualLeaderboardEntry, "id">),
    });
  });

  // Sort by rank ascending
  entries.sort((a, b) => (Number(a.rank) || 1) - (Number(b.rank) || 1));

  return entries;
}

/**
 * Upserts a manual leaderboard entry.
 * Generates an independent unique document ID if none is provided,
 * preventing accidental overwrites.
 */
export async function saveManualLeaderboardEntry(
  entry: Omit<ManualLeaderboardEntry, "updatedAt" | "id"> & { id?: string }
): Promise<ManualLeaderboardEntry> {
  const database = ensureDb();
  const colRef = database.collection(MANUAL_LEADERBOARD_PATH);

  // If entry.id exists (edit operation), use it; otherwise auto-generate a fresh document ID
  const docRef = entry.id ? colRef.doc(entry.id) : colRef.doc();
  const docId = docRef.id;

  const payload: ManualLeaderboardEntry = {
    id: docId,
    rank: Math.max(1, Math.floor(Number(entry.rank) || 1)),
    githubUsername: entry.githubUsername.trim().replace(/^@/, ""),
    githubUrl: entry.githubUrl.trim(),
    avatarUrl: entry.avatarUrl?.trim() || undefined,
    totalPoints: Math.max(0, Math.floor(Number(entry.totalPoints) || 0)),
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(payload, { merge: true });
  return payload;
}

/**
 * Deletes a manual leaderboard entry by ID.
 */
export async function deleteManualLeaderboardEntry(id: string): Promise<void> {
  const database = ensureDb();
  await database.doc(`${MANUAL_LEADERBOARD_PATH}/${id}`).delete();
}
