import React from "react";

import { useUser } from "@/context/UserProvider";

const UserInfoPage: React.FC = () => {
  const { user } = useUser();
  return (
    <div className="userInfoPage">
      <h1>User Information</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Nickname: {user.displayName}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfoPage;
