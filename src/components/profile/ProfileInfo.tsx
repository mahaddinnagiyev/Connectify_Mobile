import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";

const ProfileInfo = () => {
  const profileData = {
    bio: "Frontend developer passionate about creating user-friendly interfaces and learning new technologies.",
    location: "Baku, Azerbaijan",
    lastSeen: "12:30",
  };

  return (
    <View style={styles.container}>
      {/* Profile Information Container */}
      <View style={styles.infoContainer}>
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <View style={styles.titleLeft}>
            <Ionicons
              name="information-circle"
              size={24}
              color={color.primaryColor}
            />
            <Text style={styles.titleText}>Profile Information</Text>
          </View>
          <MaterialIcons
            name="edit-square"
            size={24}
            color={color.primaryColor}
          />
        </View>

        {/* Information Grid */}
        <View style={styles.infoGrid}>
          {[
            {
              label: "Bio",
              value: profileData.bio,
              icon: "document-text" as const,
            },
            {
              label: "Location",
              value: profileData.location,
              icon: "location" as const,
            },
            {
              label: "Last Seen",
              value: profileData.lastSeen,
              icon: "time" as const,
            },
          ].map((item, index) => (
            <View key={index} style={styles.infoItem}>
              <Ionicons
                name={item.icon}
                size={20}
                color={color.primaryColor}
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text
                  style={styles.value}
                  numberOfLines={item.label === "Bio" ? 3 : 1}
                  ellipsizeMode="tail"
                >
                  {item.value}
                </Text>
                <View style={styles.divider} />
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
    marginTop: 15,
    paddingHorizontal: 16,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#ECECEC",
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
  },
  infoGrid: {
    gap: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    padding: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: "#636E72",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D3436",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginTop: 12,
  },
});

export default ProfileInfo;
