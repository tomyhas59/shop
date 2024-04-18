// src/utils/updateUser.ts
import { userState } from "@/recolis/user";
import { User } from "firebase/auth";
import { useSetRecoilState } from "recoil";

export const updateUser = (currentUser: User | null) => {
  const setUserState = useSetRecoilState(userState); // setUserState를 선언합니다.
  setUserState(currentUser); // setUserState를 사용하여 Recoil 상태를 업데이트합니다.
};
