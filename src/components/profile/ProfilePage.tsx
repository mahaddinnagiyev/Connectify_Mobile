import React from "react";
import PersonalInfo from "./PersonalInfo";
import ProfileInfo from "./ProfileInfo";
import SocialLinks from "./SocialLinks";
import { User } from "@services/user/dto/user.dto";
import { Account } from "@services/account/dto/account.dto";
import { PrivacySettings } from "@services/account/dto/privacy.dto";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

interface ProfilePageProps {
  isMyProfileScreen: boolean;
  isLoading: boolean;
}

export interface UserData {
  user: User;
  account: Account;
  privacySettings: PrivacySettings;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  isMyProfileScreen,
  isLoading,
}) => {
  let userData: UserData;

  if (isMyProfileScreen) {
    userData = useSelector((state: RootState) => state.myProfile.userData);
  } else {
    userData = useSelector((state: RootState) => state.users.otherUserData);
  }

  return (
    <>
      <PersonalInfo
        isMyProfileScreen={isMyProfileScreen}
        userData={userData}
        isLoading={isLoading}
      />
      <ProfileInfo
        isMyProfileScreen={isMyProfileScreen}
        userData={userData}
        isLoading={isLoading}
      />
      <SocialLinks
        isMyProfileScreen={isMyProfileScreen}
        userData={userData}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProfilePage;
