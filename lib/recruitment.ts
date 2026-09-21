export const RECRUITMENT_CYCLE = "2026-27";

export const RECRUITMENT_OPEN = false;

export const RECRUITMENT_ROLES = [
  "Web Technologies",
  "App Development",
  "Competitive Programming",
  "Graphic Design",
  "AI & ML",
  "Social Media & Outreach",
  "Cloud Technologies",
  "Content",
  "Cyber Security",
  "DevOps",
  "Web3 & Blockchain",
] as const;

export const RECRUITMENT_DEPARTMENTS = [
  "CSE",
  "IT",
  "AI/ML",
  "CSBS",
  "IOT",
  "EE",
  "ECE",
  "ME",
  "CE",
  "BBA",
  "MBA",
  "Other",
] as const;

export const RECRUITMENT_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year"
] as const;

export type RecruitmentRole = (typeof RECRUITMENT_ROLES)[number];

export function normalizeRollNumber(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidUrl(value?: string): boolean {
  if (!value || !value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}
