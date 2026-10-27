export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

function parseEventDates(event: CalendarEvent) {
  // Default to a 2-hour event starting either from parsed date or tomorrow at 10 AM
  let start = new Date();
  if (event.startDate) {
    const parsed = new Date(event.startDate);
    if (!isNaN(parsed.getTime())) start = parsed;
  } else if (event.date) {
    const parsed = new Date(event.date);
    if (!isNaN(parsed.getTime())) start = parsed;
    else start.setDate(start.getDate() + 7);
  } else {
    start.setDate(start.getDate() + 7);
  }

  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const formatIsoUtc = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d+/g, "");

  return {
    startUtc: formatIsoUtc(start),
    endUtc: formatIsoUtc(end),
  };
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const { startUtc, endUtc } = parseEventDates(event);
  const title = encodeURIComponent(event.title || "GDGC AEC Event");
  const details = encodeURIComponent(
    (event.description || "Join us for this GDGC AEC community event.") +
      "\n\nOrganized by Google Developer Groups on Campus AEC"
  );
  const location = encodeURIComponent(event.location || "Asansol Engineering College, Asansol");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
}

export function downloadIcsFile(event: CalendarEvent): void {
  if (typeof window === "undefined") return;

  const { startUtc, endUtc } = parseEventDates(event);
  const summary = event.title || "GDGC AEC Event";
  const description = (event.description || "Join us for this GDGC AEC community event.").replace(/\n/g, "\\n");
  const location = event.location || "Asansol Engineering College, Asansol";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GDGC AEC//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:gdgc-aec-${Date.now()}@gdgcaec.in`,
    `DTSTAMP:${startUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${summary.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
