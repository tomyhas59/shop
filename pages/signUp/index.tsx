import React, { SyntheticEvent, useState } from "react";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { SIGN_UP, User } from "@/graphql/signUp";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";
import Link from "next/link";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const setLoading = useSetRecoilState(loadingState);

  const { mutate: signUp } = useMutation(
    ({ email, nickname, password }: User) =>
      graphqlFetcher<any>(SIGN_UP, { email, nickname, password }),
    {
      onMutate: () => {
        setLoading(true);
      },
      onError: (error: any) => {
        alert(error.response.errors[0].message);
      },
      onSuccess: () => {
        alert("가입이 완료되었습니다");
        router.push("/");
      },
    },
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      await signUp({ email, nickname, password });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = password === passwordConfirm && passwordConfirm !== "";

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h1 className="auth-title">회원가입</h1>
            <p className="auth-subtitle">MyShop의 회원이 되어보세요</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label">
                <i className="fas fa-user"></i>
                <span>닉네임</span>
              </label>
              <input
                type="text"
                className="auth-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="사용할 닉네임을 입력하세요"
                required
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

            <div className="auth-input-group">
              <label className="auth-label">
                <i className="fas fa-lock"></i>
                <span>비밀번호 확인</span>
              </label>
              <div className="auth-password-wrapper">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  className={`auth-input ${passwordConfirm && (passwordMatch ? "auth-input--success" : "auth-input--error")}`}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                  <i
                    className={`fas fa-eye${showPasswordConfirm ? "-slash" : ""}`}
                  ></i>
                </button>
              </div>
              {passwordConfirm && (
                <div
                  className={`auth-hint ${passwordMatch ? "auth-hint--success" : "auth-hint--error"}`}
                >
                  <i
                    className={`fas fa-${passwordMatch ? "check-circle" : "times-circle"}`}
                  ></i>
                  <span>
                    {passwordMatch
                      ? "비밀번호가 일치합니다"
                      : "비밀번호가 일치하지 않습니다"}
                  </span>
                </div>
              )}
            </div>

            <button type="submit" className="auth-button auth-button--primary">
              <span>가입하기</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              이미 계정이 있으신가요?
              <Link href="/signIn" className="auth-link">
                로그인
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

export default SignUpPage;
