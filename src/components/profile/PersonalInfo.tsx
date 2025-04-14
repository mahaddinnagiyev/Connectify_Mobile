import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
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

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingHorizontal: 16,
  },

  titleContainer: {
    alignItems: "center",
    gap: 16,
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
  },

  profile_picture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: color.primaryColor,
  },

  personalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  personalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: color.borderColor,
  },

  personalTitleContainerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  presonalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
  },

  infoGrid: {
    gap: 12,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  infoItem: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },

  infoItemFull: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    gap: 12,
  },

  infoLabel: {
    color: "#636E72",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
  },

  infoLine: {
    display: "none",
  },

  fieldIcon: {
    padding: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },

  changeProfilePhotoBtn: {
    backgroundColor: color.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  changeProfilePhotoText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default PersonalInfo;
