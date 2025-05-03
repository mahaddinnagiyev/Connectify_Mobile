import { Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState } from "react";
import { styles } from "./styles/detailHeader.style";
import { Ionicons } from "@expo/vector-icons";

const DetailHeader = () => {
  const [roomName] = useState("Design Team");

  return (
    <>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00ff00" />
        </TouchableOpacity>
        <Text style={styles.roomName} numberOfLines={1}>
          {roomName || "No Room Name"}
        </Text>
      </View>

      {/* User Profile */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={styles.profileImage}
        />
        <Text style={styles.fullName}>Emma Watson</Text>
        <Text style={styles.username}>@emmawatson</Text>
        <Text style={styles.bio}>📚 Book lover | ✨ Actress | 🌍 Activist</Text>
      </View>
    </>
  );
};

export default DetailHeader;
