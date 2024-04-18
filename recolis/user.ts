// src/recoil/userState.ts
import { atom } from "recoil";
import { User } from "firebase/auth"; // Firebase의 User 타입을 가져옵니다.

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
