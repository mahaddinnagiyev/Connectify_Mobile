import axios from "axios";
import { User } from "./dto/user.dto";
import { Account } from "../account/dto/account.dto";
import { PrivacySettings } from "../account/dto/privacy.dto";

export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserResponse {
  success: boolean;
  user: User;
  account: Account;
  privacy_settings: PrivacySettings;
  response?: ApiResponse;
  message?: string;
  error?: string;
}
