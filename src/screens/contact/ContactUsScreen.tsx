import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  Linking,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/Navigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { color } from "@/colors";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/contactUs.style";
import {
  createFeedback,
  CreateFeedbackDTO,
} from "@services/feedback/feedback.service";
import { useDispatch } from "react-redux";
import {
  setErrorMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";

const ContactUsScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<CreateFeedbackDTO>({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });

  // Field change handler
  const handleChange = (field: keyof CreateFeedbackDTO, value: string) => {
    if (isSending) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.message.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    try {
      setIsSending(true);
      const response = await createFeedback(formData);

      if (response.success) {
        dispatch(
          setSuccessMessage(response.message ?? "Feedback sent successfully")
        );
        setFormData({ first_name: "", last_name: "", email: "", message: "" });
      } else {
        const errMsg = Array.isArray(response.response?.message)
          ? response.response.message[0]
          : response.response?.message ||
            response.response?.error ||
            response.message ||
            response.error ||
            "Something went wrong";
        dispatch(setErrorMessage(errMsg));
      }
    } catch (error) {
      dispatch(
        setErrorMessage((error as Error).message || "Something went wrong")
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contact Us</Text>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigate.goBack()}
        >
          <Text style={styles.headerButtonText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.description}>
          We're here to help! Please fill out the form below.
        </Text>

        <View style={styles.form}>
          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your first"
                placeholderTextColor={color.emptyText}
                value={formData.first_name}
                onChangeText={(text) => handleChange("first_name", text)}
                editable={!isSending}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your last"
                placeholderTextColor={color.emptyText}
                value={formData.last_name}
                onChangeText={(text) => handleChange("last_name", text)}
                editable={!isSending}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={color.emptyText}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              editable={!isSending}
            />
          </View>

          {/* Message */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, { height: 120, textAlignVertical: "top" }]}
              placeholder="Write your message here"
              placeholderTextColor={color.emptyText}
              multiline
              numberOfLines={4}
              value={formData.message}
              onChangeText={(text) => handleChange("message", text)}
              editable={!isSending}
            />
          </View>

          {/* Send Button */}
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              { opacity: pressed || !isFormValid() || isSending ? 0.7 : 1 },
            ]}
            disabled={!isFormValid() || isSending}
            onPress={handleSubmit}
          >
            {isSending ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <ActivityIndicator size="small" color={color.white} />
                <Text style={styles.sendButtonText}>Sending...</Text>
              </View>
            ) : (
              <Text style={styles.sendButtonText}>Send Message</Text>
            )}
          </Pressable>
        </View>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Social Media</Text>
          <View style={styles.socialContainer}>
            <Pressable
              style={styles.socialRow}
              onPress={() =>
                Linking.openURL(
                  "https://www.linkedin.com/in/nagiyev-mahaddin-3395a72a0/"
                )
              }
            >
              <Ionicons
                name="logo-linkedin"
                size={24}
                color={color.primaryColor}
              />
              <Text style={styles.website}>Nagiyev Mahaddin</Text>
            </Pressable>
            <Pressable
              style={styles.socialRow}
              onPress={() =>
                Linking.openURL("https://www.github.com/mahaddinnagiyev")
              }
            >
              <Ionicons
                name="logo-github"
                size={24}
                color={color.primaryColor}
              />
              <Text style={styles.website}>mahaddinnagiyev</Text>
            </Pressable>
            <Pressable
              style={styles.socialRow}
              onPress={() =>
                Linking.openURL("mailto:nagiyev.mahaddin@gmail.com")
              }
            >
              <Ionicons
                name="mail-sharp"
                size={24}
                color={color.primaryColor}
              />
              <Text style={styles.website}>nagiyev.mahaddin@gmail.com</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactUsScreen;
