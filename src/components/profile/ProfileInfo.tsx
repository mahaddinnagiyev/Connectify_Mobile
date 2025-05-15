import { View, Text, Animated } from "react-native";
import React from "react";
import { styles } from "./styles/profile-info";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { color } from "@/colors";
import EditProfileInfoModal from "../modals/profile/EditProfileInfoModal";
import { UserData } from "./ProfilePage";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import PrivacyLegendModal from "../modals/profile/PrivacyLegendModal";

interface ProfileInfoProps {
  isMyProfileScreen: boolean;
  isLoading: boolean;
  userData: UserData;
  shouldBlur: (privacy?: PrivacySettingsChoice) => boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
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

  // State And Functions
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = React.useState<boolean>(false);

  return (
    <>
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
            {isMyProfileScreen && (
              <MaterialIcons
                name="edit-square"
                size={24}
                color={color.primaryColor}
                onPress={() => setShowEditModal(true)}
              />
            )}
          </View>

          {/* Information Grid */}
          <View style={styles.infoGrid}>
            {[
              {
                label: "Bio",
                value: userData.account.bio ?? "This User Has No Bio",
                privacySetting: userData.privacySettings.bio,
                icon: "document-text" as const,
              },
              {
                label: "Location",
                value: userData.account.location ?? "This User Has No Location",
                privacySetting: userData.privacySettings.location,
                icon: "location" as const,
              },
              {
                label: "Last Seen",
                value: userData.account.last_login
                  ? new Date(userData.account.last_login + "Z")
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
                privacySetting: userData.privacySettings.last_login,
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
                  {shouldBlur(item.privacySetting) ? (
                    <SkeletonLoader
                      style={{ width: 120, height: 16, marginVertical: 4 }}
                    />
                  ) : (
                    <View style={styles.infoTextWithLock}>
                      <Text
                        style={styles.value}
                        numberOfLines={item.label === "Bio" ? 3 : 1}
                        ellipsizeMode="tail"
                      >
                        {item.value}
                      </Text>
                      {isMyProfileScreen && (
                        <>
                          {item.privacySetting ===
                            PrivacySettingsChoice.nobody && (
                            <MaterialIcons
                              name="lock-person"
                              size={20}
                              color="black"
                              style={styles.lockIcon}
                              onPress={() => setShowPrivacyModal(true)}
                            />
                          )}

                          {item.privacySetting ===
                            PrivacySettingsChoice.everyone && (
                            <MaterialIcons
                              name="public"
                              size={20}
                              color="black"
                              style={styles.lockIcon}
                              onPress={() => setShowPrivacyModal(true)}
                            />
                          )}

                          {item.privacySetting ===
                            PrivacySettingsChoice.my_friends && (
                            <MaterialIcons
                              name="people-alt"
                              size={20}
                              color="black"
                              style={styles.lockIcon}
                              onPress={() => setShowPrivacyModal(true)}
                            />
                          )}
                        </>
                      )}
                    </View>
                  )}
                  <View style={styles.divider} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {isMyProfileScreen && (
        <>
          <EditProfileInfoModal
            type="profile"
            visible={showEditModal}
            onClose={() => setShowEditModal(false)}
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

export default ProfileInfo;
