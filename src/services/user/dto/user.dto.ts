import { Gender } from "@enums/gender.enum";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  gender: Gender | null;
  created_at: Date | null;
  face_descriptor: number[] | null;
}
