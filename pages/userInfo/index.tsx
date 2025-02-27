import React from "react";
import { useUser } from "@/context/UserProvider";

const UserInfoPage: React.FC = () => {
  const { user } = useUser();

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
    </div>
  );
};

export default UserInfoPage;
