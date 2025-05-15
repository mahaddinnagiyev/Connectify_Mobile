import { setShowBackToBottom } from "@redux/chat/chatSlice";

export const handleScroll = (event: any, dispatch: any) => {
  const { contentOffset } = event.nativeEvent;
  dispatch(setShowBackToBottom(contentOffset.y >= 200));
};

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// helpers/messages.ts
export function isToday(date: Date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export function isYesterday(date: Date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export function bannerDateLabel(dateString: string) {
  const d = new Date(dateString);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const truncate = (text: string = "", maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
