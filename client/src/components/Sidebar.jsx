import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdOutlineReportProblem, MdRateReview, MdMailOutline, MdAccountCircle, MdLogout } from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const role = localStorage.getItem("role") || "";
  const isAdmin = role === "admin";
  const isAgent = role === "agent";

  const getPortalHeader = () => {
    if (isAdmin) return "Admin Control";
    if (isAgent) return "Agent Desk";
    return "CMS Portal";
  };

  const getMenuItems = () => {
    if (isAdmin) {
      return [
        { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={22} /> },
        { name: "Global Escalations", path: "/complaints", icon: <MdOutlineReportProblem size={22} /> },
        { name: "Customer Feedback", path: "/feedback-history", icon: <MdRateReview size={22} /> },
        { name: "Messages Desk", path: "/messages", icon: <MdMailOutline size={22} /> }
      ];
    }
    if (isAgent) {
  return [
    {
      name: "Dashboard",
      path: "/agent/dashboard",
      icon: <MdDashboard size={22} />
    },
    {
      name: "Assigned Complaints",
      path: "/agent/assigned",
      icon: <MdOutlineReportProblem size={22} />
    },
    {
      name: "All Complaints",
      path: "/agent/all-complaints",
      icon: <MdOutlineReportProblem size={22} />
    },
    {
      name: "Customer Feedback",
      path: "/agent/feedback",
      icon: <MdRateReview size={22} />
    },
    {
      name: "Profile",
      path: "/agent/profile",
      icon: <MdAccountCircle size={22} />
    }
  ];
}
    return [
      { name: "Dashboard", path: "/dashboard", icon: <MdDashboard size={22} /> },
      { name: "My Complaints", path: "/complaints", icon: <MdOutlineReportProblem size={22} /> },
      { name: "Raise Complaint", path: "/raise-complaint", icon: <MdOutlineReportProblem size={22} /> }, 
      // Messages removed here
      { name: "Feedback", path: "/feedback", icon: <MdRateReview size={22} /> }, 
      { name: "Profile", path: "/profile", icon: <MdAccountCircle size={22} /> },
    ];
  };

  return (
    <div style={{ width: "256px", height: "100vh", backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0", position: "fixed", left: 0, top: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px", boxSizing: "border-box", zIndex: 50 }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", marginBottom: "24px" }}>
          <div style={{ width: "32px", height: "32px", backgroundColor: isAdmin ? "#dc2626" : isAgent ? "#059669" : "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: "bold" }}>
            {isAdmin ? "A" : isAgent ? "AG" : "C"}
          </div>
          <span style={{ fontWeight: "bold", fontSize: "20px", color: "#1e293b" }}>{getPortalHeader()}</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {getMenuItems().map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 16px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "14px", backgroundColor: isActive ? "#eff6ff" : "transparent", color: isActive ? "#2563eb" : "#64748b" }}>
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <button onClick={() => { localStorage.clear(); navigate("/"); }} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 16px", borderRadius: "12px", border: "none", backgroundColor: "transparent", color: "#ef4444", fontWeight: "600", fontSize: "14px", cursor: "pointer", width: "100%" }}>
        <MdLogout size={22} />
        <span>Logout</span>
      </button>
    </div>
  );
}