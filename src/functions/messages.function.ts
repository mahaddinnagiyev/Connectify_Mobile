import { setShowBackToBottom } from "@redux/chat/chatSilce";

export const handleScroll = (event: any, dispatch: any) => {
  const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
  const distanceFromBottom =
    contentSize.height - layoutMeasurement.height - contentOffset.y;
  dispatch(setShowBackToBottom(distanceFromBottom >= 100));
};

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString + "Z");
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

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
