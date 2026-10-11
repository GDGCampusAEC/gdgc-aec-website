import { NextResponse } from "next/server";
import { deleteManualLeaderboardEntry, getManualLeaderboard, saveManualLeaderboardEntry } from "@/lib/openOrbit/db";
import { fetchGitHubAvatar } from "@/lib/openOrbit/github";

export const dynamic = "force-dynamic";

function isAdmin(req: Request): boolean {
  const secret = req.headers.get("x-admin-secret");
  const actualSecret = process.env.ADMIN_SECRET;
  return Boolean(secret && actualSecret && secret === actualSecret);
}

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await getManualLeaderboard();
    return NextResponse.json(entries);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load manual leaderboard" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rank, githubUsername, githubUrl, totalPoints } = body;

    if (!githubUsername || typeof githubUsername !== "string") {
      return NextResponse.json({ error: "GitHub username is required" }, { status: 400 });
    }

    const cleanUsername = githubUsername.trim().replace(/^@/, "");
    const cleanUrl = (githubUrl && typeof githubUrl === "string" && githubUrl.trim())
      ? githubUrl.trim()
      : `https://github.com/${cleanUsername}`;

    // Optionally lookup avatar
    const avatar = await fetchGitHubAvatar(cleanUsername);

    const saved = await saveManualLeaderboardEntry({
      rank: Math.max(1, Math.floor(Number(rank) || 1)),
      githubUsername: cleanUsername,
      githubUrl: cleanUrl,
      avatarUrl: avatar || undefined,
      totalPoints: Math.max(0, Math.floor(Number(totalPoints) || 0)),
    });

    return NextResponse.json({ success: true, entry: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save manual entry" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, rank, githubUsername, githubUrl, avatarUrl, totalPoints } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    const cleanUsername = (githubUsername || id).trim().replace(/^@/, "");
    const cleanUrl = (githubUrl && typeof githubUrl === "string" && githubUrl.trim())
      ? githubUrl.trim()
      : `https://github.com/${cleanUsername}`;

    const avatar = (avatarUrl && typeof avatarUrl === "string" && avatarUrl.trim())
      ? avatarUrl.trim()
      : await fetchGitHubAvatar(cleanUsername);

    const saved = await saveManualLeaderboardEntry({
      id,
      rank: Math.max(1, Math.floor(Number(rank) || 1)),
      githubUsername: cleanUsername,
      githubUrl: cleanUrl,
      avatarUrl: avatar || undefined,
      totalPoints: Math.max(0, Math.floor(Number(totalPoints) || 0)),
    });

    return NextResponse.json({ success: true, entry: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update manual entry" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    await deleteManualLeaderboardEntry(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete manual entry" }, { status: 500 });
  }
}
