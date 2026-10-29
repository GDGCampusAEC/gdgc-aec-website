import { NextResponse } from "next/server";
import { getCompetitionConfig, updateCompetitionConfig } from "@/lib/openOrbit/db";
import { parseGitHubRepoUrl } from "@/lib/openOrbit/github";
import { CompetitionConfig } from "@/lib/openOrbit/types";

export const dynamic = "force-dynamic";

function isAdmin(req: Request): boolean {
  const secret = req.headers.get("x-admin-secret");
  const actualSecret = process.env.ADMIN_SECRET;
  return Boolean(secret && actualSecret && secret === actualSecret);
}

export async function GET(req: Request) {
  try {
    const config = await getCompetitionConfig();

    if (isAdmin(req)) {
      return NextResponse.json(config);
    }

    // Public safe view
    const publicConfig = {
      name: config.name,
      repositoryUrl: config.repositoryUrl,
      startAt: config.startAt,
      endAt: config.endAt,
      status: config.status,
      scoringRules: config.scoringRules,
      leaderboardMode: config.leaderboardMode,
      leaderboardEnabled: config.leaderboardEnabled,
      lastSuccessfulSyncAt: config.lastSuccessfulSyncAt,
    };

    return NextResponse.json(publicConfig);
  } catch (err: any) {
    console.error("[OpenOrbit Config GET Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load competition configuration" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized: Invalid Admin Secret" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validation
    const updates: Partial<CompetitionConfig> = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || !body.name.trim()) {
        return NextResponse.json({ error: "Competition name is required" }, { status: 400 });
      }
      updates.name = body.name.trim();
    }

    if (body.repositoryUrl !== undefined) {
      try {
        parseGitHubRepoUrl(body.repositoryUrl);
        updates.repositoryUrl = body.repositoryUrl.trim();
      } catch (e: any) {
        return NextResponse.json({ error: `Invalid repository URL: ${e.message}` }, { status: 400 });
      }
    }

    if (body.startAt !== undefined) {
      const start = new Date(body.startAt);
      if (isNaN(start.getTime())) {
        return NextResponse.json({ error: "Invalid startAt timestamp" }, { status: 400 });
      }
      updates.startAt = start.toISOString();
    }

    if (body.endAt !== undefined) {
      const end = new Date(body.endAt);
      if (isNaN(end.getTime())) {
        return NextResponse.json({ error: "Invalid endAt timestamp" }, { status: 400 });
      }
      updates.endAt = end.toISOString();
    }

    if (updates.startAt && updates.endAt) {
      if (new Date(updates.startAt).getTime() >= new Date(updates.endAt).getTime()) {
        return NextResponse.json({ error: "startAt must be strictly before endAt" }, { status: 400 });
      }
    }

    if (body.status !== undefined) {
      if (!["active", "paused", "completed"].includes(body.status)) {
        return NextResponse.json({ error: "Status must be 'active', 'paused', or 'completed'" }, { status: 400 });
      }
      updates.status = body.status;
    }

    if (body.leaderboardMode !== undefined) {
      if (!["automatic", "manual"].includes(body.leaderboardMode)) {
        return NextResponse.json({ error: "Mode must be 'automatic' or 'manual'" }, { status: 400 });
      }
      updates.leaderboardMode = body.leaderboardMode;
    }

    if (body.leaderboardEnabled !== undefined) {
      updates.leaderboardEnabled = Boolean(body.leaderboardEnabled);
    }

    if (body.scoringRules !== undefined) {
      const { easy, medium, hard } = body.scoringRules || {};
      const easyNum = Math.floor(Number(easy));
      const medNum = Math.floor(Number(medium));
      const hardNum = Math.floor(Number(hard));

      if (isNaN(easyNum) || isNaN(medNum) || isNaN(hardNum) || easyNum < 0 || medNum < 0 || hardNum < 0) {
        return NextResponse.json({ error: "Scoring rules must be non-negative integers" }, { status: 400 });
      }

      updates.scoringRules = {
        easy: easyNum,
        medium: medNum,
        hard: hardNum,
      };
    }

    const updated = await updateCompetitionConfig(updates);
    return NextResponse.json({ success: true, config: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update configuration" }, { status: 500 });
  }
}
