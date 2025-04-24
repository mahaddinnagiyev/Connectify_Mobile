import { View, Text, Image, Pressable, Animated } from "react-native";
import React from "react";
import { styles } from "./styles/personal-info";
import { color } from "@/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ChangePhotoModal from "../modals/profile/ChangePhotoModal";
import ProfilePhotoModal from "../modals/profile/ProfilePhotoModal";
import EditProfileInfoModal from "../modals/profile/EditProfileInfoModal";
import { UserData } from "./ProfilePage";
import { PrivacySettingsChoice } from "@services/account/dto/privacy.dto";
import PrivacyLegendModal from "../modals/profile/PrivacyLegendModal";

interface PersonalInfoProps {
  isMyProfileScreen: boolean;
  isLoading: boolean;
  userData: UserData;
  shouldBlur: (privacy?: PrivacySettingsChoice) => boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
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

  // States And Functions
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [showImageModal, setShowImageModal] = React.useState<boolean>(false);
  const [showEditModal, setShowEditModal] = React.useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] =
    React.useState<boolean>(false);

  return (
    <>
      <View style={styles.container}>
        {/* Title And Profile Photo */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {isLoading ? (
              <SkeletonLoader style={{ width: 150, height: 24 }} />
            ) : isMyProfileScreen ? (
              "My Profile"
            ) : (
              `@${userData.user.username}'s Profile`
            )}
          </Text>
          <View style={styles.profileImageContainer}>
            <Pressable onPress={() => setShowImageModal(true)}>
              <Image
                source={
                  userData.account.profile_picture
                    ? { uri: userData.account.profile_picture }
                    : require("@assets/images/no-profile-photo.png")
                }
                style={styles.profile_picture}
              />
            </Pressable>
            {isMyProfileScreen && (
              <Pressable
                style={styles.profilePhotoEditIcon}
                onPress={() => setShowModal(true)}
              >
                <Ionicons name="camera" size={24} color="white" />
              </Pressable>
            )}
          </View>
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

            {isMyProfileScreen && (
              <View>
                <MaterialIcons
                  name="edit-square"
                  size={24}
                  color={color.primaryColor}
                  onPress={() => setShowEditModal(true)}
                />
              </View>
            )}
          </View>

          {/* Personal Informations Content */}
          <View style={styles.infoGrid}>
            {/* First Row */}
            <View style={styles.infoRow}>
              <View style={[styles.infoItem]}>
                <Text style={styles.infoLabel}>First Name</Text>
                <Text style={styles.infoValue}>
                  {isLoading ? (
                    <SkeletonLoader style={{ width: 100, height: 16 }} />
                  ) : (
                    userData.user.first_name
                  )}
                </Text>
                <View style={styles.infoLine} />
              </View>

              <View style={[styles.infoItem]}>
                <Text style={styles.infoLabel}>Last Name</Text>
                <Text style={styles.infoValue}>
                  {isLoading ? (
                    <SkeletonLoader style={{ width: 100, height: 16 }} />
                  ) : (
                    userData.user.last_name
                  )}
                </Text>
                <View style={styles.infoLine} />
              </View>
            </View>

            {/* Other Fields */}
            {[
              {
                label: "Username",
                value: userData.user.username,
                icon: "at" as const,
              },
              {
                label: "Email",
                value: userData.user.email,
                privacySetting: userData.privacySettings.email,
                icon: "mail" as const,
              },
              {
                label: "Gender",
                value: userData.user.gender,
                privacySetting: userData.privacySettings.gender,
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  {shouldBlur(item.privacySetting) ? (
                    <SkeletonLoader
                      style={{ width: 120, height: 16, marginVertical: 4 }}
                    />
                  ) : (
                    <View style={styles.infoTextWithLock}>
                      <Text style={styles.infoValue}>{item.value}</Text>
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
                  <View style={styles.infoLine} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {showModal && isMyProfileScreen && (
        <ChangePhotoModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      )}

      {showImageModal && (
        <ProfilePhotoModal
          visible={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageSource={
            userData.account.profile_picture
              ? { uri: userData.account.profile_picture }
              : require("@assets/images/no-profile-photo.png")
          }
        />
      )}

      {isMyProfileScreen && (
        <>
          <EditProfileInfoModal
            type="personal"
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

export default PersonalInfo;
