import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import {
  RECRUITMENT_CYCLE,
  RECRUITMENT_ROLES,
  isValidUrl,
  normalizeRollNumber,
} from "@/lib/recruitment";

export const dynamic = "force-dynamic";

function buildError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  if (!db) return buildError("Firebase not configured", 503);

  const adminSecret = request.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return buildError("Unauthorized: Invalid Admin Secret", 401);
  }

  try {
    const snapshot = await db
      .collection("recruitmentApplications")
      .orderBy("createdAt", "desc")
      .get();

    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Recruitment GET Error:", error);
    return buildError("Unable to load recruitment applications.", 500);
  }
}

export async function POST(request: Request) {
  if (!db) return buildError("Firebase not configured", 503);

  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (!body || typeof body !== "object") {
      return buildError("Invalid application payload.", 400);
    }

    const name = String(body.name ?? "").trim();
    const year = String(body.year ?? "").trim();
    const rollRaw = String(body.roll ?? "").trim();
    const department = String(body.department ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const whyJoin = String(body.whyJoin ?? "").trim();
    const linkedin = String(body.linkedin ?? "").trim();
    const github = String(body.github ?? "").trim();
    const resumeUrl = String(body.resumeUrl ?? "").trim();
    const otherClubCoreMember = body.otherClubCoreMember === true || body.otherClubCoreMember === "yes";
    const otherClubName = String(body.otherClubName ?? "").trim();

    if (!name || !year || !rollRaw || !department || !email || !phone || !whyJoin) {
      return buildError("Please fill in all required fields.", 400);
    }

    const roles = Array.isArray(body.roles)
      ? body.roles.map((role: unknown) => String(role).trim()).filter(Boolean)
      : [];

    const isYear1st = String(body.year ?? "").trim() === "1st Year";
    if (!isYear1st && (!roles.length || roles.some((role) => !RECRUITMENT_ROLES.includes(role as (typeof RECRUITMENT_ROLES)[number])))) {
      return buildError("Please choose valid interested roles.", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return buildError("Please enter a valid email address.", 400);
    }

    if (!/^[0-9+()\-\s]{8,20}$/.test(phone)) {
      return buildError("Please enter a valid phone number.", 400);
    }

    if (linkedin && !isValidUrl(linkedin)) {
      return buildError("Please enter a valid LinkedIn URL.", 400);
    }

    if (github && !isValidUrl(github)) {
      return buildError("Please enter a valid GitHub URL.", 400);
    }

    if (resumeUrl && !isValidUrl(resumeUrl)) {
      return buildError("Please enter a valid resume URL.", 400);
    }

    if (otherClubCoreMember && !otherClubName) {
      return buildError("Club or society name is required when you are a core member.", 400);
    }

    const rollNormalized = normalizeRollNumber(rollRaw);
    if (!rollNormalized) {
      return buildError("Roll Number is required.", 400);
    }

    const payload = {
      name,
      year,
      roll: rollRaw,
      rollNormalized,
      department,
      roles: isYear1st ? [] : [...new Set(roles)],
      email,
      phone,
      whyJoin,
      linkedin: linkedin || "",
      github: github || "",
      resumeUrl: resumeUrl || "",
      otherClubCoreMember,
      otherClubName: otherClubCoreMember ? otherClubName : "",
      recruitmentCycle: RECRUITMENT_CYCLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ref = db.collection("recruitmentApplications").doc(rollNormalized);

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (snapshot.exists) {
        throw new Error("DUPLICATE_ROLL");
      }
      transaction.set(ref, payload);
    });

    return NextResponse.json(
      { message: "Application submitted successfully! Thank you for applying to GDGC AEC." },
      { status: 201 },
    );
  } catch (error: any) {
    if (error?.message === "DUPLICATE_ROLL") {
      return buildError("An application with this university roll number has already been submitted.", 409);
    }

    console.error("Recruitment POST Error:", error);
    return buildError("We could not submit your application right now. Please try again later.", 500);
  }
}
