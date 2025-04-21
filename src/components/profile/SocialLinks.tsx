import { View, Text, Pressable, Linking } from "react-native";
import React from "react";
import { styles } from "./styles/social-links";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import { setSuccessMessage } from "@redux/messages/messageSlice";
import EditProfileInfoModal from "../modals/profile/EditProfileInfoModal";
import AddSocialLinkModal from "../modals/profile/AddSocialLinkModal";

const SocialLinks = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.myProfile);

  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [socialLinkId, setSocialLinkId] = React.useState<string | null>(null);

  const socialLinks = userData.account.social_links ?? [];

  const handleCopy = async (url: string) => {
    await Clipboard.setStringAsync(url);
    dispatch(setSuccessMessage("Link copied to clipboard"));
  };

  const handleOpen = async (url: string) => {
    await Linking.openURL(url);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Social Links</Text>
          <Pressable
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle" size={24} color={color.primaryColor} />
          </Pressable>
        </View>

        {/* Social Links */}
        {socialLinks.map((link) => (
          <View key={link.id} style={styles.linkCard}>
            {/* Platform and actions */}
            <View style={styles.linkHeader}>
              <Text style={styles.platformText}>{link.name}</Text>
              <View style={styles.actions}>
                <Pressable style={styles.iconButton}>
                  <MaterialIcons
                    name="edit-square"
                    size={18}
                    color={color.primaryColor}
                    onPress={() => {
                      setSocialLinkId(link.id);
                      setShowEditModal(true);
                    }}
                  />
                </Pressable>
                <Pressable style={styles.iconButton}>
                  <MaterialIcons
                    name="highlight-remove"
                    size={18}
                    color="red"
                  />
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
                  {link.link}
                </Text>
              </View>

              <View style={styles.linkActions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleCopy(link.link)}
                >
                  <Ionicons name="copy" size={18} color={color.primaryColor} />
                  <Text style={styles.actionText}>Copy</Text>
                </Pressable>

                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleOpen(link.link)}
                >
                  <Ionicons name="open" size={18} color={color.primaryColor} />
                  <Text style={styles.actionText}>Open</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>

      <AddSocialLinkModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditProfileInfoModal
        type="social-link"
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        socialLinkId={socialLinkId!}
      />
    </>
  );
};

export default SocialLinks;
