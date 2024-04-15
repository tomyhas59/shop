import React, { SyntheticEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../firebaseConfig";
import { useRouter } from "next/router";

const MainPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const goToSignUpPage = () => {
    router.replace("/signUp");
  };

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
      if (error.code === "auth/user-not-found") {
        setError("가입되지 않은 이메일입니다.");
      } else if (error.code === "auth/wrong-password") {
        setError("잘못된 비밀번호입니다.");
      } else {
        setError("로그인에 실패했습니다.");
      }
    }
  };

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
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 6자 이상"
          required
        />
        <button type="submit">로그인</button>
        <button type="button" className="signUp" onClick={goToSignUpPage}>
          회원가입
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default MainPage;
