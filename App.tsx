import React from "react";
import { Provider } from "react-redux";
import { store, RootState } from "@redux/store";
import Navigator from "@navigation/Navigator";

// messages + hooks…
import ErrorMessage from "@components/messages/ErrorMessage";
import SuccessMessage from "@components/messages/SuccessMessage";
import {
  clearErrorMessage,
  clearSuccessMessage,
} from "@redux/messages/messageSlice";
import { useSelector, useDispatch } from "react-redux";

function AppInner() {
  const dispatch = useDispatch();
  const { errorMessage, successMessage } = useSelector(
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
      <Navigator />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
