export type CompetitionStatus = "active" | "paused" | "completed";
export type LeaderboardMode = "automatic" | "manual";
export type DifficultyLabel = "easy" | "medium" | "hard";

export interface ScoringRules {
  easy: number;
  medium: number;
  hard: number;
}

export interface CompetitionConfig {
  name: string;
  repositoryUrl: string;
  startAt: string; // ISO 8601 string
  endAt: string;   // ISO 8601 string
  status: CompetitionStatus;
  scoringRules: ScoringRules;
  leaderboardMode: LeaderboardMode;
  leaderboardEnabled: boolean;
  lastSuccessfulSyncAt: string | null;
  lastSyncStatus: "never" | "in_progress" | "success" | "partial" | "failed";
  lastSyncError: string | null;
  lastSyncSummary: {
    prsScanned: number;
    newCounted: number;
    reconciled: number;
    skipped: number;
    ineligible: number;
    durationMs?: number;
  } | null;
  updatedAt: string;
}

export interface ContributionRecord {
  githubPRId: string; // Numeric GitHub PR ID as string
  prNumber: number;
  prTitle: string;
  prUrl: string;
  githubUserId: number;
  githubUsername: string;
  avatarUrl: string;
  difficulty: DifficultyLabel;
  points: number;
  mergedAt: string; // ISO 8601
  processedAt: string; // ISO 8601
  status: "COUNTED" | "INELIGIBLE";
}

export interface AutoLeaderboardEntry {
  githubUserId: number;
  githubUsername: string;
  avatarUrl: string;
  totalPoints: number;
  contributionCount: number;
  lastMergedAt: string; // ISO 8601
  updatedAt: string;
  rank?: number;
}

export interface ManualLeaderboardEntry {
  id: string; // Normalized identifier
  rank: number;
  githubUsername: string;
  githubUrl: string;
  avatarUrl?: string;
  totalPoints: number;
  updatedAt: string;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color?: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  merged_at: string | null;
  created_at: string;
  user: GitHubUser;
  labels: GitHubLabel[];
}

export interface SyncResult {
  success: boolean;
  mode: "latest" | "everything";
  prsScanned: number;
  newCounted: number;
  reconciled: number;
  skipped: number;
  ineligible: number;
  error?: string;
  timestamp: string;
}
