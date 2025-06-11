import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";
import ConfirmModal from "../modals/confirm/ConfirmModal";
import {
  forgotPassoword,
  removeAccount,
} from "@services/auth/auth.service";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { styles } from "./styles/accountSettings.style";
import FaceIDModal from "../modals/auth/FaceIDModal";
import { setIsFaceIDModalOpen } from "@redux/auth/authSlice";
import { RootState } from "@redux/store";

type Props = {
  email: string;
  faceIdEnabled: boolean;
  onFaceIdToggle: () => void;
  setIsFaceIdModalOpen: (value: boolean) => void;
};

const AccountSettings = ({
  email,
  faceIdEnabled,
  onFaceIdToggle,
  setIsFaceIdModalOpen,
}: Props) => {
  const dispatch = useDispatch();

  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);
  const [showRemoveAccount, setShowRemoveAccount] =
    React.useState<boolean>(false);
  const [changePasswordRequest, setChangePasswordRequest] =
    React.useState<boolean>(false);
  const [isRemoveAccount, setIsRemoveAccount] = React.useState<boolean>(false);

  const changePassword = async () => {
    try {
      setChangePasswordRequest(true);
      const response = await forgotPassoword(email);

      if (response.success) {
        dispatch(
          setSuccessMessage(response.message ?? "Password reset link sent")
        );
      } else {
        dispatch(
          setErrorMessage(
            response.response?.message ??
              response.response?.error ??
              response.message ??
              response.error ??
              "Something went wrong while confirming account"
          )
        );
      }
    } catch (error) {
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setChangePasswordRequest(false);
      setShowConfirmPassword(false);
    }
  };

  const handleRemoveAccount = async () => {
    try {
      setIsRemoveAccount(true);
      const response = await removeAccount();

      if (response.success) {
        dispatch(
          setSuccessMessage(response.message ?? "Account removed successfully")
        );
      } else {
        dispatch(
          setErrorMessage(
            response.response?.message ??
              response.response?.error ??
              response.message ??
              response.error ??
              "Something went wrong while confirming account"
          )
        );
      }
    } catch (error) {
      dispatch(setErrorMessage((error as Error).message));
    } finally {
      setIsRemoveAccount(false);
      setShowRemoveAccount(false);
    }
  };

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        {/* Change Password */}
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Change Password</Text>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => setShowConfirmPassword(true)}
          >
            <Ionicons name="key" size={16} color={color.primaryColor} />
            <Text style={styles.buttonText}>Change</Text>
          </Pressable>
        </View>

        {/* Face ID */}
        {/* <View style={styles.settingItem}>
          <Text style={styles.settingText}>Face ID</Text>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              faceIdEnabled && styles.activeButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={onFaceIdToggle}
          >
            <Ionicons
              name={faceIdEnabled ? "lock-closed" : "lock-open"}
              size={16}
              color={faceIdEnabled ? "white" : color.primaryColor}
            />
            <Text
              style={[
                styles.buttonText,
                faceIdEnabled && styles.activeButtonText,
              ]}
            >
              {faceIdEnabled ? "Disable" : "Enable"}
            </Text>
          </Pressable>
        </View> */}

        {/* Remove Account */}
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, styles.dangerText]}>
            Remove Account
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.dangerButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => setShowRemoveAccount(true)}
          >
            <Ionicons name="trash" size={16} color={color.avatarBorder} />
            <Text style={[styles.buttonText, styles.dangerText]}>Remove</Text>
          </Pressable>
        </View>
      </View>

      <ConfirmModal
        visible={showConfirmPassword}
        onConfirm={changePassword}
        onCancel={() => setShowConfirmPassword(false)}
        message="Are you sure you want to change your password?"
        confirmText="Change"
        cancelText="Cancel"
        isLoading={changePasswordRequest}
        title="Change Password"
      />

      <ConfirmModal
        visible={showRemoveAccount}
        onConfirm={handleRemoveAccount}
        onCancel={() => setShowRemoveAccount(false)}
        message="Are you sure you want to remove your account?"
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={isRemoveAccount}
        title="Remove Account"
        confirmColor="red"
      />
    </>
  );
};

export default AccountSettings;
