import React from "react";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import Navigator from "@navigation/Navigator";
import { SocketProvider } from "@context/SocketContext";

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

function AppInner() {
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
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <AppInner />
      </SocketProvider>
    </Provider>
  );
}
