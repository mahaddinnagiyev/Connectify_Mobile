import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { styles } from "./styles/loginform";

const LoginForm = () => {
  return (
    <>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username or Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username or email"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry
          />
        </View>

        <Pressable style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>
            Forgot password? Click here
          </Text>
        </Pressable>

        <Pressable style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    </>
  );
};

export default LoginForm;
