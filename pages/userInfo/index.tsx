import React, { SyntheticEvent, useState } from "react";
import { useUser } from "@/context/UserProvider";

const UserInfoPage: React.FC = () => {
  const { user } = useUser();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [changePasswordForm, setChangePasswordForm] = useState(false);

  const toggleChangePasswordForm = () => {
    setChangePasswordForm((prev) => !prev);
  };

  const handleChangePassword = (e: SyntheticEvent) => {
    e.preventDefault();
    alert("비밀번호가 변경되었습니다.");
    setChangePasswordForm(false);
    setOldPassword("");
    setNewPassword("");
    setPasswordConfirm("");
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
