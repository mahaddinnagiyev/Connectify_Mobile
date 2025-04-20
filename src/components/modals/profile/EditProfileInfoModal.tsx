import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { styles } from "./styles/editProfileModal";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { color } from "@/colors";
import { Gender } from "@enums/gender.enum";

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

  let socialLink: { id: string; name: string; link: string };

  if (socialLinkId && type === "social-link") {
    socialLink = userData.account.social_links.filter(
      (link) => link.id === socialLinkId
    )[0];
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
                value={userData.user.first_name}
                placeholder="John"
                placeholderTextColor={color.tertiaryColor}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={styles.inputField}
                value={userData.user.last_name}
                placeholder="Doe"
                placeholderTextColor={color.tertiaryColor}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.inputField}
                value={userData.user.username}
                placeholder="johndoe123"
                placeholderTextColor={color.tertiaryColor}
              />
            </View>

            <View style={[styles.inputCard, styles.pickerCard]}>
              <Text style={styles.inputLabel}>Gender</Text>
              <Picker
                selectedValue={userData.user.gender}
                dropdownIconColor={color.primaryColor}
                style={styles.picker}
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
                value={userData.account.bio}
                placeholder="Tell about yourself..."
                placeholderTextColor={color.tertiaryColor}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.inputField}
                value={userData.account.location}
                placeholder="City, Country"
                placeholderTextColor={color.tertiaryColor}
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
                value={socialLink?.name}
                placeholder="Instagram"
                placeholderTextColor={color.tertiaryColor}
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
                value={socialLink?.link}
                placeholder="https://instagram.com/username"
                placeholderTextColor={color.tertiaryColor}
                keyboardType="url"
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

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
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
                { opacity: pressed ? 0.8 : 1 },
              ]}
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
