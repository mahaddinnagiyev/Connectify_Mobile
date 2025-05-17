import { View, Text, Pressable, SafeAreaView, ScrollView } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { styles } from "./style/settingScreen.styles";

// Navigation
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/UserStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Components
import FaceIDModal from "@components/modals/auth/FaceIDModal";
import SoundSettings from "@components/settings/SoundSettings";
import ConfirmModal from "@components/modals/confirm/ConfirmModal";
import AccountSettings from "@components/settings/AccountSettings";
import PrivacySettings from "@components/settings/PrivacySettings";

// Services
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import { PrivacySettings as Privacy } from "@services/account/dto/privacy.dto";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setIsPrivachSettingsChagned } from "@redux/profile/myProfileSlice";

// Hooks
import { useUpdateProfile } from "@hooks/useUpdateProfile";

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const { userData, isPrivacySettingsChanged } = useSelector(
    (state: RootState) => state.myProfile
  );
  const { updatePrivacySettings, isPrivacyChanging } = useUpdateProfile();
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);
  const [isFaceIdModalOpen, setIsFaceIdModalOpen] = useState<boolean>(false);
  const [privacySettings, setPrivacySettings] = useState<
    Record<string, PrivacySettingsChoice>
  >({
    email: userData.privacySettings.email,
    gender: userData.privacySettings.gender,
    bio: userData.privacySettings.bio,
    location: userData.privacySettings.location,
    socialLinks: userData.privacySettings.social_links,
    lastLogin: userData.privacySettings.last_login,
  });
  const originalSettings = useRef(privacySettings);
  const pendingAction = useRef<any>(null);

  useEffect(() => {
    const hasChanged = Object.keys(privacySettings).some(
      (key) => privacySettings[key] !== originalSettings.current[key]
    );
    dispatch(setIsPrivachSettingsChagned(hasChanged));
  }, [privacySettings, dispatch]);

  const handlePrivacyChange = (
    setting: string,
    value: PrivacySettingsChoice
  ) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSave = async () => {
    const privacySettingsObject: Privacy = {
      email: privacySettings.email,
      gender: privacySettings.gender,
      bio: privacySettings.bio,
      location: privacySettings.location,
      social_links: privacySettings.socialLinks,
      last_login: privacySettings.lastLogin,
    };

    await updatePrivacySettings(privacySettingsObject);

    dispatch(setIsPrivachSettingsChagned(false));
    originalSettings.current = { ...privacySettings };
  };

  const handleBackPress = () => {
    if (isPrivacySettingsChanged) {
      setShowDiscardModal(true);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const beforeRemoveListener = navigation.addListener("beforeRemove", (e) => {
      if (!isPrivacySettingsChanged) {
        return;
      }
      e.preventDefault();
      setShowDiscardModal(true);
    });
    return beforeRemoveListener;
  }, [navigation, isPrivacySettingsChanged]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!isPrivacySettingsChanged) {
        return;
      }
      e.preventDefault();

      pendingAction.current = e.data.action;
      setShowDiscardModal(true);
    });
    return unsubscribe;
  }, [navigation, isPrivacySettingsChanged]);

  const onSaveAndGoBack = async () => {
    await handleSave();
    setShowDiscardModal(false);
    navigation.goBack();
  };

  const onDiscardChanges = () => {
    dispatch(setIsPrivachSettingsChagned(false));
    originalSettings.current = { ...privacySettings };
    setShowDiscardModal(false);
    navigation.dispatch(pendingAction.current);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Pressable
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            onPress={handleBackPress}
          >
            <Text style={styles.headerButtonText}>Back</Text>
          </Pressable>
        </View>

        {/* Main Content */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Notification Section */}
          {/* {!userData.user.face_descriptor && (
            <View style={styles.securityBanner}>
              <View style={styles.bannerLeft}>
                <Ionicons
                  name="lock-open-outline"
                  size={24}
                  color={color.primaryColor}
                  style={styles.bannerIcon}
                />
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>Enhance Your Security</Text>
                  <Text style={styles.bannerDescription}>
                    Protect your account with biometric authentication. Enable
                    Face ID for secure access.
                  </Text>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.enableButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => setIsFaceIdModalOpen(true)}
              >
                <Text style={styles.enableButtonText}>Enable</Text>
                <MaterialCommunityIcons
                  name="face-recognition"
                  size={18}
                  color="white"
                />
              </Pressable>
            </View>
          )} */}

          {/* Sound Preferences Section */}
          <SoundSettings />

          {/* Account Settings Section */}
          <AccountSettings
            email={userData.user.email}
            faceIdEnabled={userData.user.face_descriptor !== null}
            onFaceIdToggle={
              userData.user.face_descriptor
                ? () => {}
                : () => setIsFaceIdModalOpen(true)
            }
            setIsFaceIdModalOpen={setIsFaceIdModalOpen}
          />

          {/* Privacy Settings Section */}
          <PrivacySettings
            privacySettings={privacySettings}
            onPrivacyChange={handlePrivacyChange}
            onSave={handleSave}
            isSaving={isPrivacyChanging}
          />
        </ScrollView>
      </SafeAreaView>

      <ConfirmModal
        visible={showDiscardModal}
        title="Discard changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        onConfirm={onSaveAndGoBack}
        onCancel={onDiscardChanges}
        confirmText="Save"
        cancelText="Discard"
        cancelColor="red"
        isLoading={isPrivacyChanging}
      />

      {isFaceIdModalOpen && (
        <FaceIDModal
          visible={isFaceIdModalOpen}
          onClose={() => setIsFaceIdModalOpen(false)}
          type="register"
          onSuccess={() => setIsFaceIdModalOpen(false)}
        />
      )}
    </>
  );
};

export default SettingsScreen;
