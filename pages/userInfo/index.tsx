import React, { useState } from "react";
import { useUser } from "@/context/UserProvider";

const UserInfoPage: React.FC = () => {
  const { user } = useUser();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  return (
    <div className="user-info-page">
      <h1 className="user-title">User Information</h1>
      {user ? (
        <div className="user-details">
          <div className="user-info-card">
            <p className="user-email">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="user-nickname">
              <strong>Nickname:</strong> {user.displayName}
            </p>
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
      <form className="change-password-form">
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
          <label htmlFor="new-nassword" className="form-label">
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
          비밀번호 변경
        </button>
      </form>
    </div>
  );
};

export default UserInfoPage;
