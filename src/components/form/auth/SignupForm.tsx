import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "./styles/signupform";

const SignupForm = () => {
  const [selectedGender, setSelectedGender] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* First Name & Last Name */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first"
              placeholderTextColor="#888"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Username & Email */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#888"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Gender Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Gender</Text>
          <View style={styles.genderContainer}>
            {["Male", "Female", "Other"].map((gender) => (
              <Pressable
                key={gender}
                style={[
                  styles.genderButton,
                  selectedGender === gender && styles.selectedGender,
                ]}
                onPress={() => setSelectedGender(gender)}
              >
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === gender && styles.selectedGenderText,
                  ]}
                >
                  {gender}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#888"
            secureTextEntry
          />
          <Text style={styles.passwordHint}>
            Password must contain at least 8 characters, 1 uppercase letter, 1
            lowercase letter, 1 number, and 1 special character
          </Text>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password again"
            placeholderTextColor="#888"
            secureTextEntry
          />
        </View>

        {/* Terms Checkbox */}
        <Pressable
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <Ionicons
            name={acceptedTerms ? "checkbox" : "checkbox-outline"}
            size={24}
            color={acceptedTerms ? color.primaryColor : "#666"}
          />
          <Text style={styles.checkboxText}>
            I read the Terms and conditions and agree
          </Text>
        </Pressable>

        {/* Sign Up Button */}
        <Pressable style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default SignupForm;
