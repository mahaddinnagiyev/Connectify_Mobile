import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { color } from "@/colors";
import { styles } from "./styles/signupform";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { StackParamList } from "@navigation/AuthStack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setSignupForm } from "@redux/auth/authSlice";
import { Gender } from "@enums/gender.enum";
import {
  setErrorMessage,
  setInfoMessage,
  setSuccessMessage,
} from "@redux/messages/messageSlice";
import { signup } from "@services/auth/auth.service";
import * as Clipboard from "expo-clipboard";

const SignupForm = () => {
  const dispatch = useDispatch();
  const { signupForm } = useSelector((state: RootState) => state.auth);

  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { navigate } =
    useNavigation<NativeStackNavigationProp<StackParamList>>();

  const handleFormChange = (fieldName: string, value: string) => {
    dispatch(setSignupForm({ ...signupForm, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await signup(signupForm);
      if (response.success) {
        dispatch(
          setSuccessMessage(
            response.message ?? "Confirm email has been sent to your email."
          )
        );
        navigate("ConfirmAccount");
      } else {
        if (Array.isArray(response.response?.message)) {
          dispatch(setErrorMessage(response.response?.message[0]));
        } else {
          dispatch(
            setErrorMessage(
              response.response?.message ??
                response.response?.error ??
                response.message ??
                response.error ??
                "Something went wrong while signing up"
            )
          );
        }
      }
    } catch (error) {
      dispatch(
        setErrorMessage((error as Error).message) ??
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = async () => {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

    let password: string = "";
    const passwordLength = Math.floor(Math.random() * 8) + 8;

    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }

    await Clipboard.setStringAsync(password);
    dispatch(setSignupForm({ password: password, confirm: password }));
    dispatch(
      setInfoMessage(
        "A strong password has been created for you. We don’t keep a copy, so please remember to save it yourself. It’s been copied to your clipboard."
      )
    );
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={color.primaryColor}
            style={styles.loadingIndicator}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* First Name & Last Name */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first"
              placeholderTextColor="#888"
              value={signupForm.first_name}
              onChange={(e) =>
                handleFormChange("first_name", e.nativeEvent.text)
              }
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last"
              placeholderTextColor="#888"
              value={signupForm.last_name}
              onChange={(e) =>
                handleFormChange("last_name", e.nativeEvent.text)
              }
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
              value={signupForm.username}
              onChange={(e) => handleFormChange("username", e.nativeEvent.text)}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={signupForm.email}
              onChange={(e) => handleFormChange("email", e.nativeEvent.text)}
            />
          </View>
        </View>

        {/* Gender Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Gender</Text>
          <View style={styles.genderContainer}>
            {[Gender.male, Gender.female, Gender.other].map((gender) => (
              <Pressable
                key={gender}
                style={[
                  styles.genderButton,
                  selectedGender === gender && styles.selectedGender,
                ]}
                onPress={() => {
                  handleFormChange("gender", gender);
                  setSelectedGender(gender);
                }}
              >
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === gender && styles.selectedGenderText,
                  ]}
                >
                  {gender[0].toLocaleUpperCase() + gender.slice(1)}
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
            secureTextEntry={!isVisible}
            value={signupForm.password}
            onChange={(e) => handleFormChange("password", e.nativeEvent.text)}
          />
          <View
            style={[
              styles.eyeIcon,
              { top: "35%", flexDirection: "row", gap: 8 },
            ]}
          >
            <MaterialCommunityIcons
              name="form-textbox-password"
              size={24}
              color="black"
              onPress={generatePassword}
            />
            <MaterialIcons
              name={isVisible ? "visibility" : "visibility-off"}
              onPress={() => setIsVisible(!isVisible)}
              size={24}
              color="black"
            />
          </View>
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
            secureTextEntry={!isPasswordVisible}
            value={signupForm.confirm}
            onChange={(e) => handleFormChange("confirm", e.nativeEvent.text)}
          />
          <MaterialIcons
            name={isPasswordVisible ? "visibility" : "visibility-off"}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            size={24}
            color="black"
            style={styles.eyeIcon}
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
        <Pressable
          style={[
            styles.signupButton,
            {
              opacity:
                acceptedTerms &&
                selectedGender &&
                signupForm.first_name &&
                signupForm.last_name &&
                signupForm.username &&
                signupForm.email &&
                signupForm.password
                  ? 1
                  : 0.5,
            },
          ]}
          onPress={handleSubmit}
          disabled={
            !acceptedTerms ||
            !selectedGender ||
            !signupForm.first_name ||
            !signupForm.last_name ||
            !signupForm.username ||
            !signupForm.email ||
            !signupForm.password
          }
        >
          <Text style={styles.signupButtonText}>Sign up</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default SignupForm;
