export const robustParseDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;
  let cleanStr = dateStr.trim();
  const ddMMyyyy = cleanStr.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (ddMMyyyy) {
    const day = parseInt(ddMMyyyy[1], 10);
    const month = parseInt(ddMMyyyy[2], 10);
    const year = parseInt(ddMMyyyy[3], 10);
    return new Date(year, month - 1, day);
  }
  const yyyyMMdd = cleanStr.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (yyyyMMdd) {
    const year = parseInt(yyyyMMdd[1], 10);
    const month = parseInt(yyyyMMdd[2], 10);
    const day = parseInt(yyyyMMdd[3], 10);
    return new Date(year, month - 1, day);
  }
  cleanStr = cleanStr.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  const parsed = Date.parse(cleanStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }
  return null;
};

export const isEventUpcoming = (dateStr: string | undefined, tagStr: string | undefined): boolean => {
  if (tagStr) {
    const cleanTag = tagStr.trim().toLowerCase();
    if (cleanTag === "yet to happen") return true;
    if (cleanTag === "completed") return false;
  }
  if (!dateStr) return false;
  const parsedDate = robustParseDate(dateStr);
  if (!parsedDate) {
    return true;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsedDate.getTime() >= today.getTime();
};
