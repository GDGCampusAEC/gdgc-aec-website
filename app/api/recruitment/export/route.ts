import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  const stringValue = value == null ? "" : String(value);
  const escaped = stringValue.replace(/\r?\n/g, " ").replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET(request: Request) {
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const adminSecret = request.headers.get("x-admin-secret");
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized: Invalid Admin Secret" }, { status: 401 });
  }

  try {
    const snapshot = await db.collection("recruitmentApplications").orderBy("createdAt", "desc").get();
    const rows = snapshot.docs.map((doc) => doc.data());

    const headers = [
      "Name",
      "Year",
      "Roll Number",
      "Department",
      "Interested Roles",
      "Email",
      "Phone",
      "Why Join",
      "LinkedIn",
      "GitHub",
      "Other Club Core Member",
      "Other Club Name",
      "Resume",
      "Applied At",
    ];

    const csvRows = [
      headers.map(csvEscape).join(","),
      ...rows.map((row) => {
        const roles = Array.isArray(row.roles) ? row.roles.join("; ") : "";
        return [
          row.name || "",
          row.year || "",
          row.roll || "",
          row.department || "",
          roles,
          row.email || "",
          row.phone || "",
          row.whyJoin || "",
          row.linkedin || "",
          row.github || "",
          row.otherClubCoreMember ? "Yes" : "No",
          row.otherClubName || "",
          row.resumeUrl || "",
          row.createdAt || "",
        ].map(csvEscape).join(",");
      }),
    ];

    const content = csvRows.join("\n");
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="gdgc-recruitment-2026-27.csv"',
      },
    });
  } catch (error) {
    console.error("Recruitment CSV Export Error:", error);
    return NextResponse.json({ error: "Unable to export recruitment applications." }, { status: 500 });
  }
}
