import React from "react";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import Navigator from "@navigation/Navigator";
import { SocketProvider } from "@context/SocketContext";
import { Platform, UIManager } from "react-native";

import ErrorMessage from "@components/messages/ErrorMessage";
import SuccessMessage from "@components/messages/SuccessMessage";
import {
  clearErrorMessage,
  clearInfoMessage,
  clearSuccessMessage,
} from "@redux/messages/messageSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@redux/store";
import InfoMessage from "@components/messages/InfoMessage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DownloadModal from "./src/components/modals/chat/DownloadModal";

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
      <Navigator />
      <DownloadModal />
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
