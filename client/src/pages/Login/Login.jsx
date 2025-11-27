import React, { useState } from "react";
import s from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

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
      const res = await axios.post("http://localhost:3001/api/login", {
        email,
        password
      });
      localStorage.setItem("token", res.data.token);

      console.log("Login Successful");
      navigate("/") //Navegación a la pagina del dataload

    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Invalid email or password")
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

