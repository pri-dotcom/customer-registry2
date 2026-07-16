import React, { useState, useEffect } from "react";

export default function Navbar({ title, userName }) {
  const role = localStorage.getItem("role") || "";
  const isAgentMode = role === "agent";
  const isAdminMode = role === "admin";
  
  // Helper to fetch data based on mode
  const getProfileData = () => {
    const nameKey = isAgentMode ? "agent_name" : isAdminMode ? "admin_name" : "customer_name";
    const photoKey = isAgentMode ? "agent_photo" : isAdminMode ? "admin_photo" : "customer_photo";
    
    return {
      name: localStorage.getItem(nameKey) || (isAgentMode ? "Agent Vikram" : isAdminMode ? "Admin Control" : "Smitha"),
      photo: localStorage.getItem(photoKey) || ""
    };
  };

  const [profileData, setProfileData] = useState(getProfileData);

  useEffect(() => {
    // This function updates state whenever the custom 'storage' event is triggered
    const syncProfile = () => {
      setProfileData(getProfileData());
    };

    window.addEventListener("storage", syncProfile);
    
    // Also useful to listen for a custom event if you trigger it manually
    window.addEventListener("profile-updated", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("profile-updated", syncProfile);
    };
  }, [isAgentMode]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "16px 32px", 
      borderBottom: "1px solid #E2E8F0", 
      backgroundColor: "#FFFFFF",
      marginBottom: "24px"
    }}>
      <div style={{ fontSize: "18px", fontWeight: "600", color: "#0F172A" }}>
        {title}
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A" }}>
            {userName || profileData.name}
          </div>
          <div style={{ fontSize: "12px", color: "#64748B" }}>
            {isAgentMode ? "Support Account" : isAdminMode ? "Admin Account" : "Customer Account"}
          </div>
        </div>
        
        {profileData.photo ? (
          <img 
            src={profileData.photo} 
            alt="Profile" 
            style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid #E2E8F0" }} 
          />
        ) : (
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "50%", 
            backgroundColor: isAgentMode ? "#DBEAFE" : "#F1F5F9", 
            color: isAgentMode ? "#2563EB" : "#475569", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontWeight: "700", 
            fontSize: "13px", 
            border: "1px solid #E2E8F0" 
          }}>
            {profileData.name[0]?.toUpperCase() || "S"}
          </div>
        )}
      </div>
    </div>
  );
}