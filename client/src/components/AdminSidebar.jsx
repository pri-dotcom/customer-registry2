import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div
      style={{
        width: "256px",
        height: "100vh",
        background: "#ffffff",
        color: "#1E293B",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "0px",
        boxSizing: "border-box",
        borderRight: "1px solid #E2E8F0",
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
          backgroundColor: "#DC2626", // Admin red color logo box
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontWeight: "800",
          fontSize: "16px"
        }}>
          A
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: 0, letterSpacing: "-0.5px" }}>
          Admin Control
        </h2>
      </div>

      {/* Main Navigation links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 16px", flex: 1 }}>
        
        <Link 
          to="/admin/dashboard" 
          style={{ 
            color: location.pathname === "/admin/dashboard" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/admin/dashboard" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/admin/dashboard" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>📊</span> Dashboard
        </Link>

        <Link 
          to="/admin/customers" 
          style={{ 
            color: location.pathname === "/admin/customers" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/admin/customers" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/admin/customers" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>👥</span> Customers
        </Link>

        <Link 
          to="/admin/complaints" 
          style={{ 
            color: location.pathname === "/admin/complaints" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/admin/complaints" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/admin/complaints" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>📝</span> Complaints
        </Link>

        <Link 
          to="/admin/reports" 
          style={{ 
            color: location.pathname === "/admin/reports" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/admin/reports" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/admin/reports" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>📈</span> Reports
        </Link>

        <Link 
          to="/admin/feedback" 
          style={{ 
            color: location.pathname === "/admin/feedback" ? "#2563EB" : "#64748B", 
            backgroundColor: location.pathname === "/admin/feedback" ? "#EFF6FF" : "transparent",
            textDecoration: "none",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: location.pathname === "/admin/feedback" ? "600" : "500",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span style={{ fontSize: "16px" }}>💬</span> Customer Feedback
        </Link>
      </div>

      {/* FIXED LOGOUT BUTTON */}
      <div style={{ padding: "24px 16px" }}>
        <button 
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/"; 
          }}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "transparent",
            color: "#EF4444",
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
