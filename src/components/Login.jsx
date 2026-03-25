import React, { useState } from "react";

const users = [
  {
    id: "1",
    username: "CafeRoyal",
    password: "CafeRoyal123",
    restaurantId: "Cafe Royal",
    role: "manager",
  },
  {
    id: "2",
    username: "TheAnchor",
    password: "TheAnchor321",
    restaurantId: "The Anchor",
    role: "manager",
  },
  {
    id: "3",
    username: "HollyCow",
    password: "HollyCow123",
    restaurantId: "Holly Cow",
    role: "manager",
  },
  {
    id: "7",
    username: "admin",
    password: "admin123",
    restaurantId: "all",
    role: "admin",
  },
];

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );
    if (user) {
      onLogin(user);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login">
      <div className="login__intro">
        <span className="app-badge">Secure sign-in</span>
        <h2>Restaurant Login</h2>
        <p>Enter the login details to continue.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>

      <div className="login-info">
        <h3>Quick access</h3>
        <p>username: 'admin', password: 'admin123'</p>
      </div>
    </div>
  );
};

export default Login;
