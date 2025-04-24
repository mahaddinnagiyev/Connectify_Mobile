import { View, Text, Pressable, Linking, Animated } from "react-native";
import React from "react";
import { styles } from "./styles/social-links";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import { useDispatch } from "react-redux";
import * as Clipboard from "expo-clipboard";
import { setSuccessMessage } from "@redux/messages/messageSlice";
import EditProfileInfoModal from "../modals/profile/EditProfileInfoModal";
import AddSocialLinkModal from "../modals/profile/AddSocialLinkModal";
import ConfirmModal from "../modals/confirm/ConfirmModal";
import { useUpdateProfile } from "@hooks/useUpdateProfile";
import { UserData } from "./ProfilePage";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import PrivacyLegendModal from "../modals/profile/PrivacyLegendModal";

interface SocialLinkProps {
  isMyProfileScreen: boolean;
  isLoading: boolean;
  userData: UserData;
  shouldBlur: (privacy?: PrivacySettingsChoice) => boolean;
}

const SocialLinks: React.FC<SocialLinkProps> = ({
  isMyProfileScreen,
  isLoading,
  userData,
  shouldBlur,
}) => {
  // Animations
  const fadeAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const SkeletonLoader = ({ style }: { style: any }) => (
    <Animated.View
      style={[
        {
          backgroundColor: "#E1E1E1",
          borderRadius: 4,
        },
        style,
        { opacity: fadeAnim },
      ]}
    />
  );

  const getSocialPrivacyIconName = () => {
    switch (userData.privacySettings.social_links) {
      case PrivacySettingsChoice.nobody:
        return "lock-person";
      case PrivacySettingsChoice.everyone:
        return "public";
      case PrivacySettingsChoice.my_friends:
        return "people-alt";
      default:
        return null;
    }
  };

  const socialPrivacyIconName = getSocialPrivacyIconName();

  // States & Functions
  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = React.useState<boolean>(false);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [showRemoveModal, setShowRemoveModal] = React.useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] =
    React.useState<boolean>(false);
  const [socialLinkId, setSocialLinkId] = React.useState<string | null>(null);

  const socialLinks = userData.account.social_links ?? [];

  const { removeSocialLink, isLoading: isRemoveLoading } = useUpdateProfile();

  const handleCopy = async (url: string) => {
    await Clipboard.setStringAsync(url);
    dispatch(setSuccessMessage("Link copied to clipboard"));
  };

  const handleOpen = async (url: string) => {
    await Linking.openURL(url);
  };

  const handleRemoveSocialLink = async () => {
    await removeSocialLink({ id: socialLinkId ?? "" });
    setShowRemoveModal(false);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Social Links */}
        {shouldBlur(userData.privacySettings.social_links) ? null : (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Social Links</Text>

              {isMyProfileScreen && (
                <View style={styles.headerActions}>
                  {/* Privacy icon */}
                  {socialPrivacyIconName && (
                    <MaterialIcons
                      name={socialPrivacyIconName}
                      size={20}
                      color="black"
                      style={styles.lockIcon}
                      onPress={() => setShowPrivacyModal(true)}
                    />
                  )}

                  {/* Add-button icon */}
                  <Pressable
                    style={styles.addButton}
                    onPress={() => setShowAddModal(true)}
                  >
                    <Ionicons
                      name="add-circle"
                      size={24}
                      color={color.primaryColor}
                    />
                  </Pressable>
                </View>
              )}
            </View>

            {/* Links */}
            {socialLinks.map((link) => (
              <View key={link.id} style={styles.linkCard}>
                {/* Platform and actions */}
                <View style={styles.linkHeader}>
                  <Text style={styles.platformText}>{link.name}</Text>
                  {isMyProfileScreen && (
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
                          onPress={() => {
                            setSocialLinkId(link.id);
                            setShowRemoveModal(true);
                          }}
                        />
                      </Pressable>
                    </View>
                  )}
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
                      <Ionicons
                        name="copy"
                        size={18}
                        color={color.primaryColor}
                      />
                      <Text style={styles.actionText}>Copy</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleOpen(link.link)}
                    >
                      <Ionicons
                        name="open"
                        size={18}
                        color={color.primaryColor}
                      />
                      <Text style={styles.actionText}>Open</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {isLoading && (
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Social Links</Text>
              <Pressable
                style={styles.addButton}
                onPress={() => setShowAddModal(true)}
              >
                {isMyProfileScreen && (
                  <Ionicons
                    name="add-circle"
                    size={24}
                    color={color.primaryColor}
                  />
                )}
              </Pressable>
            </View>

            {/* Link Card */}
            <View style={styles.linkCard}>
              {/* Platform and actions */}
              <View style={styles.linkHeader}>
                <Text style={styles.platformText}>
                  <SkeletonLoader style={{ width: "100%", height: 20 }} />
                </Text>
                {isMyProfileScreen && (
                  <View style={styles.actions}>
                    <Pressable style={styles.iconButton}>
                      <MaterialIcons
                        name="edit-square"
                        size={18}
                        color={color.primaryColor}
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
                )}
              </View>

              {/* Name, URL, and actions */}
              <View style={styles.linkBody}>
                <View>
                  <Text style={styles.nameText}>
                    <SkeletonLoader style={{ width: 170, height: 20 }} />
                  </Text>
                  <Text
                    style={styles.urlText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    <SkeletonLoader style={{ width: 170, height: 20 }} />
                  </Text>
                </View>

                <View style={styles.linkActions}>
                  <Pressable style={styles.actionButton}>
                    <Ionicons
                      name="copy"
                      size={18}
                      color={color.primaryColor}
                    />
                    <Text style={styles.actionText}>Copy</Text>
                  </Pressable>

                  <Pressable style={styles.actionButton}>
                    <Ionicons
                      name="open"
                      size={18}
                      color={color.primaryColor}
                    />
                    <Text style={styles.actionText}>Open</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        )}
      </View>

      {isMyProfileScreen && (
        <>
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

          <ConfirmModal
            visible={showRemoveModal}
            title="Remove Social Link"
            message="Are you sure you want to remove this social link?"
            confirmText="Remove"
            confirmColor="red"
            cancelText="Cancel"
            isLoading={isRemoveLoading}
            onCancel={() => setShowRemoveModal(false)}
            onConfirm={handleRemoveSocialLink}
          />

          <PrivacyLegendModal
            visible={showPrivacyModal}
            onClose={() => setShowPrivacyModal(false)}
          />
        </>
      )}
    </>
  );
};

export default SocialLinks;
