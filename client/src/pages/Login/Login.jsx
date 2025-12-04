import React, { useState } from "react";
import s from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { getDocuments } from "../../services/documentService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters long")
      return
    }

    try { //Calling Backend
      setLoading(true)

      // Step 1: Login
      const res = await axios.post("http://localhost:3001/api/login", {
        email,
        password
      });

      const token = res.data.token;
      const user = res.data.user;

      // Step 2: Store token and user data
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      // Step 3: Fetch permissions from backend
      const permissionsRes = await axios.get(
        "http://localhost:3001/api/rbac/permissions",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Step 4: Store permissions
      sessionStorage.setItem("permissions", JSON.stringify(permissionsRes.data.permissions));

      // Step 5: Check if user has documents
      const documents = await getDocuments();

      console.log("Login Successful");
      console.log("Documents found:", documents);
      console.log("Documents length:", documents ? documents.length : 0);

      // Redirect to dashboard if documents exist, otherwise to data load
      if (documents && documents.length > 0) {
        console.log("Redirecting to dashboard - documents found");
        navigate("/app/dashboard");
      } else {
        console.log("Redirecting to dataload - no documents found");
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.message || err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }

  };

return (
      <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>Login</h1>

        <form onSubmit={handleLogin} className={s.form}>
          <div className={s.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className={s.input}
              aria-describedby={error ? "error-message" : undefined}
              disabled={loading}
            />
          </div>

          <div className={s.inputGroup}>
            <div className={s.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className={s.input}
                aria-describedby={error ? "error-message" : undefined}
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={s.eyeButton}
              >
                {showPassword ? "👁" : "👁"}
              </button>
            </div>
          </div>
          {error && (
            <div id="error-message" className={s.error} role="alert">
              {error}
            </div>
          )}
          <button type="submit" className={s.submitButton} disabled={loading}>
            Log In
          </button>
        </form>
          <p className={s.register}>
            First time here?{" "}
            <Link to="/register" className={s.irregister}>
              Register
            </Link>
          </p>
      </div>
    </div>
  )
}

