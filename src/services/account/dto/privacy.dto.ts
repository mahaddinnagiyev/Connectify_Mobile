export enum PrivacySettingsChoice {
  everyone = "everyone",
  my_friends = "my_friends",
  nobody = "nobody",
}

export interface PrivacySettings {
  email: PrivacySettingsChoice;
  gender: PrivacySettingsChoice;
  bio: PrivacySettingsChoice;
  location: PrivacySettingsChoice;
  social_links: PrivacySettingsChoice;
  last_login: PrivacySettingsChoice;
}
