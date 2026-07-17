import { API_URL } from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  console.log("THIS IS MY REGISTER PAGE");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        API_URL + "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Registration successful");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="register-container">

      {/* Left Panel */}

      <div className="register-left">

        <div className="register-left-content">

          <div className="logo-box">C</div>

          <h1>CMS Portal</h1>

          <h2>Simplify Your Request & Resolution Workflow.</h2>

          <p>
            Submit complaints, track processing metrics, and communicate
            directly with support staff.
          </p>

        </div>

      </div>

      {/* Right Panel */}

      <div className="register-right">

        <div className="register-card">

          <h3>Create Account</h3>

          <p className="subtitle">
            Register to access the Customer Management System.
          </p>

          <form className="register-form" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div
              style={{
                display: "flex",
                backgroundColor: "#e2e8f0",
                padding: "4px",
                borderRadius: "12px",
                marginBottom: "20px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "customer" })
                }
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor:
                    formData.role === "customer"
                      ? "#ffffff"
                      : "transparent",
                  color:
                    formData.role === "customer"
                      ? "#2563eb"
                      : "#64748b",
                }}
              >
                Customer
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "agent" })
                }
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor:
                    formData.role === "agent"
                      ? "#ffffff"
                      : "transparent",
                  color:
                    formData.role === "agent"
                      ? "#2563eb"
                      : "#64748b",
                }}
              >
                Agent
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: "admin" })
                }
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor:
                    formData.role === "admin"
                      ? "#ffffff"
                      : "transparent",
                  color:
                    formData.role === "admin"
                      ? "#2563eb"
                      : "#64748b",
                }}
              >
                Admin
              </button>
            </div>

            <button type="submit">
              Register
            </button>

          </form>

          <p className="bottom-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>
              Login
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;