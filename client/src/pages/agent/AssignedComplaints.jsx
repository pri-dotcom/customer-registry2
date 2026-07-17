import { API_URL } from "../../config";
import React, { useState, useEffect } from "react";
import AgentSidebar from "../../components/AgentSidebar";
import Navbar from "../../components/Navbar";

export default function AssignedComplaints() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusInput, setStatusInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");
  const [resolutionText, setResolutionText] = useState("");

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");

  // Custom Fields State
  const [customFields, setCustomFields] = useState([]);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCustomFields, setCustomerCustomFields] = useState({});

  const fetchAssigned = async () => {
    try {
      const response = await fetch(API_URL + "/complaints/assigned/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setTickets(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomFields = async () => {
    try {
      const response = await fetch(API_URL + "/admin/custom-fields", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCustomFields(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssigned();
    fetchCustomFields();
  }, []);

  const getPriorityStyle = (priority) => {
    if (priority === "High" || priority === "Critical") return { color: "#EF4444", backgroundColor: "#FEE2E2" };
    if (priority === "Medium") return { color: "#D97706", backgroundColor: "#FEF3C7" };
    return { color: "#64748B", backgroundColor: "#F1F5F9" };
  };

  const getStatusStyle = (status) => {
    if (status === "Resolved" || status === "Closed") return { color: "#10B981", backgroundColor: "#D1FAE5" };
    if (status === "In Progress") return { color: "#2563EB", backgroundColor: "#DBEAFE" };
    return { color: "#D97706", backgroundColor: "#FEF3C7" };
  };

  const handleProcessClick = async (ticket) => {
    setSelectedTicket(ticket);
    setStatusInput(ticket.status);
    setPriorityInput(ticket.priority);
    setResolutionText(ticket.resolution || "");

    try {
      const response = await fetch(API_URL + `/messages/${ticket._id || ticket.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        const msgs = data.data.map(msg => {
          const isAgent = msg.senderRole === "agent" || msg.senderRole === "admin";
          return {
            sender: isAgent ? "agent" : "customer",
            text: msg.message,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });
        setChatMessages(msgs);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    const ticketId = selectedTicket._id || selectedTicket.id;
    try {
      const response = await fetch(API_URL + `/complaints/${ticketId}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          status: statusInput,
          resolution: statusInput === "Resolved" ? resolutionText : ""
        })
      });
      const data = await response.json();
      if (data.success) {
        const updated = tickets.map((t) =>
          (t._id || t.id) === ticketId ? { ...t, status: statusInput, resolution: resolutionText } : t
        );
        setTickets(updated);
        setSelectedTicket(null);
        setResolutionText("");
        alert("Ticket updated successfully!");
      } else {
        alert(data.message || "Failed to update ticket.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const ticketId = selectedTicket._id || selectedTicket.id;
    const receiver = selectedTicket.customer?._id || selectedTicket.customer;

    try {
      const response = await fetch(API_URL + "/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          complaintId: ticketId,
          receiver,
          message: typedMessage
        })
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages([...chatMessages, { sender: "agent", text: typedMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setTypedMessage("");
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message");
    }
  };

  const handleOpenCustomerModal = async () => {
    const custId = selectedTicket.customer?._id || selectedTicket.customer;
    try {
      const response = await fetch(API_URL + `/admin/customer/${custId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        const c = data.data;
        setCustomerName(c.name || "");
        setCustomerPhone(c.phone || "");
        setCustomerAddress(c.address || "");
        setCustomerCustomFields(c.customFields || {});
        setIsCustomerModalOpen(true);
      } else {
        alert("Failed to load customer details.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveCustomerChanges = async (e) => {
    e.preventDefault();
    const custId = selectedTicket.customer?._id || selectedTicket.customer;
    try {
      const response = await fetch(API_URL + `/admin/customer/${custId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
          customFields: customerCustomFields
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Customer registry updated successfully!");
        setIsCustomerModalOpen(false);
        // Sync locally inside selectedTicket state to reflect immediately in UI
        setSelectedTicket({
          ...selectedTicket,
          customer: {
            ...selectedTicket.customer,
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            customFields: customerCustomFields
          }
        });
        fetchAssigned(); // refresh table
      } else {
        alert(data.message || "Failed to update customer details.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const assignedToMe = tickets;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AgentSidebar />
      <div style={{ flex: 1, marginLeft: "256px", boxSizing: "border-box" }}>
        <Navbar title="Assigned Complaints Queue" />

        <div style={{ padding: "40px" }}>
          {selectedTicket ? (
            <div>
              {/* Workspace Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Complaint Workspace</h1>
                <button onClick={() => setSelectedTicket(null)} style={{ padding: "8px 16px", backgroundColor: "#ffffff", color: "#475569", border: "1px solid #E2E8F0", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  ← Back to List
                </button>
              </div>

              {/* Main Workspace Layout */}
              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

                {/* LEFT MAIN WORKSPACE: Details & Messaging */}
                <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "24px" }}>

                  {/* Ticket Information Card */}
                  <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #EEF2F6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Ticket #{selectedTicket._id?.slice(-6).toUpperCase() || selectedTicket.id?.slice(-6).toUpperCase()}</h2>
                      <span style={{ color: "#94A3B8", fontSize: "13px" }}>Date: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Customer Contact Details</span>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#1E293B", display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                          {selectedTicket.customer?.name || "Customer"}
                          <button 
                            onClick={handleOpenCustomerModal} 
                            style={{ 
                              padding: "4px 8px", backgroundColor: "#EFF6FF", color: "#2563EB", 
                              border: "none", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: "600" 
                            }}
                          >
                            ✏️ View/Edit Profile
                          </button>
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
                          📞 {selectedTicket.customer?.phone || "No Phone Registered"}<br/>
                          📧 {selectedTicket.customer?.email || "No Email"}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Category</span>
                        <div style={{ fontSize: "15px", fontWeight: "600", color: "#475569", marginTop: "4px" }}>{selectedTicket.category}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Address</span>
                      <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>{selectedTicket.customer?.address || "No address provided."}</div>
                    </div>

                    {/* DYNAMIC CUSTOM FIELDS LIST */}
                    {customFields.length > 0 && selectedTicket.customer?.customFields && (
                      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Business Properties</span>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "6px" }}>
                          {customFields.map((field) => {
                            const val = selectedTicket.customer?.customFields[field.name];
                            if (!val) return null;
                            return (
                              <div key={field._id}>
                                <strong style={{ fontSize: "12px", color: "#64748B" }}>{field.name}: </strong>
                                <span style={{ fontSize: "13px", color: "#1e293b", fontWeight: "600" }}>{val}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Issue Description</span>
                      <div style={{ backgroundColor: "#F8FAFC", padding: "12px 16px", borderRadius: "8px", color: "#475569", fontSize: "14px", marginTop: "6px", border: "1px solid #E2E8F0" }}>
                        {selectedTicket.description}
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER LIVE CHAT MESSAGING BOX */}
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #EEF2F6", display: "flex", flexDirection: "column", height: "350px", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFBFC" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Live Chat with {selectedTicket.customer?.name || "Customer"}</h3>
                    </div>

                    {/* Messages Body Scroll Area */}
                    <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#F8FAFC" }}>
                      {chatMessages.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#94A3B8", fontStyle: "italic", marginTop: "40px", fontSize: "13px" }}>No message history found. Type a message below to start communication.</div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <div key={index} style={{ alignSelf: msg.sender === "agent" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                            <div style={{
                              padding: "10px 14px",
                              borderRadius: "12px",
                              fontSize: "14px",
                              lineHeight: "1.4",
                              backgroundColor: msg.sender === "agent" ? "#2563EB" : "#ffffff",
                              color: msg.sender === "agent" ? "#ffffff" : "#1E293B",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                              border: msg.sender === "agent" ? "none" : "1px solid #E2E8F0"
                            }}>
                              {msg.text}
                            </div>
                            <div style={{ fontSize: "10px", color: "#94A3B8", textAlign: msg.sender === "agent" ? "right" : "left", marginTop: "4px" }}>
                              {msg.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Input Chat Controller Footer */}
                    <form onSubmit={handleSendMessage} style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "12px", backgroundColor: "#ffffff" }}>
                      <input
                        type="text"
                        required
                        placeholder="Type your reply message to the customer..."
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        style={{ flex: 1, padding: "10px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", outline: "none", fontSize: "14px" }}
                      />
                      <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#2563EB", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
                        Send
                      </button>
                    </form>
                  </div>

                </div>

                {/* RIGHT CONTROL PANEL: Status Modifier Form */}
                <div style={{ flex: 1, backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #EEF2F6", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Update Ticket</h3>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Status</label>
                    <select value={statusInput} onChange={(e) => setStatusInput(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Priority</label>
                    <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {statusInput === "Resolved" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Resolution Description</label>
                      <textarea
                        value={resolutionText}
                        onChange={(e) => setResolutionText(e.target.value)}
                        required
                        placeholder="Explain resolution details provided to the customer..."
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0", minHeight: "100px", outline: "none", fontSize: "14px", fontFamily: "inherit" }}
                      />
                    </div>
                  )}

                  <button onClick={handleSaveChanges} style={{ width: "100%", padding: "12px", backgroundColor: "#10B981", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px", marginTop: "8px" }}>
                    Save Ticket Changes
                  </button>
                </div>

              </div>
            </div>
          ) : (
            /* Table Grid View Display Rule */
            <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "24px", border: "1px solid #EEF2F6" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>Assigned Cases Queue</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px" }}>Complaint ID</th>
                    <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px" }}>Customer</th>
                    <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px" }}>Category</th>
                    <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px" }}>Date Assigned</th>
                    <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px" }}>Priority</th>
                    <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px" }}>Status</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedToMe.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: "20px 16px", textAlign: "center", color: "#94A3B8", fontStyle: "italic" }}>No active tickets assigned to you.</td>
                    </tr>
                  ) : (
                    assignedToMe.map((ticket) => (
                      <tr key={ticket._id || ticket.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "20px 16px", fontWeight: "600", color: "#2563EB" }}>{(ticket._id || ticket.id).slice(-6).toUpperCase()}</td>
                        <td style={{ padding: "20px 16px", fontWeight: "700", color: "#1E293B" }}>{ticket.customer?.name || "Customer"}</td>
                        <td style={{ padding: "20px 16px", color: "#475569" }}>{ticket.category}</td>
                        <td style={{ padding: "20px 16px", color: "#64748B" }}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: "20px 16px" }}>
                          <span style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", ...getPriorityStyle(ticket.priority) }}>{ticket.priority}</span>
                        </td>
                        <td style={{ padding: "20px 16px" }}>
                          <span style={{ padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", ...getStatusStyle(ticket.status) }}>{ticket.status}</span>
                        </td>
                        <td style={{ padding: "20px 16px", textAlign: "center" }}>
                          <button onClick={() => handleProcessClick(ticket)} style={{ padding: "8px 20px", backgroundColor: "#2563EB", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                            Process
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* AGENT VIEW EDIT CUSTOMER DETAILS MODAL */}
      {isCustomerModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            width: "100%", maxWidth: "550px", backgroundColor: "#ffffff",
            borderRadius: "20px", border: "1px solid #E2E8F0", padding: "32px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", boxSizing: "border-box"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: "16px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>View/Edit Customer Info</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCustomerChanges} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Full Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Phone Number</label>
                <input 
                  type="text" 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)} 
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Address</label>
                <textarea 
                  value={customerAddress} 
                  onChange={(e) => setCustomerAddress(e.target.value)} 
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", minHeight: "80px", fontFamily: "inherit" }} 
                />
              </div>

              {/* RENDER CUSTOMIZABLE FIELDS DYNAMICALLY */}
              {customFields.length > 0 && (
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", margin: "0 0 4px 0" }}>Business Properties</h4>
                  {customFields.map((field) => (
                    <div key={field._id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
                        {field.name} {field.isRequired && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input 
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} 
                        value={customerCustomFields[field.name] || ""} 
                        onChange={(e) => setCustomerCustomFields({ ...customerCustomFields, [field.name]: e.target.value })} 
                        required={field.isRequired}
                        style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} 
                      />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #E2E8F0", paddingTop: "16px", marginTop: "8px" }}>
                <button 
                  type="button" 
                  onClick={() => setIsCustomerModalOpen(false)} 
                  style={{ padding: "10px 20px", backgroundColor: "#ffffff", color: "#475569", border: "1px solid #CBD5E1", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: "10px 20px", backgroundColor: "#2563EB", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}