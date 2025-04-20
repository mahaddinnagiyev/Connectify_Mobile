import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { styles } from "./styles/personal-info";
import { color } from "@/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const PersonalInfo = () => {
  const userInfo = {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    gender: "Male",
  };

  return (
    <View style={styles.container}>
      {/* Title And Profile Photo */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Profile</Text>
        <Image
          source={require("@assets/images/no-profile-photo.png")}
          style={styles.profile_picture}
        />
        <Pressable style={styles.changeProfilePhotoBtn}>
          <Text style={styles.changeProfilePhotoText}>
            Change profile photo
          </Text>
        </Pressable>
      </View>

      {/* Personal Informations Container */}
      <View style={styles.personalContainer}>
        {/* Personal Informations Title */}
        <View style={styles.personalTitleContainer}>
          <View style={styles.personalTitleContainerLeft}>
            <Ionicons
              name="person-circle"
              size={24}
              color={color.primaryColor}
            />
            <Text style={styles.presonalTitle}>Personal Information</Text>
          </View>

          <View>
            <MaterialIcons
              name="edit-square"
              size={24}
              color={color.primaryColor}
            />
          </View>
        </View>

        {/* Personal Informations Content */}
        <View style={styles.infoGrid}>
          {/* First Row */}
          <View style={styles.infoRow}>
            <View style={[styles.infoItem]}>
              <Text style={styles.infoLabel}>First Name</Text>
              <Text style={styles.infoValue}>{userInfo.firstName}</Text>
              <View style={styles.infoLine} />
            </View>

            <View style={[styles.infoItem]}>
              <Text style={styles.infoLabel}>Last Name</Text>
              <Text style={styles.infoValue}>{userInfo.lastName}</Text>
              <View style={styles.infoLine} />
            </View>
          </View>

          {/* Other Fields */}
          {[
            {
              label: "Username",
              value: userInfo.username,
              icon: "at" as const,
            },
            { label: "Email", value: userInfo.email, icon: "mail" as const },
            {
              label: "Gender",
              value: userInfo.gender,
              icon: "male-female" as const,
            },
          ].map((item, index) => (
            <View key={index} style={styles.infoItemFull}>
              <Ionicons
                name={item.icon}
                size={20}
                color={color.primaryColor}
                style={styles.fieldIcon}
              />
              <View>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
                <View style={styles.infoLine} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PersonalInfo;
