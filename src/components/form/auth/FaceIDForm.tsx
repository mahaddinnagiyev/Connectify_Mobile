import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { styles } from "./styles/faceidform";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import {
  setIsFaceIDModalOpen,
  setFaceIdLoginForm,
} from "@/src/redux/auth/authSlice";
import FaceIDModal from "../../modals/auth/FaceIDModal";

const FaceIDForm = () => {
  const dispatch = useDispatch();
  const { isFaceIDModalOpen, faceIdLoginForm } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username or email"
            placeholderTextColor="#888"
            value={faceIdLoginForm.username_or_email_face_id}
            onChange={(e) => {
              dispatch(
                setFaceIdLoginForm({
                  username_or_email_face_id: e.nativeEvent.text,
                })
              );
            }}
          />
        </View>

        <Pressable
          style={styles.loginButton}
          onPress={() => dispatch(setIsFaceIDModalOpen(true))}
        >
          <Text style={styles.loginButtonText}>Login with Face ID</Text>
        </Pressable>
      </View>

      {isFaceIDModalOpen && (
        <FaceIDModal
          onClose={() => dispatch(setIsFaceIDModalOpen(false))}
          onSuccess={() => dispatch(setIsFaceIDModalOpen(false))}
          visible={isFaceIDModalOpen}
          type="login"
        />
      )}
    </>
  );
};

export default FaceIDForm;
