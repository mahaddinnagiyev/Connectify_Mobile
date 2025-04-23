import React from "react";
import PersonalInfo from "./PersonalInfo";
import ProfileInfo from "./ProfileInfo";
import SocialLinks from "./SocialLinks";
import { User } from "@services/user/dto/user.dto";
import { Account } from "@services/account/dto/account.dto";
import {
  PrivacySettings,
  PrivacySettingsChoice,
} from "@services/account/dto/privacy.dto";
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
  const userData = useSelector((state: RootState) =>
    isMyProfileScreen ? state.myProfile.userData : state.users.otherUserData
  );

  const friends = useSelector((s: RootState) => s.myFriends.friends);
  const [isFriend, setIsFriend] = React.useState(false);

  React.useEffect(() => {
    if (isMyProfileScreen) return setIsFriend(true);
    const yes = friends.some((f) => f.friend_id === userData.user.id);
    setIsFriend(yes);
  }, [isMyProfileScreen, friends, userData.user.id]);

  const shouldBlur = (privacy?: PrivacySettingsChoice) => {
    if (isLoading) return true;
    if (isMyProfileScreen) return false;
    if (privacy === PrivacySettingsChoice.nobody) return true;
    if (privacy === PrivacySettingsChoice.my_friends && !isFriend) {
      return true;
    }

    if (privacy === PrivacySettingsChoice.everyone) return false;
    return false;
  };

  return (
    <>
      <PersonalInfo
        isMyProfileScreen={isMyProfileScreen}
        userData={userData}
        isLoading={isLoading}
        shouldBlur={shouldBlur}
      />
      <ProfileInfo
        isMyProfileScreen={isMyProfileScreen}
        userData={userData}
        isLoading={isLoading}
        shouldBlur={shouldBlur}
      />
      <SocialLinks
        isMyProfileScreen={isMyProfileScreen}
        userData={userData}
        isLoading={isLoading}
        shouldBlur={shouldBlur}
      />
    </>
  );
};

export default ProfilePage;
