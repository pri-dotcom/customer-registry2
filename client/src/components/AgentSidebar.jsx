import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AgentSidebar() {
  const location = useLocation();

  return (
    <div
      style={{
        width: "256px",
        height: "100vh",
        background: "#ffffff", // Pure white light theme background matching your exact layout
        color: "#1E293B",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "0px",
        boxSizing: "border-box",
        borderRight: "1px solid #E2E8F0", // Clear divider border line
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Brand Header Identity Block */}
      <div style={{ padding: "32px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "32px",
          height: "32px",
          backgroundColor: "#2563EB", // Primary theme blue logo box
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontWeight: "800",
          fontSize: "16px"
        }}>
          C
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: 0, letterSpacing: "-0.5px" }}>
          CMS Portal
        </h2>
      </div>

      {/* Main Navigation links using your exact routes, themes, and emojis */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 16px", flex: 1 }}>
        
        <Link 
          to="/agent/dashboard" 
          style={{ 
            color: location.pathname === "/agent/dashboard" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/agent/dashboard" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/agent/dashboard" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>📊</span> Dashboard
        </Link>

        <Link 
          to="/agent/assigned" 
          style={{ 
            color: location.pathname === "/agent/assigned" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/agent/assigned" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/agent/assigned" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>📥</span> Assigned Complaints
        </Link>

        <Link 
          to="/agent/all-complaints" 
          style={{ 
            color: location.pathname === "/agent/all-complaints" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/agent/all-complaints" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/agent/all-complaints" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>📝</span> All Complaints
        </Link>

        <Link 
          to="/agent/reports" 
          style={{ 
            color: location.pathname === "/agent/reports" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/agent/reports" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/agent/reports" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>📈</span> Reports
        </Link>

        <Link 
          to="/agent/feedback" 
          style={{ 
            color: location.pathname === "/agent/feedback" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/agent/feedback" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/agent/feedback" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>💬</span> Feedback
        </Link>

        <Link 
          to="/agent/profile" 
          style={{ 
            color: location.pathname === "/agent/profile" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/agent/profile" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/agent/profile" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>👤</span> Profile
        </Link>
      </div>

      {/* WORKING FIXED LOGOUT BUTTON */}
      <div style={{ padding: "24px 16px" }}>
        <button 
          onClick={() => {
            // Clear browser local cache storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Hard redirect to root index to securely loop back to login layout
            window.location.href = "/"; 
          }}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "transparent",
            color: "#EF4444", // Target alert red
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>↪️</span>
          Logout
        </button>
      </div>

    </div>
  );
}