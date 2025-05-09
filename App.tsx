import React from "react";
import { Platform, UIManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Navigation
import Navigator from "@navigation/Navigator";

// Context
import { SocketProvider } from "@context/SocketContext";

// Components
import ErrorMessage from "@components/messages/ErrorMessage";
import SuccessMessage from "@components/messages/SuccessMessage";
import InfoMessage from "@components/messages/InfoMessage";
import DownloadModal from "@components/modals/chat/DownloadModal";

// Redux
import { Provider } from "react-redux";
import { store } from "@redux/store";
import {
  clearErrorMessage,
  clearInfoMessage,
  clearSuccessMessage,
} from "@redux/messages/messageSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@redux/store";

function AppInner() {
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const dispatch = useDispatch();
  const { errorMessage, successMessage, infoMessage } = useSelector(
    (state: RootState) => state.messages
  );
  const { downloadMessages } = useSelector((state: RootState) => state.chat);

  return (
    <>
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => dispatch(clearErrorMessage())}
        />
      )}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => dispatch(clearSuccessMessage())}
        />
      )}
      {infoMessage && (
        <InfoMessage
          message={infoMessage}
          onClose={() => dispatch(clearInfoMessage())}
        />
      )}
      {downloadMessages.length > 0 && <DownloadModal />}
      <Navigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SocketProvider>
          <AppInner />
        </SocketProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
