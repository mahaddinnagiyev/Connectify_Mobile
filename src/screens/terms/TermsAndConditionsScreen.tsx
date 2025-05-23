import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Linking,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { color } from "@/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "@/src/navigation/AuthStack";
import { SafeAreaView } from "react-native-safe-area-context";

const TermsAndConditionsScreen = () => {
  const { goBack } = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const handleEmailPress = () => {
    Linking.openURL("mailto:nagiyev.mahaddin@gmail.com");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={color.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms And Conditions</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Sections */}
        <Section title="1. Acceptance of Terms">
          Welcome to Connectify. By accessing and using our chat application,
          you agree to be bound by these Terms and Conditions. If you do not
          agree with any of these terms, please do not use our service.
        </Section>

        <Section title="2. Eligibility and User Account">
          You must be at least 13 years old (or the minimum legal age in your
          jurisdiction) to use our chat application. By registering an account,
          you agree to provide accurate and complete information. You are
          responsible for maintaining the confidentiality of your account and
          password, and for restricting access to your device.
        </Section>

        <Section title="3. Use of the Service">
          Our chat application is designed to facilitate communication and
          social interactions. You agree to use the service in a manner that is
          lawful, ethical, and respectful to other users. You must not engage in
          any activities that could harm the functionality of the application or
          the experience of other users.
        </Section>

        <Section title="4. Intellectual Property">
          All content, including text, images, logos, and software, is the
          property of Connectify or its licensors and is protected by copyright
          and other intellectual property laws. You agree not to reproduce,
          modify, distribute, or create derivative works from any content on our
          platform without our prior written consent.
        </Section>

        <Section title="5. Prohibited Conduct">
          While using our chat application, you agree not to:{"\n\n"}• Post or
          transmit any content that is defamatory, harassing, or otherwise
          unlawful.{"\n"}• Engage in spamming, phishing, or other fraudulent
          activities.{"\n"}• Attempt to gain unauthorized access to our systems
          or interfere with the proper functioning of the service.{"\n\n"}
          Violation of these terms may result in the suspension or termination
          of your account.
        </Section>

        <Section title="6. Privacy">
          Your privacy is important to us. Please refer to our Privacy Policy
          for information on how we collect, use, and disclose personal data.
        </Section>

        <Section title="7. Disclaimers and Limitation of Liability">
          Our chat application is provided "as is" without warranties of any
          kind. We do not guarantee that the service will be uninterrupted or
          error-free. In no event shall Connectify be liable for any indirect,
          incidental, or consequential damages arising out of your use or
          inability to use the service.
        </Section>

        <Section title="8. Termination">
          We reserve the right to suspend or terminate your access to the chat
          application at any time and without notice if you breach these Terms
          and Conditions or if we deem it necessary for the protection of our
          users and service.
        </Section>

        <Section title="9. Indemnification">
          You agree to indemnify, defend, and hold harmless Connectify, its
          affiliates, and their respective officers, directors, employees, and
          agents from any claims, damages, or losses arising out of your use of
          the service or your violation of these Terms and Conditions.
        </Section>

        <Section title="10. Changes to the Terms">
          We reserve the right to modify or update these Terms and Conditions at
          any time. Any changes will be posted on this page with an updated
          effective date. Your continued use of the service after any
          modifications indicates your acceptance of the new terms.
        </Section>

        {/* Diğer bölümler aynı şekilde kalacak */}

        <Section title="11. Contact Information">
          If you have any questions or concerns regarding these Terms and
          Conditions, please contact us at:{"\n"}
          <Text style={styles.emailText} onPress={handleEmailPress}>
            nagiyev.mahaddin@gmail.com
          </Text>
        </Section>

        <Text style={styles.acknowledgement}>
          By using our chat application, you acknowledge that you have read,
          understood, and agree to be bound by these Terms and Conditions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "auto",
    backgroundColor: color.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
    backgroundColor: color.secondaryColor,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: color.textPrimary,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  section: {
    marginBottom: 25,
    backgroundColor: color.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: color.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: color.primaryDark,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: color.textSecondary,
  },
  emailText: {
    color: color.primary,
    fontWeight: "500",
    marginTop: 5,
  },
  acknowledgement: {
    fontSize: 12,
    color: color.gray,
    marginTop: 25,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default TermsAndConditionsScreen;
