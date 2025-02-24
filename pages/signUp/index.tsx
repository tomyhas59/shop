import React, { SyntheticEvent, useState } from "react";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { SIGN_UP, User } from "@/graphql/signUp";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const setLoading = useSetRecoilState(loadingState);

  const { mutate: signUp } = useMutation(
    ({ email, nickname, password }: User) =>
      graphqlFetcher<any>(SIGN_UP, { email, nickname, password }),
    {
      onError: (error: any) => {
        alert(error.response.errors[0].message);
      },
      onSuccess: () => {
        alert("가입이 완료되었습니다");
        router.push("/");
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다");
        return;
      }

      signUp({ email, nickname, password });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-up-page">
      <h1 className="sign-title">회원가입</h1>
      <form onSubmit={handleSubmit} className="sign-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            id="email"
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nickname" className="form-label">
            닉네임
          </label>
          <input
            id="nickname"
            className="form-input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            id="password"
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passwordConfirm" className="form-label">
            비밀번호 확인
          </label>
          <input
            id="password-confirm"
            className="form-input"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 확인하세요"
            required
          />
        </div>
        <button className="sign-button" type="submit">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
