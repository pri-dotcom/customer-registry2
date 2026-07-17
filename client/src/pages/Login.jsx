import { API_URL } from "../config";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Added state to manage view
  const [view, setView] = useState("login"); 

const handleLogin = async (e) => {

  e.preventDefault();

  try {

    let url;


    if(role === "agent"){

      url = API_URL + "/auth/agent-login";

    }
    else{

      url = API_URL + "/auth/login";

    }


    const response = await fetch(url, {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        email,
        password
      })

    });


    if (!response.ok) {
    const err = await response.json();
    alert(err.message);
    return;
}

const data = await response.json();


    if(data.success){


      // Save authentication details

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("role", data.user.role);
      
      if(data.user.role === "agent"){
        localStorage.setItem("agent_name", data.user.name);
        localStorage.setItem("agent_email", data.user.email);
        localStorage.setItem("agent_photo", data.user.profileImage || "");
      } else {
        localStorage.setItem("customer_name", data.user.name);
        localStorage.setItem("customer_email", data.user.email);
        localStorage.setItem("customer_photo", data.user.profileImage || "");
      }


      // Role based navigation

      if(data.user.role === "admin"){

        navigate("/admin/dashboard");

      }
      else if(data.user.role === "agent"){

        navigate("/agent/dashboard");

      }
      else{

        navigate("/dashboard");

      }


    }
    else{

      alert(data.message);

    }


  }
  catch(error){

    console.log(error);
    alert("Unable to connect to server");

  }

};
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "#F6F8FC" }}>
      {/* Left Branding Viewport Panel */}
      <div style={{ flex: 1, backgroundColor: "#2563eb", color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "64px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "460px" }}>
          <div style={{ width: "48px", height: "48px", backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "24px", marginBottom: "32px" }}>C</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", margin: "0 0 16px 0" }}>CMS Portal</h1>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#93c5fd", margin: "0 0 16px 0" }}>Simplify Your Request & Resolution Workflow.</h2>
          <p style={{ fontSize: "15px", color: "#bfdbfe", lineHeight: "1.6", margin: 0 }}>Submit complaints, track processing metrics, and communicate directly with support staff.</p>
        </div>
      </div>

      {/* Right Login Controls Block */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "64px", boxSizing: "border-box" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          
          {/* VIEW: LOGIN */}
          {view === "login" && (
            <>
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: "0 0 8px 0" }}>Welcome Back</h3>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Sign in to manage your support registry</p>
              </div>

              <div style={{ display: "flex", backgroundColor: "#e2e8f0", padding: "4px", borderRadius: "12px", marginBottom: "28px" }}>
                <button type="button" onClick={() => setRole("customer")} style={{ flex: 1, padding: "10px 0", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: role === "customer" ? "#ffffff" : "transparent", color: role === "customer" ? "#2563eb" : "#64748b" }}>Customer</button>
                <button type="button" onClick={() => setRole("agent")} style={{ flex: 1, padding: "10px 0", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: role === "agent" ? "#ffffff" : "transparent", color: role === "agent" ? "#2563eb" : "#64748b" }}>Agent Panel</button>
                <button type="button" onClick={() => setRole("admin")} style={{ flex: 1, padding: "10px 0", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", backgroundColor: role === "admin" ? "#ffffff" : "transparent", color: role === "admin" ? "#2563eb" : "#64748b" }}>Admin</button>
              </div>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <input type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "12px", outline: "none", boxSizing: "border-box" }} />
                <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "12px", outline: "none", boxSizing: "border-box" }} />
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600" }}>
                  <span onClick={() => setView("forgot")} style={{ color: "#2563eb", cursor: "pointer" }}>Forgot password?</span>
                  <span
onClick={() => navigate("/register")}
style={{ color:"#2563eb", cursor:"pointer" }}
>
Register now
</span>
                </div>
                
                <button type="submit" style={{ width: "100%", backgroundColor: "#2563eb", color: "#ffffff", padding: "14px", borderRadius: "12px", border: "none", fontWeight: "600", cursor: "pointer" }}>Login</button>
              </form>
            </>
          )}

          {/* VIEW: REGISTER */}
          {view === "register" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>Create Account</h3>
              <input type="text" placeholder="Full Name" style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "12px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              <input type="email" placeholder="Email" style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "12px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              <input type="password" placeholder="Password" style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "12px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              <button onClick={() => { alert("Registration successful!"); setView("login"); }} style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer" }}>Register</button>
              <p onClick={() => setView("login")} style={{ color: "#64748b", cursor: "pointer", marginTop: "15px", fontSize: "14px" }}>Back to Login</p>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === "forgot" && (
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginBottom: "20px" }}>Reset Password</h3>
              <input type="email" placeholder="Enter your registered email" style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "12px", border: "1px solid #cbd5e1", boxSizing: "border-box" }} />
              <button onClick={() => { alert("Password reset link sent to your email."); setView("login"); }} style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer" }}>Send Reset Link</button>
              <p onClick={() => setView("login")} style={{ color: "#64748b", cursor: "pointer", marginTop: "15px", fontSize: "14px" }}>Back to Login</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}