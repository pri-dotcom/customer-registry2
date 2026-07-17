import { API_URL } from "../config";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; 
import Navbar from "../components/Navbar";

export default function Profile() {
  // --- STATE PERSISTENCE MANAGEMENT ---
  const [fullName, setFullName] = useState(() => localStorage.getItem("customer_name") || "Bobby Smith");
  const [dob, setDob] = useState(() => localStorage.getItem("customer_dob") || "1998-05-15");
  const [email, setEmail] = useState(() => localStorage.getItem("customer_email") || "bobby@gmail.com");
  const [contactMethod, setContactMethod] = useState(() => localStorage.getItem("customer_contact") || "Email");
  const [phone, setPhone] = useState(() => localStorage.getItem("customer_phone") || "+1 987 654 3210");
  const [address, setAddress] = useState(() => localStorage.getItem("customer_address") || "123 Main Street, New York, USA");
  const [photo, setPhoto] = useState(() => localStorage.getItem("customer_photo") || "");
  
  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Tab, Theme, and Toggle Switches States
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [selectedTheme, setSelectedTheme] = useState("Light");
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(false);

  // Customizable Fields State
  const [customFields, setCustomFields] = useState([]);
  const [userCustomFields, setUserCustomFields] = useState({});

  // Load Profile from backend on mount
  useEffect(() => {
    const fetchProfileAndFields = async () => {
      try {
        const fieldsRes = await fetch(API_URL + "/admin/custom-fields", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const fieldsData = await fieldsRes.json();
        if (fieldsData.success) {
          setCustomFields(fieldsData.data);
        }

        const response = await fetch(API_URL + "/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          setFullName(data.data.name || "");
          setEmail(data.data.email || "");
          setPhone(data.data.phone || "");
          setAddress(data.data.address || "");
          setPhoto(data.data.profileImage || "");
          setUserCustomFields(data.data.customFields || {});
          
          localStorage.setItem("customer_name", data.data.name || "");
          localStorage.setItem("customer_email", data.data.email || "");
          localStorage.setItem("customer_photo", data.data.profileImage || "");
          localStorage.setItem("customer_phone", data.data.phone || "");
          localStorage.setItem("customer_address", data.data.address || "");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfileAndFields();
  }, []);

  // Dynamic Layout Color Themes
  const isDark = selectedTheme === "Dark";
  const colors = {
    bodyBg: isDark ? "#0F172A" : "#F8FAFC",
    cardBg: isDark ? "#1E293B" : "#FFFFFF",
    textMain: isDark ? "#F8FAFC" : "#0F172A",
    textSub: isDark ? "#94A3B8" : "#64748B",
    border: isDark ? "#334155" : "#E2E8F0",
    inputBg: isDark ? "#1E293B" : "#FFFFFF",
    inputBorder: isDark ? "#475569" : "#E2E8F0",
    divider: isDark ? "#334155" : "#F1F5F9",
  };

  // Image Upload Module Stream
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        localStorage.setItem("customer_photo", reader.result);
        window.dispatchEvent(new Event("storage"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(API_URL + "/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: fullName,
          phone,
          address,
          profileImage: photo,
          customFields: userCustomFields
        })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("customer_name", fullName);
        localStorage.setItem("customer_email", email);
        localStorage.setItem("customer_photo", photo);
        localStorage.setItem("customer_phone", phone);
        localStorage.setItem("customer_address", address);
        
        // ⚡ Dispatches global event to sync Navbar layout instantly
        window.dispatchEvent(new Event("storage"));
        alert("Profile configurations saved successfully!");
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const response = await fetch(API_URL + "/profile/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setActiveTab("Profile Information");
      } else {
        alert(data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently erase your profile registry?")) {
      try {
        const response = await fetch(API_URL + "/profile", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success) {
          alert("Account deleted successfully!");
          localStorage.clear();
          window.location.href = "/";
        } else {
          alert(data.message || "Failed to delete account.");
        }
      } catch (error) {
        console.error(error);
        alert("Error deleting account.");
      }
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: colors.bodyBg, color: colors.textMain, fontFamily: "system-ui, sans-serif", transition: "all 0.2s ease" }}>
      
      {/* 1. UNIVERSAL SIDEBAR PANEL */}
      <Sidebar />

      {/* 2. MAIN HUB WORKSPACE CONTENT WRAPPER */}
      <div style={{ flex: 1, marginLeft: "256px", backgroundColor: colors.bodyBg, minHeight: "100vh", display: "flex", flexDirection: "column", minWidth: 0, transition: "all 0.2s ease" }}>
        
        {/* Navbar Component Integration */}
        <Navbar title="Profile" isDark={isDark} />

        {/* Content Box Area Layout */}
        <div style={{ padding: "24px", boxSizing: "border-box", width: "100%" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: colors.textMain, margin: "0 0 4px 0" }}>My Profile</h1>
          <p style={{ color: colors.textSub, fontSize: "14px", margin: "0 0 24px 0" }}>Manage your personal information and account settings.</p>

          {/* Sub Navigation Bar Tabs */}
          <div style={{ display: "flex", gap: "24px", borderBottom: `1px solid ${colors.border}`, marginBottom: "32px" }}>
            {[
              { id: "Profile Information", icon: "👤" },
              { id: "Security", icon: "🔒" },
              { id: "Activity", icon: "🕒" }
            ].map((tab) => {
              const isTabActive = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: isTabActive ? "#2563EB" : colors.textSub,
                    fontWeight: isTabActive ? "600" : "500",
                    borderBottom: isTabActive ? "2px solid #2563EB" : "2px solid transparent",
                    paddingBottom: "12px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  <span>{tab.icon}</span> {tab.id}
                </div>
              );
            })}
          </div>

          {/* TWO COLUMN GRID CONTENT */}
          <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
            
            {/* LEFT COLUMN PANEL BLOCK */}
            <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {activeTab === "Profile Information" && (
                <>
                  {/* BLOCK A: PERSONAL DETAILS SPECIFICATION CARD */}
                  <div style={{ backgroundColor: colors.cardBg, padding: "32px", borderRadius: "16px", border: `1px solid ${colors.border}`, transition: "all 0.2s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", backgroundColor: isDark ? "#1E3A8A" : "#EFF6FF", color: "#2563EB", borderRadius: "8px", fontSize: "16px" }}>👤</div>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: colors.textMain, margin: 0 }}>Personal Information</h3>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Full Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Date of Birth</label>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Preferred Contact Method</label>
                        <select value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }}>
                          <option value="Phone">Phone</option>
                          <option value="Email">Email</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Phone Number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                      </div>
                      
                      {customFields.length > 0 && (
                        <div style={{ gridColumn: "1 / span 2", borderTop: `1px solid ${colors.border}`, paddingTop: "24px", marginTop: "8px" }}>
                          <h4 style={{ fontSize: "14px", fontWeight: "700", color: colors.textMain, margin: "0 0 16px 0" }}>Additional Information</h4>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                            {customFields.map((field) => (
                              <div key={field._id}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>
                                  {field.name} {field.isRequired && <span style={{ color: "#ef4444" }}>*</span>}
                                </label>
                                <input
                                  type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                                  value={userCustomFields[field.name] || ""}
                                  onChange={(e) => setUserCustomFields({ ...userCustomFields, [field.name]: e.target.value })}
                                  required={field.isRequired}
                                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={handleSaveChanges} style={{ padding: "12px 24px", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* BLOCK B: CONFIGURATION PREFERENCES SELECTION SHEET */}
                  <div style={{ backgroundColor: colors.cardBg, padding: "32px", borderRadius: "16px", border: `1px solid ${colors.border}`, transition: "all 0.2s ease" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", backgroundColor: isDark ? "#1E3A8A" : "#EFF6FF", color: "#2563EB", borderRadius: "8px", fontSize: "16px" }}>⚙️</div>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: colors.textMain, margin: 0 }}>Preferences</h3>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "24px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Language</label>
                        <select style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px" }}>
                          <option>English (US)</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Theme</label>
                        <div style={{ display: "flex", backgroundColor: isDark ? "#0F172A" : "#F1F5F9", padding: "4px", borderRadius: "10px", gap: "4px" }}>
                          {["Light", "Dark"].map((themeVal) => {
                            const active = selectedTheme === themeVal;
                            return (
                              <button
                                key={themeVal}
                                type="button"
                                onClick={() => setSelectedTheme(themeVal)}
                                style={{
                                  flex: 1,
                                  border: "none",
                                  padding: "8px 12px",
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  backgroundColor: active ? (isDark ? "#334155" : "#FFFFFF") : "transparent",
                                  color: active ? colors.textMain : colors.textSub,
                                  transition: "all 0.15s ease"
                                }}
                              >
                                {themeVal === "Light" ? "☀️ Light" : "🌙 Dark"}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${colors.divider}` }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: colors.textMain }}>Email Notifications</div>
                          <div style={{ fontSize: "12px", color: colors.textSub }}>Receive email updates about your complaints</div>
                        </div>
                        <input type="checkbox" checked={emailNotify} onChange={() => setEmailNotify(!emailNotify)} style={{ width: "38px", height: "20px", cursor: "pointer" }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: colors.textMain }}>SMS Notifications</div>
                          <div style={{ fontSize: "12px", color: colors.textSub }}>Receive SMS updates about your complaints</div>
                        </div>
                        <input type="checkbox" checked={smsNotify} onChange={() => setSmsNotify(!smsNotify)} style={{ width: "38px", height: "20px", cursor: "pointer" }} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Security" && (
                <div style={{ backgroundColor: colors.cardBg, padding: "32px", borderRadius: "16px", border: `1px solid ${colors.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", backgroundColor: "#FEE2E2", color: "#EF4444", borderRadius: "8px", fontSize: "16px" }}>🔒</div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: colors.textMain, margin: 0 }}>Update Password</h3>
                  </div>

                  <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Current Password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>New Password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: colors.textSub, marginBottom: "8px" }}>Confirm New Password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${colors.inputBorder}`, color: colors.textMain, backgroundColor: colors.inputBg, fontSize: "14px", boxSizing: "border-box" }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button type="submit" style={{ padding: "12px 24px", backgroundColor: "#EF4444", color: "#FFFFFF", border: "none", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "Activity" && (
                <div style={{ backgroundColor: colors.cardBg, padding: "32px", borderRadius: "16px", border: `1px solid ${colors.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", backgroundColor: "#FEF3C7", color: "#D97706", borderRadius: "8px", fontSize: "16px" }}>🕒</div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: colors.textMain, margin: 0 }}>Recent Activity Log</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { event: "Profile updated successfully", time: "Just now" },
                      { event: "Logged in via Web Application Chrome", time: "2 hours ago" },
                      { event: "Complaint #44129 status modified to Resolved", time: "Yesterday" }
                    ].map((act, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i !== 2 ? `1px solid ${colors.divider}` : "none" }}>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: colors.textMain }}>{act.event}</span>
                        <span style={{ fontSize: "12px", color: colors.textSub }}>{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN SIDEBAR WIDGET CARD LIST */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "32px" }}>
              
              {/* Profile Summary Widget */}
              <div style={{ backgroundColor: colors.cardBg, padding: "32px", borderRadius: "16px", border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  {photo ? (
                    <img src={photo} alt="Avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid #EFF6FF" }} />
                  ) : (
                    <div style={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "700" }}>
                      {fullName[0]?.toUpperCase()}
                    </div>
                  )}
                  
                  <label style={{ position: "absolute", bottom: "0", right: "0", backgroundColor: "#2563EB", color: "#FFFFFF", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid #FFFFFF", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    📷
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                  </label>
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: "700", color: colors.textMain, margin: "0 0 6px 0" }}>{fullName}</h2>
                <span style={{ backgroundColor: isDark ? "#1E3A8A" : "#EFF6FF", color: "#2563EB", fontSize: "12px", padding: "4px 12px", borderRadius: "20px", fontWeight: "600", marginBottom: "6px" }}>
                  {(localStorage.getItem("role") || "customer").charAt(0).toUpperCase() + (localStorage.getItem("role") || "customer").slice(1)}
                </span>
                <p style={{ color: colors.textSub, fontSize: "12px", margin: "0 0 24px 0", fontWeight: "500" }}>Member since May 2025</p>
                
                <div style={{ width: "100%", display: "flex", justifyContent: "space-between", borderTop: `1px solid ${colors.divider}`, paddingTop: "20px" }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: colors.textMain }}>12</div>
                    <div style={{ fontSize: "11px", color: colors.textSub, marginTop: "2px" }}>Total Complaints</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1, borderLeft: `1px solid ${colors.divider}`, borderRight: `1px solid ${colors.divider}` }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: colors.textMain }}>8</div>
                    <div style={{ fontSize: "11px", color: colors.textSub, marginTop: "2px" }}>Resolved</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: colors.textMain }}>4.5</div>
                    <div style={{ fontSize: "11px", color: colors.textSub, marginTop: "2px" }}>Avg. Rating</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Container List */}
              <div style={{ backgroundColor: colors.cardBg, padding: "24px", borderRadius: "16px", border: `1px solid ${colors.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", color: colors.textMain }}>
                  <span>⚡</span> <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>Quick Actions</h4>
                </div>
                
                <div onClick={() => setActiveTab("Security")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px", cursor: "pointer", borderBottom: `1px solid ${colors.divider}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", color: isDark ? "#CBD5E1" : "#334155" }}>
                    <span>🔒</span> Change Password
                  </div>
                  <span style={{ color: "#94A3B8", fontSize: "12px" }}>❯</span>
                </div>

               {/* Manage Addresses - Redirects to a new page */}
{/* Manage Addresses - Smooth scroll to the address input field */}
<div onClick={() => {
  setActiveTab("Profile Information");
  setTimeout(() => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, 100);
}} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px", cursor: "pointer", borderBottom: `1px solid ${colors.divider}` }}>
  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", color: isDark ? "#CBD5E1" : "#334155" }}>
    <span>🗺️</span> Manage Addresses
  </div>
  <span style={{ color: "#94A3B8", fontSize: "12px" }}>❯</span>
</div>

{/* Download My Data - Trigger browser data download */}
<div onClick={() => {
  const data = JSON.stringify({ fullName, dob, email, phone, address }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "my_profile_data.json";
  link.click();
}} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px", cursor: "pointer", borderBottom: `1px solid ${colors.divider}` }}>
  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", color: isDark ? "#CBD5E1" : "#334155" }}>
    <span>📥</span> Download My Data
  </div>
  <span style={{ color: "#94A3B8", fontSize: "12px" }}>❯</span>
</div>
                
                <div onClick={handleDeleteAccount} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 8px", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", color: "#EF4444" }}>
                    <span>🗑️</span> Delete Account
                  </div>
                  <span style={{ color: "#EF4444", fontSize: "12px" }}>❯</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}