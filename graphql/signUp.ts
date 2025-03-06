import { gql } from "graphql-tag";

export type User = {
  uid?: string;
  email: string;
  nickname: string;
  password: string;
};

export const GET_USER = gql`
  query GET_USER {
    user {
      uid
      email
      nickname
    }
  }
`;

export const SIGN_UP = gql`
  mutation SIGN_UP($email: String, $password: String, $nickname: String) {
    signUp(email: $email, password: $password, nickname: $nickname) {
      uid
      email
      nickname
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation CHANGE_PASSWORD($oldPassword: String, $newPassword: String) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;
