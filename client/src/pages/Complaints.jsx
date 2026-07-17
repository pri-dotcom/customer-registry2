import { API_URL } from "../config";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Complaints() {
  // Chat state
  const [chatMessage, setChatMessage] = useState("");
  const [conversations, setConversations] = useState([]);

  // --- EDIT & CANCEL COMPLAINT STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const [complaintData, setComplaintData] = useState({
    status: "Pending",
    priority: "High",
    category: "Internet",
    contact: "Email",
    description: "No complaints raised yet."
  });

  // Timeline array tracking milestones dynamically
  const [timelineEvents, setTimelineEvents] = useState([]);

  // Temporary state for the form while editing
  const [editForm, setEditForm] = useState({ ...complaintData });

  // Fetch Complaint & Chat logs
  useEffect(() => {
    const fetchLatestComplaint = async () => {
      try {
        const response = await fetch(API_URL + "/complaints/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          const latest = data.data[0];
          setComplaintData(latest);
          setEditForm(latest);

          // Populate dynamic timeline
          const milestones = [];
          if (latest.status === "Closed") {
            milestones.push({ title: "Complaint Closed", desc: "This complaint ticket is closed.", time: new Date(latest.updatedAt || latest.createdAt).toLocaleString(), color: "#EF4444" });
          }
          if (latest.status === "Resolved") {
            milestones.push({ title: "Resolution Complete", desc: "Your complaint was resolved: " + (latest.resolution || "Complete"), time: new Date(latest.resolvedAt || latest.updatedAt).toLocaleString(), color: "#10B981" });
          }
          if (latest.status === "In Progress" || latest.status === "Resolved" || latest.status === "Closed") {
            milestones.push({ title: "Investigation Underway", desc: "Verifying and debugging backend configuration errors.", time: new Date(latest.updatedAt).toLocaleString(), color: "#2563EB" });
          }
          if (latest.assignedAgent) {
            milestones.push({ title: "Assigned to Agent", desc: `Assigned to ${latest.assignedAgent.name || "Agent"}.`, time: new Date(latest.updatedAt).toLocaleString(), color: "#2563EB" });
          }
          milestones.push({ title: "Complaint Created", desc: "Your complaint has been registered successfully.", time: new Date(latest.createdAt).toLocaleString(), color: "#F59E0B" });
          setTimelineEvents(milestones);

          // Fetch chat logs
          const chatResponse = await fetch(`${API_URL}/messages/${latest._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          const chatData = await chatResponse.json();
          if (chatData.success) {
            const parsedMsgs = chatData.data.map(msg => {
              const userRole = localStorage.getItem("role") || "customer";
              const isCurrentUserSender = msg.sender?._id === undefined ? true : msg.sender === localStorage.getItem("userId");
              const isAgentMsg = msg.senderRole === "agent" || msg.senderRole === "admin";
              return {
                sender: isAgentMsg ? `Agent • ${msg.sender?.name || "Support"}` : "You",
                text: msg.message,
                time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isAgent: isAgentMsg
              };
            });
            setConversations(parsedMsgs);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLatestComplaint();
  }, []);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const receiver = complaintData.assignedAgent?._id || complaintData.assignedAgent;
    if (!receiver) {
      alert("No agent has been assigned to this ticket yet. Chatting is disabled.");
      return;
    }

    try {
      const response = await fetch(API_URL + "/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          complaintId: complaintData._id,
          receiver,
          message: chatMessage
        })
      });
      const data = await response.json();
      if (data.success) {
        setConversations([...conversations, { sender: "You", text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isAgent: false }]);
        setChatMessage("");
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message.");
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_URL}/complaints/${complaintData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title: editForm.title || complaintData.title || editForm.description.slice(0, 30),
          description: editForm.description,
          category: editForm.category,
          priority: editForm.priority
        })
      });
      const data = await response.json();
      if (data.success) {
        setComplaintData(data.data);
        setIsEditing(false);
        alert("Complaint updated successfully!");
      } else {
        alert(data.message || "Failed to update complaint.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating complaint.");
    }
  };

  const handleCancelEdit = () => {
    setEditForm({ ...complaintData });
    setIsEditing(false);
  };

  // --- EXECUTE ACTION FOR CANCELLING COMPLAINT ---
  const handleConfirmCancelComplaint = async () => {
    try {
      const response = await fetch(`${API_URL}/complaints/${complaintData._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert("Complaint deleted successfully!");
        window.location.reload();
      } else {
        alert(data.message || "Failed to cancel complaint.");
      }
    } catch (error) {
      console.error(error);
      alert("Error cancelling complaint.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Complaint Details" />

        <main style={{ padding: "32px", maxWidth: "1280px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Complaint Details</h1>
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#94A3B8", marginTop: "4px" }}>
                <span style={{ color: "#2563EB", cursor: "pointer" }}>My Complaints</span> &gt; <span style={{ color: "#64748B" }}>Complaint Details</span>
              </div>
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>
              Complaint ID: <strong style={{ color: "#0F172A" }}>#{complaintData._id ? complaintData._id.slice(-6).toUpperCase() : "CR-1012"}</strong>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "28px", display: "flex", gap: "20px", position: "relative" }}>
                <div style={{ backgroundColor: "#EFF6FF", width: "56px", height: "56px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#2563EB", flexShrink: 0 }}>🌐</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0F172A", margin: 0 }}>{complaintData.title || (complaintData.category + " Issue")}</h2>
                    <span style={{ 
                      backgroundColor: complaintData.status === "Cancelled" ? "#F1F5F9" : "#FEF3C7", 
                      color: complaintData.status === "Cancelled" ? "#64748B" : "#D97706", 
                      fontSize: "12px", fontWeight: "700", padding: "4px 12px", borderRadius: "12px" 
                    }}>
                      ⚠️ {complaintData.status}
                    </span>
                  </div>
                  <p style={{ color: "#64748B", fontSize: "14px", margin: "8px 0 16px 0", lineHeight: "1.5" }}>
                    {complaintData.description}
                  </p>
                  <div style={{ display: "flex", gap: "24px", fontSize: "12px", color: "#94A3B8", fontWeight: "600" }}>
                    <span>📅 {complaintData.createdAt ? new Date(complaintData.createdAt).toLocaleDateString() : "May 29, 2025"}</span>
                    <span>🏷️ {complaintData.category}</span>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "24px", right: "28px", display: "flex", gap: "16px", textAlign: "right" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase" }}>Priority</div>
                    <div style={{ color: complaintData.priority === "High" ? "#DC2626" : complaintData.priority === "Medium" ? "#D97706" : "#10B981", fontWeight: "700", fontSize: "13px" }}>
                      {complaintData.priority}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase" }}>Category</div>
                    <div style={{ color: "#0F172A", fontWeight: "700", fontSize: "13px" }}>{complaintData.category}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px" }}>
                
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Complaint Information</h3>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "13.5px", flex: 1 }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px", alignItems: "center" }}>
                      <span style={{ width: "130px", color: "#64748B", fontWeight: "500" }}>Status</span>
                      <span style={{ color: complaintData.status === "Cancelled" ? "#64748B" : "#D97706", fontWeight: "700", backgroundColor: complaintData.status === "Cancelled" ? "#F1F5F9" : "#FEF3C7", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>{complaintData.status}</span>
                    </div>
                    
                    <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px", alignItems: "center" }}>
                      <span style={{ width: "130px", color: "#64748B", fontWeight: "500" }}>Priority</span>
                      {isEditing ? (
                        <select name="priority" value={editForm.priority} onChange={handleEditChange} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px" }}>
                          <option>High</option>
                          <option>Medium</option>
                          <option>Low</option>
                        </select>
                      ) : (
                        <span style={{ color: complaintData.priority === "High" ? "#DC2626" : complaintData.priority === "Medium" ? "#D97706" : "#10B981", fontWeight: "700" }}>{complaintData.priority}</span>
                      )}
                    </div>

                    <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px", alignItems: "center" }}>
                      <span style={{ width: "130px", color: "#64748B", fontWeight: "500" }}>Category</span>
                      {isEditing ? (
                        <select name="category" value={editForm.category} onChange={handleEditChange} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px" }}>
                          <option value="Billing Error">Billing Error</option>
                          <option value="Account Access Failure">Account Access Failure</option>
                          <option value="Service Interruption">Service Interruption</option>
                        </select>
                      ) : (
                        <span style={{ color: "#0F172A", fontWeight: "600" }}>{complaintData.category}</span>
                      )}
                    </div>

                    <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px", alignItems: "center" }}>
                      <span style={{ width: "130px", color: "#64748B", fontWeight: "500" }}>Preferred Contact</span>
                      {isEditing ? (
                        <input type="text" name="contact" value={editForm.contact} onChange={handleEditChange} style={{ flex: 1, padding: "6px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px" }} />
                      ) : (
                        <span style={{ color: "#0F172A" }}>{complaintData.contact}</span>
                      )}
                    </div>

                    <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px", alignItems: "flex-start" }}>
                      <span style={{ width: "130px", color: "#64748B", fontWeight: "500", marginTop: "4px" }}>Description</span>
                      {isEditing ? (
                        <textarea name="description" value={editForm.description} onChange={handleEditChange} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", minHeight: "60px", resize: "vertical", fontFamily: "inherit" }} />
                      ) : (
                        <span style={{ color: "#475569", flex: 1, lineHeight: "1.4" }}>{complaintData.description}</span>
                      )}
                    </div>

                    <div style={{ display: "flex", paddingBottom: "10px" }}>
                      <span style={{ width: "130px", color: "#64748B", fontWeight: "500" }}>Attachments</span>
                      <span style={{ color: "#2563EB", fontWeight: "600" }}>📎 1 file attached</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #F1F5F9", paddingTop: "16px", marginTop: "16px" }}>
                    {isEditing ? (
                      <>
                        <button onClick={handleCancelEdit} style={{ flex: 1, padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", backgroundColor: "#FFFFFF", color: "#64748B", fontWeight: "600", cursor: "pointer" }}>✕ Cancel</button>
                        <button onClick={handleSaveEdit} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "8px", backgroundColor: "#10B981", color: "#FFFFFF", fontWeight: "600", cursor: "pointer" }}>💾 Save Changes</button>
                      </>
                    ) : (
                      <>
                        <button 
                          disabled={complaintData.status === "Cancelled"}
                          onClick={() => setShowCancelModal(true)} 
                          style={{ 
                            flex: 1, padding: "10px", border: "1px solid #E2E8F0", borderRadius: "8px", 
                            backgroundColor: "#FFFFFF", color: complaintData.status === "Cancelled" ? "#CBD5E1" : "#EF4444", 
                            fontWeight: "600", cursor: complaintData.status === "Cancelled" ? "not-allowed" : "pointer" 
                          }}
                        >
                          ✕ Cancel Complaint
                        </button>
                        <button 
                          disabled={complaintData.status === "Cancelled"}
                          onClick={() => setIsEditing(true)} 
                          style={{ 
                            flex: 1, padding: "10px", border: "1px solid #2563EB", borderRadius: "8px", 
                            backgroundColor: "#FFFFFF", color: "#2563EB", fontWeight: "600", 
                            cursor: complaintData.status === "Cancelled" ? "not-allowed" : "pointer" 
                          }}
                        >
                          📝 Edit Complaint
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* DYNAMIC TIMELINE CONTAINER */}
                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: "0 0 20px 0" }}>Timeline</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "24px" }}>
                    <div style={{ position: "absolute", left: "6px", top: "4px", bottom: "4px", width: "2px", backgroundColor: "#E2E8F0" }} />
                    
                    {timelineEvents.map((event, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <div style={{ position: "absolute", left: "-22px", top: "4px", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: event.color }} />
                        <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#0F172A" }}>{event.title}</div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{event.desc}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>{event.time}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* CHAT WINDOW */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", height: "450px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: "14px", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Conversation</h3>
                  <span style={{ color: complaintData.status === "Cancelled" ? "#94A3B8" : "#10B981", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                    ● {complaintData.status === "Cancelled" ? "Disconnected" : "Online"}
                  </span>
                </div>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", paddingRight: "4px" }}>
                  {conversations.map((msg, i) => (
                    <div key={i} style={{ alignSelf: msg.isAgent ? "flex-start" : "flex-end", maxWidth: "85%" }}>
                      <div style={{ fontSize: "11px", color: "#94A3B8", fontWeight: "600", marginBottom: "4px", textAlign: msg.isAgent ? "left" : "right" }}>{msg.sender}</div>
                      <div style={{ backgroundColor: msg.isAgent ? "#F1F5F9" : "#EBF5FF", color: "#1E293B", padding: "12px", borderRadius: "12px", fontSize: "13px", lineHeight: "1.4" }}>{msg.text}</div>
                      <div style={{ fontSize: "10px", color: "#94A3B8", textAlign: "right", marginTop: "4px" }}>{msg.time}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} style={{ display: "flex", gap: "8px", borderTop: "1px solid #F1F5F9", paddingTop: "14px", marginTop: "12px" }}>
                  <input disabled={complaintData.status === "Cancelled"} type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder={complaintData.status === "Cancelled" ? "Chat is locked." : "Type your message..."} style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none" }} />
                  <button disabled={complaintData.status === "Cancelled"} type="submit" style={{ backgroundColor: complaintData.status === "Cancelled" ? "#CBD5E1" : "#2563EB", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "0 16px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>Send</button>
                </form>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- CONFIRMATION BACKDROP OVERLAY MODAL FOR CANCELLATION --- */}
      {showCancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "16px", maxWidth: "420px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
            <h3 style={{ margin: "0 0 12px 0", color: "#0F172A", fontSize: "18px", fontWeight: "700" }}>Cancel this complaint?</h3>
            <p style={{ margin: "0 0 24px 0", color: "#64748B", fontSize: "14px", lineHeight: "1.5" }}>
              Are you sure you want to cancel ticket <strong>#CR-1012</strong>? This will notify your assigned support agent and halt immediate diagnostic tasks.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowCancelModal(false)} style={{ padding: "10px 18px", border: "1px solid #E2E8F0", borderRadius: "8px", backgroundColor: "#FFFFFF", color: "#475569", fontWeight: "600", cursor: "pointer", fontSize: "13.5px" }}>Nevermind</button>
              <button onClick={handleConfirmCancelComplaint} style={{ padding: "10px 20px", border: "none", borderRadius: "8px", backgroundColor: "#EF4444", color: "#FFFFFF", fontWeight: "600", cursor: "pointer", fontSize: "13.5px" }}>Yes, Cancel It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}