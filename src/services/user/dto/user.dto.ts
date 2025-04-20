import { Gender } from "@/src/enums/gender.enum";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  gender: Gender;
  created_at: Date;
  face_descriptor?: number[];
}
