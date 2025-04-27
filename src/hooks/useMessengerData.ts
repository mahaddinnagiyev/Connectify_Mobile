import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useUserData } from "./useUserData";
import { setChats } from "@redux/messenger/messengerSlice";
import { setErrorMessage } from "@redux/messages/messageSlice";
import { ChatRoomsDTO } from "@services/messenger/messenger.dto";
import { useSocket } from "./useSocket";
import { useEffect, useState } from "react";
import { User } from "../services/user/dto/user.dto";
import { Account } from "../services/account/dto/account.dto";
import { PrivacySettings } from "../services/account/dto/privacy.dto";

export function useMessengerData() {
  const dispatch = useDispatch();

  const { userData } = useSelector((state: RootState) => state.myProfile);

  const { getUserByID } = useUserData();
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !userData) return;

    socket.emit("getChatRooms");
    socket.on("getChatRooms", async (chatRooms: ChatRoomsDTO[]) => {
      const enriched = await Promise.all(
        chatRooms.map(async (chat) => {
          const otherId = chat.user_ids.find((id) => id !== userData.user.id);
          if (!otherId) {
            return {
              ...chat,
              otherUser: {} as User,
              otherUserAccount: {} as Account,
              otherUserPrivacySettings: {} as PrivacySettings,
            };
          }
          try {
            const other = await getUserByID(otherId);
            if (other?.success) {
              return {
                ...chat,
                otherUser: other.user,
                otherUserAccount: other.account,
                otherUserPrivacySettings: other.privacy_settings,
              };
            } else {
              return {
                ...chat,
                otherUser: {} as User,
                otherUserAccount: {} as Account,
                otherUserPrivacySettings: {} as PrivacySettings,
              };
            }
          } catch (e) {
            dispatch(setErrorMessage((e as Error).message));
            return {
              ...chat,
              otherUser: {} as User,
              otherUserAccount: {} as Account,
              otherUserPrivacySettings: {} as PrivacySettings,
            };
          } finally {
          }
        })
      );

      dispatch(setChats(enriched));
    });

    return () => {
      socket.off("getChatRooms");
    };
  }, [socket, userData, dispatch, getUserByID]);

  return { fetchChats: () => socket?.emit("getChatRooms") };
}
