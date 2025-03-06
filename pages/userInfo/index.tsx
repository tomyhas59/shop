import React, { SyntheticEvent, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { useSetRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

const UserInfoPage: React.FC = () => {
  const { user } = useUser();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const setLoading = useSetRecoilState(loadingState);

  const [changePasswordForm, setChangePasswordForm] = useState(false);

  const toggleChangePasswordForm = () => {
    setChangePasswordForm((prev) => !prev);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("사용자가 로그인되지 않았습니다.");
      }

      if (!user.email) {
        throw new Error("사용자의 이메일을 찾을 수 없습니다.");
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      alert("비밀번호가 변경되었습니다.");
      setChangePasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      setPasswordConfirm("");
      return;
    } catch (error: any) {
      alert("기존 비밀번호가 다릅니다");
    }
  };

  const handleChangePassword = async (e: SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    if (newPassword !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      changePassword(oldPassword, newPassword);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-info-page">
      <h1 className="user-title">내 정보</h1>
      {user ? (
        <div className="user-details">
          <p className="user-email">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="user-nickname">
            <strong>Nickname:</strong> {user.displayName}
          </p>
          <p>
            <button
              className="change-password-button"
              onClick={toggleChangePasswordForm}
            >
              {changePasswordForm ? "취소" : "비밀번호 변경"}
            </button>
          </p>
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
      {changePasswordForm && (
        <form className="change-password-form" onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="old-password" className="form-label">
              이전 비밀번호
            </label>
            <input
              id="old-password"
              className="form-input"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="이전 비밀번호를 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password" className="form-label">
              새 비밀번호
            </label>
            <input
              id="new-password"
              className="form-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password-confirm" className="form-label">
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
          <button className="change-password-button" type="submit">
            비밀번호 변경
          </button>
        </form>
      )}
    </div>
  );
};

export default UserInfoPage;
