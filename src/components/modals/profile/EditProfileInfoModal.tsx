import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles/editProfileModal";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { color } from "@/colors";
import { Gender } from "@enums/gender.enum";
import { useUpdateProfile } from "@hooks/useUpdateProfile";

interface ProfileModalProps {
  type: "personal" | "profile" | "social-link";
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  socialLinkId?: string;
}

const EditProfileInfoModal: React.FC<ProfileModalProps> = ({
  type,
  visible,
  onClose,
  socialLinkId,
}) => {
  const { userData } = useSelector((state: RootState) => state.myProfile);

  const [socialLink, setSocialLink] = React.useState<{
    id: string;
    name: string;
    link: string;
  } | null>(null);
  const [personalInfoForm, setPersonalInfoForm] = React.useState({
    first_name: "",
    last_name: "",
    username: "",
    gender: Gender.other,
  });
  const [profileInfoForm, setProfileInfoForm] = React.useState({
    bio: "",
    location: "",
  });
  const [socialLinkForm, setSocialLinkForm] = React.useState({
    id: "",
    name: "",
    link: "",
  });

  const { updateProfile, updateAccount, updateSocialLink, isLoading } =
    useUpdateProfile();

  React.useEffect(() => {
    if (type === "social-link" && socialLinkId) {
      const found =
        userData.account.social_links.find((sl) => sl.id === socialLinkId) ??
        null;
      setSocialLink(found);
    }
  }, [type, socialLinkId, userData.account.social_links]);

  switch (type) {
    case "personal":
      React.useEffect(() => {
        if (userData) {
          setPersonalInfoForm({
            first_name: userData.user.first_name || "",
            last_name: userData.user.last_name || "",
            username: userData.user.username || "",
            gender: userData.user.gender || Gender.other,
          });
        }
      }, [userData.user]);
      break;

    case "profile":
      React.useEffect(() => {
        if (userData) {
          setProfileInfoForm({
            bio: userData.account.bio || "",
            location: userData.account.location || "",
          });
        }
      }, [userData.account]);
      break;

    case "social-link":
      React.useEffect(() => {
        if (socialLink) {
          setSocialLinkForm({
            id: socialLink.id || "",
            name: socialLink.name || "",
            link: socialLink.link || "",
          });
        }
      }, [socialLink!]);
      break;
  }

  const renderForm = () => {
    switch (type) {
      case "personal":
        return (
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <MaterialIcons
                name="person-outline"
                size={20}
                color={color.primaryColor}
              />
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={styles.inputField}
                value={personalInfoForm.first_name}
                placeholder="John"
                placeholderTextColor={color.tertiaryColor}
                onChange={(e) => {
                  setPersonalInfoForm({
                    ...personalInfoForm,
                    first_name: e.nativeEvent.text,
                  });
                }}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.inputField}
                value={personalInfoForm.last_name}
                placeholder="Doe"
                placeholderTextColor={color.tertiaryColor}
                onChange={(e) => {
                  setPersonalInfoForm({
                    ...personalInfoForm,
                    last_name: e.nativeEvent.text,
                  });
                }}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.inputField}
                value={personalInfoForm.username}
                placeholder="johndoe123"
                placeholderTextColor={color.tertiaryColor}
                onChange={(e) => {
                  setPersonalInfoForm({
                    ...personalInfoForm,
                    username: e.nativeEvent.text,
                  });
                }}
              />
            </View>

            <View style={[styles.inputCard, styles.pickerCard]}>
              <Text style={styles.inputLabel}>Gender</Text>
              <Picker
                selectedValue={personalInfoForm.gender}
                dropdownIconColor={color.primaryColor}
                style={styles.picker}
                onValueChange={(e) => {
                  setPersonalInfoForm({
                    ...personalInfoForm,
                    gender: e,
                  });
                }}
              >
                <Picker.Item
                  label="Select Gender"
                  value=""
                  style={styles.placeholderItem}
                />
                <Picker.Item
                  label="Male"
                  value={Gender.male}
                  style={styles.pickerItem}
                />
                <Picker.Item
                  label="Female"
                  value={Gender.female}
                  style={styles.pickerItem}
                />
                <Picker.Item
                  label="Other"
                  value={Gender.other}
                  style={styles.pickerItem}
                />
              </Picker>
            </View>
          </ScrollView>
        );

      case "profile":
        return (
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <MaterialIcons
                name="edit-note"
                size={20}
                color={color.primaryColor}
              />
              <Text style={styles.sectionTitle}>Profile Details</Text>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.inputField, styles.bioInput]}
                value={profileInfoForm.bio}
                placeholder="Tell about yourself..."
                placeholderTextColor={color.tertiaryColor}
                multiline
                numberOfLines={4}
                onChangeText={(e) => {
                  setProfileInfoForm({
                    ...profileInfoForm,
                    bio: e,
                  });
                }}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.inputField}
                value={profileInfoForm.location}
                placeholder="City, Country"
                placeholderTextColor={color.tertiaryColor}
                onChangeText={(e) => {
                  setProfileInfoForm({
                    ...profileInfoForm,
                    location: e,
                  });
                }}
              />
              <MaterialIcons
                name="location-on"
                size={20}
                color={color.tertiaryColor}
                style={styles.inputIcon}
              />
            </View>
          </ScrollView>
        );

      case "social-link":
        return (
          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <MaterialIcons name="link" size={20} color={color.primaryColor} />
              <Text style={styles.sectionTitle}>Social Link</Text>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Platform Name</Text>
              <TextInput
                style={styles.inputField}
                value={socialLinkForm.name}
                placeholder="Example: Instagram"
                placeholderTextColor={color.tertiaryColor}
                onChangeText={(e) => {
                  setSocialLinkForm({
                    ...socialLinkForm,
                    name: e,
                  });
                }}
              />
              <MaterialIcons
                name="social-distance"
                size={20}
                color={color.tertiaryColor}
                style={styles.inputIcon}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Profile URL</Text>
              <TextInput
                style={styles.inputField}
                value={socialLinkForm.link}
                placeholder="https://example.com/username"
                placeholderTextColor={color.tertiaryColor}
                keyboardType="url"
                onChangeText={(e) => {
                  setSocialLinkForm({
                    ...socialLinkForm,
                    link: e,
                  });
                }}
              />
              <MaterialIcons
                name="http"
                size={20}
                color={color.tertiaryColor}
                style={styles.inputIcon}
              />
            </View>
          </ScrollView>
        );
    }
  };

  const onSaveChanges = async () => {
    switch (type) {
      case "personal":
        await updateProfile(personalInfoForm);
        onClose();
        break;

      case "profile":
        await updateAccount(profileInfoForm);
        onClose();
        break;

      case "social-link":
        await updateSocialLink(socialLinkForm);
        onClose();
        break;
    }
  };

  const isFormValid = () => {
    switch (type) {
      case "personal":
        return (
          personalInfoForm.first_name.trim() !== "" &&
          personalInfoForm.last_name.trim() !== "" &&
          personalInfoForm.username.trim() !== ""
        );

      case "profile":
        return (
          profileInfoForm.bio.trim() !== "" &&
          profileInfoForm.location.trim() !== ""
        );

      case "social-link":
        return (
          socialLinkForm.name.trim() !== "" && socialLinkForm.link.trim() !== ""
        );
    }
  };

  const isFormChanged = () => {
    switch (type) {
      case "personal":
        return (
          personalInfoForm.first_name !== userData.user.first_name ||
          personalInfoForm.last_name !== userData.user.last_name ||
          personalInfoForm.username !== userData.user.username ||
          personalInfoForm.gender !== userData.user.gender
        );

      case "profile":
        return (
          profileInfoForm.bio !== userData.account.bio ||
          profileInfoForm.location !== userData.account.location
        );

      case "social-link":
        return (
          socialLinkForm.name !== socialLink?.name ||
          socialLinkForm.link !== socialLink?.link
        );
    }
  };

  const isValidLink = () => {
    if (type === "social-link") {
      try {
        new URL(socialLinkForm.link);
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color={color.primaryColor}
                style={styles.loadingIndicator}
              />
            </View>
          )}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {type === "personal" && "Edit Personal Info"}
              {type === "profile" && "Edit Profile"}
              {type === "social-link" && "Edit Social Links"}
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <MaterialIcons name="close" size={24} color={color.textColor} />
            </Pressable>
          </View>

          {renderForm()}

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed ||
                !isFormValid() ||
                !isFormChanged() ||
                (type === "social-link" && !isValidLink())
                  ? styles.disabledPrimaryButton
                  : null,
              ]}
              onPress={onSaveChanges}
              disabled={
                !isFormValid() ||
                !isFormChanged() ||
                (type === "social-link" && !isValidLink())
              }
            >
              <Text style={styles.primaryButtonText}>Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileInfoModal;
