import React, { useState } from "react";
import s from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ejecutivo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
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
      const res =       await axios.post("http://localhost:3001/api/users/register", {
        name,
        lastname,
        email,
        password,
        role
      });
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err)
      setError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }

  };

return (
      <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>Register</h1>

        <form onSubmit={handleRegister} className={s.form}>
          <div className={s.inputGroup}>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              className={s.input}
              aria-describedby={error ? "error-message" : undefined}
              disabled={loading}
            />
          </div>

          <div className={s.inputGroup}>
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastname(e.target.value)}
              className={s.input}
              aria-describedby={error ? "error-message" : undefined}
              disabled={loading}
            />
          </div>

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

          
          <div className={s.inputGroup}>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={s.select}>
            <option value="ejecutivo">Ejecutivo</option>
            <option value="gerente">Gerente</option>
          </select>
          </div>


          {error && (
            <div id="error-message" className={s.error} role="alert">
              {error}
            </div>
          )}
          <button type="submit" className={s.submitButton} disabled={loading}>
            Register
          </button>
        </form>
          <p className={s.register}>
            Access your account here.{" "}
            <Link to="/login" className={s.irregister}>
              Login
            </Link>
          </p>
      </div>
    </div>
  )
}

