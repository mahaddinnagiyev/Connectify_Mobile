import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { styles } from "./styles/faceidform";

const FaceIDForm = () => {
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

        <Pressable style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login with Face ID</Text>
        </Pressable>
      </View>
    </>
  );
};

export default FaceIDForm;
