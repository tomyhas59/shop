import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import auth from "@/firebaseConfig";

// 사용자 컨텍스트의 타입을 정의합니다.
interface UserContextType {
  user: User | null;
}

// 사용자 컨텍스트를 생성합니다.
const UserContext = createContext<UserContextType>({ user: null });

// 사용자 컨텍스트를 사용하기 위한 훅을 정의합니다.
export const useUser = () => useContext(UserContext);

// 사용자 컨텍스트를 제공하는 컴포넌트를 생성합니다.
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // 컴포넌트가 마운트되면 사용자 상태를 업데이트합니다.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // 컴포넌트가 언마운트될 때 구독을 정리합니다.
    return () => unsubscribe();
  }, []);

  // 사용자 컨텍스트를 제공합니다.
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
