import React, { SyntheticEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import auth from "@/firebaseConfig";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

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

  return (
    <div className="sign-in-page">
      <h1>로그인</h1>
      <form onSubmit={handleSignIn} className="sign-form">
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
        <button type="submit" className="sign-button">
          로그인
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignInPage;
