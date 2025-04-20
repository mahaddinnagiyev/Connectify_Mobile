import { View, Text, Image, Pressable, Modal } from "react-native";
import React from "react";
import { styles } from "./styles/personal-info";
import { color } from "@/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ChangePhotoModal from "../modals/profile/ChangePhotoModal";
import ProfilePhotoModal from "../modals/profile/ProfilePhotoModal";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";

const PersonalInfo = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);

  const { userData } = useSelector((state: RootState) => state.myProfile);

  return (
    <>
      <View style={styles.container}>
        {/* Title And Profile Photo */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>My Profile</Text>
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
            <Pressable
              style={styles.profilePhotoEditIcon}
              onPress={() => setShowModal(true)}
            >
              <Ionicons name="camera" size={24} color="white" />
            </Pressable>
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
                <Text style={styles.infoValue}>{userData.user.first_name}</Text>
                <View style={styles.infoLine} />
              </View>

              <View style={[styles.infoItem]}>
                <Text style={styles.infoLabel}>Last Name</Text>
                <Text style={styles.infoValue}>{userData.user.last_name}</Text>
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
                icon: "mail" as const,
              },
              {
                label: "Gender",
                value: userData.user.gender,
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

      {showModal && (
        <ChangePhotoModal
          showModal={showModal}
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
    </>
  );
};

export default PersonalInfo;
