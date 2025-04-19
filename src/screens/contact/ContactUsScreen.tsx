import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackParamList } from "@navigation/Navigator";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { color } from "@/colors";
import { Ionicons } from "@expo/vector-icons";

const ContactUsScreen = () => {
  const navigate = useNavigation<NativeStackNavigationProp<StackParamList>>();

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

      <ScrollView contentContainerStyle={styles.content}>
        {/* Description */}
        <Text style={styles.description}>
          We're here to help! Please fill out the form below.
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Row */}
          <View style={styles.nameRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>First Name</Text>
              <Pressable style={styles.input}>
                <Text style={styles.placeholder}>Enter your first</Text>
              </Pressable>
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Last Name</Text>
              <Pressable style={styles.input}>
                <Text style={styles.placeholder}>Enter your last</Text>
              </Pressable>
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <Pressable style={styles.input}>
              <Text style={styles.placeholder}>Enter your email</Text>
            </Pressable>
          </View>

          {/* Message */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message</Text>
            <Pressable style={[styles.input, { height: 120 }]}>
              <Text style={styles.placeholder}>Write your message here</Text>
            </Pressable>
          </View>

          {/* Send Button */}
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.sendButtonText}>Send Message</Text>
          </Pressable>
        </View>

        {/* Social Media */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Social Media</Text>
          <View style={styles.socialContainer}>
            <Pressable
              style={styles.socialRow}
              onPress={() => {
                Linking.openURL(
                  "https://www.linkedin.com/in/nagiyev-mahaddin-3395a72a0/"
                );
              }}
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
              onPress={() => {
                Linking.openURL("https://www.github.com/mahaddinnagiyev");
              }}
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
              onPress={() => {
                Linking.openURL("mailto:nagiyev.mahaddin@gmail.com");
              }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ececec",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  headerButtonText: {
    fontSize: 16,
    fontWeight: 800,
    color: color.primaryColor,
    backgroundColor: color.inputBgColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: color.primaryColor,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    marginTop: 5,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#2D3436",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: color.inputBgColor,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  placeholder: {
    color: "#888",
  },
  sendButton: {
    backgroundColor: color.primaryColor,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  socialSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  socialContainer: {
    flexDirection: "column",
    gap: 12,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: color.inputBgColor,
    borderRadius: 8,
    padding: 16,
  },
  website: {
    color: color.primaryColor,
    fontWeight: "500",
  },
});
