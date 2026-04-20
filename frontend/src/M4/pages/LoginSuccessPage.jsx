import React, { useEffect, useState } from "react";
import axios from "axios";

function LoginSuccessPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/module4/auth/me",
        { withCredentials: true }
      );

      setUser(res.data);
      localStorage.setItem("currentUser", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login Success</h2>
      {user ? (
        <div>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default LoginSuccessPage;