import React from "react";
import { useUser } from "@/context/UserProvider";

const UserInfoPage: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="userInfoPage">
      <h1>User Information</h1>
      {user ? (
        <div className="userDetails">
          <div className="userInfo">
            <p className="userEmail">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="userNickname">
              <strong>Nickname:</strong> {user.displayName}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfoPage;
