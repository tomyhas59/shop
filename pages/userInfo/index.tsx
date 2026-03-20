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
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const setLoading = useSetRecoilState(loadingState);

  const [changePasswordForm, setChangePasswordForm] = useState(false);

  const toggleChangePasswordForm = () => {
    setChangePasswordForm((prev) => !prev);
    if (changePasswordForm) {
      setOldPassword("");
      setNewPassword("");
      setPasswordConfirm("");
    }
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
      setLoading(false);
      return;
    }
    try {
      await changePassword(oldPassword, newPassword);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch =
    newPassword === passwordConfirm && passwordConfirm !== "";

  if (!user) {
    return (
      <div className="user-info-page">
        <div className="user-info-loading">
          <div className="user-info-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-info-page">
      <div className="user-info-container">
        <div className="user-info-header">
          <div className="user-info-avatar">
            <i className="fas fa-user"></i>
          </div>
          <h1 className="user-info-title">내 정보</h1>
        </div>

        <div className="user-info-card">
          <div className="user-info-section">
            <h2 className="user-info-section-title">
              <i className="fas fa-id-card"></i>
              <span>계정 정보</span>
            </h2>

            <div className="user-info-item">
              <div className="user-info-label">
                <i className="fas fa-envelope"></i>
                <span>이메일</span>
              </div>
              <div className="user-info-value">{user.email}</div>
            </div>

            <div className="user-info-item">
              <div className="user-info-label">
                <i className="fas fa-user-tag"></i>
                <span>닉네임</span>
              </div>
              <div className="user-info-value">{user.displayName}</div>
            </div>
          </div>

          <div className="user-info-section">
            <h2 className="user-info-section-title">
              <i className="fas fa-lock"></i>
              <span>보안 설정</span>
            </h2>

            <button
              className={`user-info-toggle-btn ${changePasswordForm ? "active" : ""}`}
              onClick={toggleChangePasswordForm}
            >
              <i
                className={`fas fa-${changePasswordForm ? "times" : "key"}`}
              ></i>
              <span>{changePasswordForm ? "취소" : "비밀번호 변경"}</span>
            </button>
          </div>

          {changePasswordForm && (
            <div className="user-info-password-section">
              <form className="user-info-form" onSubmit={handleChangePassword}>
                <div className="user-info-form-group">
                  <label className="user-info-form-label">
                    <i className="fas fa-lock"></i>
                    <span>현재 비밀번호</span>
                  </label>
                  <div className="user-info-password-wrapper">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      className="user-info-form-input"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="현재 비밀번호를 입력하세요"
                      required
                    />
                    <button
                      type="button"
                      className="user-info-password-toggle"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      <i
                        className={`fas fa-eye${showOldPassword ? "-slash" : ""}`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="user-info-form-group">
                  <label className="user-info-form-label">
                    <i className="fas fa-key"></i>
                    <span>새 비밀번호</span>
                  </label>
                  <div className="user-info-password-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="user-info-form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                      required
                    />
                    <button
                      type="button"
                      className="user-info-password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <i
                        className={`fas fa-eye${showNewPassword ? "-slash" : ""}`}
                      ></i>
                    </button>
                  </div>
                </div>

                <div className="user-info-form-group">
                  <label className="user-info-form-label">
                    <i className="fas fa-check"></i>
                    <span>새 비밀번호 확인</span>
                  </label>
                  <div className="user-info-password-wrapper">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      className={`user-info-form-input ${
                        passwordConfirm && (passwordMatch ? "success" : "error")
                      }`}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="새 비밀번호를 다시 입력하세요"
                      required
                    />
                    <button
                      type="button"
                      className="user-info-password-toggle"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                    >
                      <i
                        className={`fas fa-eye${showPasswordConfirm ? "-slash" : ""}`}
                      ></i>
                    </button>
                  </div>
                  {passwordConfirm && (
                    <div
                      className={`user-info-hint ${passwordMatch ? "success" : "error"}`}
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

                <button type="submit" className="user-info-submit-btn">
                  <i className="fas fa-save"></i>
                  <span>비밀번호 변경</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;
