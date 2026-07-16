import React, { useState, useEffect } from "react";
import AgentSidebar from "../../components/AgentSidebar";
import Navbar from "../../components/Navbar";

export default function AssignedComplaints() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusInput, setStatusInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");

  // Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/complaints/assigned/list", {
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
    fetchAssigned();
  }, []);

  const getPriorityStyle = (priority) => {
    if (priority === "High") return { color: "#EF4444", backgroundColor: "#FEE2E2" };
    if (priority === "Medium") return { color: "#D97706", backgroundColor: "#FEF3C7" };
    return { color: "#64748B", backgroundColor: "#F1F5F9" };
  };

  const getStatusStyle = (status) => {
    if (status === "Resolved") return { color: "#10B981", backgroundColor: "#D1FAE5" };
    if (status === "In Progress") return { color: "#2563EB", backgroundColor: "#DBEAFE" };
    return { color: "#D97706", backgroundColor: "#FEF3C7" };
  };

  const handleProcessClick = async (ticket) => {
    setSelectedTicket(ticket);
    setStatusInput(ticket.status);
    setPriorityInput(ticket.priority);

    try {
      const response = await fetch(`http://localhost:5001/api/messages/${ticket._id || ticket.id}`, {
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
      const response = await fetch(`http://localhost:5001/api/complaints/${ticketId}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: statusInput })
      });
      const data = await response.json();
      if (data.success) {
        const updated = tickets.map((t) =>
          (t._id || t.id) === ticketId ? { ...t, status: statusInput } : t
        );
        setTickets(updated);
        setSelectedTicket(null);
        alert("Status updated successfully!");
      } else {
        alert(data.message || "Failed to update status.");
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
      const response = await fetch("http://localhost:5001/api/messages", {
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

  const assignedToMe = tickets;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AgentSidebar />
      <div style={{ flex: 1, marginLeft: "256px", boxSizing: "border-box" }}>
        <Navbar title="Assigned Complaints Queue" />

        <div style={{ padding: "0 40px 40px 40px" }}>
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
                      <span style={{ color: "#94A3B8", fontSize: "13px" }}>Opened: {selectedTicket.date}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Customer</span>
                        <div style={{ fontSize: "15px", fontWeight: "700", color: "#1E293B" }}>{selectedTicket.customer?.name || selectedTicket.customer}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Category</span>
                        <div style={{ fontSize: "15px", fontWeight: "600", color: "#475569" }}>{selectedTicket.category}</div>
                      </div>
                    </div>
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
                      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Live Chat with {selectedTicket.customer?.name || selectedTicket.customer}</h3>
                    </div>

                    {/* Messages Body Scroll Area */}
                    <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#F8FAFC" }}>
                      {chatMessages.map((msg, index) => (
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
                      ))}
                    </div>

                    {/* Input Chat Controller Footer */}
                    <form onSubmit={handleSendMessage} style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "12px", backgroundColor: "#ffffff" }}>
                      <input
                        type="text"
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
                <div style={{ flex: 1, backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #EEF2F6" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 16px 0" }}>Update Ticket</h3>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Status</label>
                    <select value={statusInput} onChange={(e) => setStatusInput(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#475569", marginBottom: "6px" }}>Priority</label>
                    <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <button onClick={handleSaveChanges} style={{ width: "100%", padding: "12px", backgroundColor: "#10B981", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
                    Save Changes
                  </button>
                </div>

              </div>
            </div>
          ) : (
            /* Table Grid View Display Rule */
            <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "24px", border: "1px solid #EEF2F6" }}>
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
                  {assignedToMe.map((ticket) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}