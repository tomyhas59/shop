import React, { SyntheticEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../firebaseConfig";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserProvider";

const MainPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { user } = useUser();

  const handleSignIn = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      router.replace("/products");
    } catch (error: any) {
      console.log(error);
      setError("아이디 또는 비밀번호가 다릅니다");
    }
  };

  const enterSignIn = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSignIn(e);
    }
  };

  if (user) {
    return (
      <div className="userPage">
        <div>UserPage</div>
      </div>
    );
  } else
    return (
      <div className="mainPage">
        <h1>MainPage</h1>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="형식: aa@aa.aa"
            required
            onKeyDown={enterSignIn}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 6자 이상"
            required
            onKeyDown={enterSignIn}
          />
          <button type="submit" className="signButton">
            로그인
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
};

export default MainPage;
