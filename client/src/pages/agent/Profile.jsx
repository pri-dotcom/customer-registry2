import { API_URL } from "../../config";
import React, { useState, useEffect } from "react";
import AgentSidebar from "../../components/AgentSidebar";
import Navbar from "../../components/Navbar";

export default function AgentProfile() {
  const [name, setName] = useState(() => localStorage.getItem("agent_name") || "Agent Vikram");
  const [empId, setEmpId] = useState(() => localStorage.getItem("agent_empid") || "EMP-2026-908");
  const [email, setEmail] = useState(() => localStorage.getItem("agent_email") || "vikram.support@cms.com");
  const [dept, setDept] = useState(() => localStorage.getItem("agent_dept") || "Broadband & Fiber Routing");
  const [photo, setPhoto] = useState(() => localStorage.getItem("agent_photo") || "");
  const [resolvedCount] = useState("342 Cases");

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(API_URL + "/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setDept(data.user.department || "");
          setPhoto(data.user.profileImage || "");
          setEmpId(data.user._id || "");
          
          localStorage.setItem("agent_name", data.user.name || "");
          localStorage.setItem("agent_email", data.user.email || "");
          localStorage.setItem("agent_photo", data.user.profileImage || "");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMe();
  }, []);

  // Handle uploading photos from phone/computer storage
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Saves image file string representation
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(API_URL + "/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name,
          department: dept,
          profileImage: photo
        })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("agent_name", name);
        localStorage.setItem("agent_email", email);
        localStorage.setItem("agent_photo", photo);
        localStorage.setItem("agent_dept", dept);
        setIsEditing(false);
        alert("Profile updated successfully!");
        window.location.reload(); // Refresh to broadcast changes to the Navbar immediately
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving profile details.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AgentSidebar />
      <div style={{ flex: 1, marginLeft: "256px", boxSizing: "border-box" }}>
        
        <Navbar title="Agent Workspace Profile" />

        <div style={{ padding: "0 40px 40px 40px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "800px", backgroundColor: "#ffffff", padding: "40px", borderRadius: "24px", border: "1px solid #EEF2F6", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
            
            {/* Upper Profile Identity Layout Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
              <div style={{ position: "relative" }}>
                {photo ? (
                  <img src={photo} alt="Profile" style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", border: "3px solid #DBEAFE" }} />
                ) : (
                  <div style={{ width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#DBEAFE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "700" }}>
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
                {/* Hidden File Input Picker natively triggered via styling */}
                <label style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#2563EB", color: "#fff", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px", border: "2px solid #fff" }}>
                  📷
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                </label>
              </div>

              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>{name}</h2>
                <p style={{ fontSize: "14px", color: "#64748B", margin: "4px 0 0 0" }}>Tier 2 Technical Desk Support</p>
              </div>
            </div>

            {/* Editable Profile Information Form Grid Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", marginBottom: "8px" }}>Employee ID</label>
                <input type="text" value={empId} disabled={!isEditing} onChange={(e) => setEmpId(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: isEditing ? "#ffffff" : "#F8FAFC", color: "#1E293B", fontWeight: "600" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", marginBottom: "8px" }}>Email Address</label>
                <input type="email" value={email} disabled={!isEditing} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: isEditing ? "#ffffff" : "#F8FAFC", color: "#1E293B", fontWeight: "600" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", marginBottom: "8px" }}>Assigned Dept</label>
                <input type="text" value={dept} disabled={!isEditing} onChange={(e) => setDept(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: isEditing ? "#ffffff" : "#F8FAFC", color: "#1E293B", fontWeight: "600" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", marginBottom: "8px" }}>Resolved Tickets</label>
                <div style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", color: "#10B981", fontWeight: "700" }}>{resolvedCount}</div>
              </div>
            </div>

            {/* Optional Name Modification Field (Visible only when editing) */}
            {isEditing && (
              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", marginBottom: "8px" }}>Agent Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #2563EB", backgroundColor: "#ffffff", color: "#1E293B", fontWeight: "600" }} />
              </div>
            )}

            {/* Form Actions Action Controller Triggers */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {isEditing ? (
                <button onClick={handleSaveProfile} style={{ padding: "12px 28px", backgroundColor: "#10B981", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>
                  Save Profile Changes
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} style={{ padding: "12px 28px", backgroundColor: "#2563EB", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer" }}>
                  Edit Details
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}