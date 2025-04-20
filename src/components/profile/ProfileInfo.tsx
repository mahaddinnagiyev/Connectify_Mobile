import { View, Text } from "react-native";
import React from "react";
import { styles } from "./styles/profile-info";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

const ProfileInfo = () => {
  const { userData } = useSelector((state: RootState) => state.myProfile);

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
              value: userData.account.bio ?? "This User Has No Bio",
              icon: "document-text" as const,
            },
            {
              label: "Location",
              value: userData.account.location ?? "This User Has No Location",
              icon: "location" as const,
            },
            {
              label: "Last Seen",
              value: userData.account.last_login
                ? new Date(userData.account.last_login)
                    .toLocaleTimeString("az-AZ", {
                      timeZone: "Asia/Baku",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .toString()
                : "No Last Login Data",
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

export default ProfileInfo;
