import React, { SyntheticEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import auth from "@/firebaseConfig";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";
import Link from "next/link";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setLoading = useSetRecoilState(loadingState);

  const handleSignIn = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log(user);
      router.replace("/products");
    } catch (error: any) {
      console.log(error);
      setError("아이디 또는 비밀번호가 일치하지 않습니다");
    } finally {
      setLoading(false);
    }
  };

  const enterSignIn = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSignIn(e);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <i className="fas fa-store"></i>
            </div>
            <h1 className="auth-title">환영합니다!</h1>
            <p className="auth-subtitle">MyShop에 로그인하세요</p>
          </div>

          <form onSubmit={handleSignIn} className="auth-form">
            <div className="auth-input-group">
              <label className="auth-label">
                <i className="fas fa-envelope"></i>
                <span>이메일</span>
              </label>
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                onKeyDown={enterSignIn}
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label">
                <i className="fas fa-lock"></i>
                <span>비밀번호</span>
              </label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상 입력하세요"
                  required
                  onKeyDown={enterSignIn}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas fa-eye${showPassword ? "-slash" : ""}`}
                  ></i>
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="auth-button auth-button--primary">
              <span>로그인</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              아직 계정이 없으신가요?
              <Link href="/signUp" className="auth-link">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="auth-circle auth-circle--1"></div>
          <div className="auth-circle auth-circle--2"></div>
          <div className="auth-circle auth-circle--3"></div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
