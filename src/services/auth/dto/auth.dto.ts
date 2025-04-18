export interface LoginDTO {
  username_or_email: string;
  password: string;
}

export interface FaceIdLoginDTO {
  username_or_email_face_id: string;
  face_descriptor: number[];
}
