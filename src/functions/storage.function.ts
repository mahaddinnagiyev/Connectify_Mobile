import AsyncStorage from "@react-native-async-storage/async-storage";
import { MessagesDTO, MessageStatus } from "@services/messenger/messenger.dto";

// Messages
export const getMessagesFromStorage = async (id: string) => {
  const messages = await AsyncStorage.getItem(id);
  return messages ? JSON.parse(messages) : [];
};

export const setMessagesToStorage = async (
  id: string,
  messages: MessagesDTO[]
) => {
  await AsyncStorage.setItem(id, JSON.stringify(messages));
};

export const addNewMessageToStorage = async (
  id: string,
  message: MessagesDTO
) => {
  try {
    const messages = await getMessagesFromStorage(id);
    const newMessages = [...messages, message];
    await AsyncStorage.setItem(id, JSON.stringify(newMessages));
  } catch (e) {
    console.error("addNewMessageToStorage failed:", e);
  }
};

export const removeMessageFromStorage = async (
  id: string,
  messageId: string
) => {
  const messages = await getMessagesFromStorage(id);
  const newMessages = messages.filter((m: MessagesDTO) => m.id !== messageId);
  await setMessagesToStorage(id, newMessages);
};

export const setMessagesReadInStorage = async (id: string, ids: string[]) => {
  const messages = await getMessagesFromStorage(id);
  messages.forEach((m: MessagesDTO) => {
    if (ids.includes(m.id)) m.status = MessageStatus.READ;
  });
  await setMessagesToStorage(id, messages);
};

export const clearMessagesFromStorage = async (id: string) => {
  await AsyncStorage.removeItem(id);
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};

// Theme
export const setThemeKeyToStorage = async (key: string) =>
  await AsyncStorage.setItem("bgThemeKey", key);

export const getThemeKeyFromStorage = async () =>
  (await AsyncStorage.getItem("bgThemeKey")) || "default";

export const updateThemeToStorage = async (themeKey: string) => {
  await AsyncStorage.mergeItem("backgroundTheme", themeKey);
};
