import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";

const SocialLinks = () => {
  const socialLinks = [
    {
      id: 1,
      platform: "GitHub",
      name: "@johndoe",
      url: "https://github.com/johndoe",
    },
    {
      id: 2,
      platform: "LinkedIn",
      name: "John Doe",
      url: "https://linkedin.com/in/johndoe",
    },
  ];

  const handleCopy = (url: string) => {
    window.navigator.clipboard.writeText(url);
  };

  const handleOpen = async (url: string) => {
    await Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Social Links</Text>
        <Pressable style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color={color.primaryColor} />
        </Pressable>
      </View>

      {/* Social Links */}
      {socialLinks.map((link) => (
        <View key={link.id} style={styles.linkCard}>
          {/* Platform and actions */}
          <View style={styles.linkHeader}>
            <Text style={styles.platformText}>{link.platform}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.iconButton}>
                <MaterialIcons
                  name="edit-square"
                  size={18}
                  color={color.primaryColor}
                />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <MaterialIcons name="highlight-remove" size={18} color="red" />
              </Pressable>
            </View>
          </View>

          {/* Name, URL, and actions */}
          <View style={styles.linkBody}>
            <View>
              <Text style={styles.nameText}>{link.name}</Text>
              <Text
                style={styles.urlText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {link.url}
              </Text>
            </View>

            <View style={styles.linkActions}>
              <Pressable
                style={styles.actionButton}
                onPress={() => handleCopy(link.url)}
              >
                <Ionicons name="copy" size={18} color={color.primaryColor} />
                <Text style={styles.actionText}>Copy</Text>
              </Pressable>

              <Pressable
                style={styles.actionButton}
                onPress={() => handleOpen(link.url)}
              >
                <Ionicons name="open" size={18} color={color.primaryColor} />
                <Text style={styles.actionText}>Open</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
  },
  addButton: {
    padding: 5,
  },
  linkCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  linkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingBottom: 10,
  },
  platformText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 5,
  },
  linkBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 4,
  },
  urlText: {
    fontSize: 14,
    color: color.primaryColor,
    fontWeight: "500",
    maxWidth: 200,
  },
  linkActions: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    color: color.primaryColor,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default SocialLinks;
