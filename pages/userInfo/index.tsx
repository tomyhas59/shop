import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import auth from "@/firebaseConfig";
const UserInfoPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="userInfoPage">
      <h1>User Information</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Display Name: {user.displayName}</p>
          {user.photoURL && <img src={user.photoURL} alt="Profile" />}
          {/* Render other user information here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserInfoPage;
