import { NextResponse } from "next/server";
import { getAutoLeaderboard, getCompetitionConfig, getManualLeaderboard } from "@/lib/openOrbit/db";

export const dynamic = "force-dynamic";

function isAdmin(req: Request): boolean {
  const secret = req.headers.get("x-admin-secret");
  const actualSecret = process.env.ADMIN_SECRET;
  return Boolean(secret && actualSecret && secret === actualSecret);
}

export async function GET(req: Request) {
  try {
    const config = await getCompetitionConfig();
    const adminUser = isAdmin(req);

    // Visibility Check
    if (!config.leaderboardEnabled && !adminUser) {
      return NextResponse.json({
        enabled: false,
        name: config.name,
        message: "The Open Orbit leaderboard is currently hidden by organizers.",
      });
    }

    if (config.leaderboardMode === "manual") {
      const entries = await getManualLeaderboard();
      return NextResponse.json({
        enabled: true,
        mode: "manual",
        name: config.name,
        status: config.status,
        startAt: config.startAt,
        endAt: config.endAt,
        entries,
        lastSuccessfulSyncAt: config.lastSuccessfulSyncAt,
      });
    } else {
      const entries = await getAutoLeaderboard();
      return NextResponse.json({
        enabled: true,
        mode: "automatic",
        name: config.name,
        status: config.status,
        startAt: config.startAt,
        endAt: config.endAt,
        scoringRules: config.scoringRules,
        entries,
        lastSuccessfulSyncAt: config.lastSuccessfulSyncAt,
      });
    }
  } catch (err: any) {
    console.error("[OpenOrbit Leaderboard GET Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
