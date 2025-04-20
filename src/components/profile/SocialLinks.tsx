import { View, Text, Pressable, Linking } from "react-native";
import React from "react";
import { styles } from "./styles/social-links";
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

export default SocialLinks;
