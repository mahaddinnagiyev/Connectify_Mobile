import { MessagesDTO } from "@services/messenger/messenger.dto";
import { useDispatch } from "react-redux";
import { setReplyMessage } from "@/src/redux/chat/chatSlice";

export function useChatData() {
  const dispatch = useDispatch();

  const handleReplyMessage = (message: MessagesDTO | null) => {
    dispatch(setReplyMessage(message));
  };

  return {
    handleReplyMessage,
  };
}
