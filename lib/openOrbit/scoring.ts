import { DifficultyLabel, GitHubPullRequest, ScoringRules } from "./types";

export interface EvaluationResult {
  eligible: boolean;
  difficulty?: DifficultyLabel;
  points?: number;
  reason: string;
}

export const EVENT_LABEL = "event:openorbit-accepted";

export const DIFFICULTY_LABELS: Record<string, DifficultyLabel> = {
  "difficulty:level_1": "easy",
  "difficulty:level_2": "medium",
  "difficulty:level_3": "hard",
};

/**
 * Normalizes a label string for robust comparison.
 */
function normalizeLabel(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Evaluates whether a GitHub Pull Request meets all Open Orbit competition rules.
 *
 * Rules:
 * 1. PR must be merged (merged_at !== null).
 * 2. PR mergedAt must be within the competition window: startAt <= mergedAt < endAt (UTC).
 * 3. PR must carry the label 'event:openorbit-accepted'.
 * 4. PR must carry EXACTLY ONE recognized difficulty label:
 *    ('difficulty:level_1', 'difficulty:level_2', 'difficulty:level_3').
 * 5. Points are calculated from the provided scoring rules.
 */
export function evaluatePullRequest(
  pr: GitHubPullRequest,
  startAtIso: string,
  endAtIso: string,
  scoringRules: ScoringRules
): EvaluationResult {
  // Rule 1: Must be merged
  if (!pr.merged_at) {
    return {
      eligible: false,
      reason: "PR is not merged (merged_at is null)",
    };
  }

  const mergedTime = new Date(pr.merged_at).getTime();
  const startTime = new Date(startAtIso).getTime();
  const endTime = new Date(endAtIso).getTime();

  if (isNaN(mergedTime) || isNaN(startTime) || isNaN(endTime)) {
    return {
      eligible: false,
      reason: "Invalid timestamp format",
    };
  }

  // Rule 2: Competition period (startAt <= mergedAt < endAt)
  if (mergedTime < startTime) {
    return {
      eligible: false,
      reason: `PR was merged before competition start (${pr.merged_at} < ${startAtIso})`,
    };
  }

  if (mergedTime >= endTime) {
    return {
      eligible: false,
      reason: `PR was merged at or after competition end (${pr.merged_at} >= ${endAtIso})`,
    };
  }

  const labelNames = (pr.labels || []).map((l) => normalizeLabel(l.name));

  // Rule 3: Must have event:openorbit-accepted
  const hasEventLabel = labelNames.includes(EVENT_LABEL);
  if (!hasEventLabel) {
    return {
      eligible: false,
      reason: `Missing required label '${EVENT_LABEL}'`,
    };
  }

  // Rule 4: Must have EXACTLY ONE recognized difficulty label tier
  const foundDifficulties: DifficultyLabel[] = [];
  for (const label of labelNames) {
    if (DIFFICULTY_LABELS[label]) {
      foundDifficulties.push(DIFFICULTY_LABELS[label]);
    }
  }

  if (foundDifficulties.length === 0) {
    return {
      eligible: false,
      reason: "Missing recognized difficulty label (difficulty:level_1, difficulty:level_2, or difficulty:level_3)",
    };
  }

  if (foundDifficulties.length > 1) {
    return {
      eligible: false,
      reason: `Ambiguous scoring: PR has multiple difficulty labels (${foundDifficulties.join(", ")})`,
    };
  }

  const difficulty = foundDifficulties[0];
  const points = Math.max(0, Math.floor(scoringRules[difficulty] ?? 0));

  return {
    eligible: true,
    difficulty,
    points,
    reason: `Qualifies as ${difficulty} (${points} pts)`,
  };
}
