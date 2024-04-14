import { useRouter } from "next/router";
import React from "react";

const MainPage = () => {
  const router = useRouter();
  const goToSignUpPage = () => {
    router.replace("/signUp");
  };

  return (
    <div className="mainPage">
      <h1>MainPage</h1>
      <form>
        <input className="email" type="text" placeholder="email" />
        <input className="password" type="password" placeholder="password" />
        <div>
          <button className="loginButton" type="submit">
            로그인
          </button>
          <button type="button" className="signUp" onClick={goToSignUpPage}>
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainPage;
