import { Gender } from "@enums/gender.enum";

export interface LoginDTO {
  username_or_email: string;
  password: string;
}

export interface FaceIdLoginDTO {
  username_or_email_face_id: string;
  face_descriptor: number[];
}

export interface SignupDTO {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  gender: Gender;
  password: string;
  confirm: string;
}
