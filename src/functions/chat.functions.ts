export const formatTime = (input?: string | Date): string => {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};
