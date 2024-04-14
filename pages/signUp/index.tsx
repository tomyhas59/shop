import React, { SyntheticEvent, useState } from "react";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { SIGN_UP, SignUp } from "@/graphql/signUp";
import { useRouter } from "next/router";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { mutate: signUp } = useMutation(
    ({ email, nickname, password }: SignUp) =>
      graphqlFetcher<any>(SIGN_UP, { email, nickname, password })
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      signUp({ email, nickname, password });
      alert("가입이 완료되었습니다");
      router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="signUpPage">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit}>
        <label>
          이메일:
          <input
            className="inputField"
            name="email"
            placeholder="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          닉네임:
          <input
            className="inputField"
            name="nickname"
            placeholder="닉네임"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </label>
        <label>
          비밀번호:
          <input
            className="inputField"
            name="password"
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          비밀번호 확인:
          <input
            className="inputField"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </label>
        <button type="submit">확인</button>
      </form>
    </div>
  );
};

export default SignUpPage;
