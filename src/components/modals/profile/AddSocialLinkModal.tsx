import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { styles } from "./styles/addSocialLinkModal";
import { color } from "@/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useUpdateProfile } from "@/src/hooks/useUpdateProfile";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AddSocialLinkModal: React.FC<Props> = ({ visible, onClose }) => {
  const [form, setForm] = React.useState({
    name: "",
    link: "",
  });
  const [error, setError] = React.useState<string | null>(null);

  const isFormValid = () => form.name.trim() !== "" && form.link.trim() !== "";

  const checkLinkIsValid = (link: string) => {
    try {
      new URL(link);
      return true;
    } catch (error) {
      return false;
    }
  };

  const { addSocialLink, isLoading } = useUpdateProfile();

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    if (!checkLinkIsValid(form.link)) {
      setError("Invalid Link. Please enter a valid link.");
      return;
    }

    await addSocialLink(form);
    setError(null);
    onClose();
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
            <Text style={styles.modalTitle}>Add Social Link</Text>
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
                placeholder="Example: Instagram"
                placeholderTextColor={color.tertiaryColor}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
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
                placeholder="https://example.com/username"
                placeholderTextColor={color.tertiaryColor}
                keyboardType="url"
                value={form.link}
                onChangeText={(text) => setForm({ ...form, link: text })}
              />
              <MaterialIcons
                name="http"
                size={20}
                color={color.tertiaryColor}
                style={styles.inputIcon}
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </ScrollView>

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
                pressed || !isFormValid() || !checkLinkIsValid(form.link)
                  ? styles.disabledPrimaryButton
                  : null,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || !checkLinkIsValid(form.link)}
            >
              <Text style={styles.primaryButtonText}>Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddSocialLinkModal;
