import React, { useState, useEffect } from "react";
import AgentSidebar from "../../components/AgentSidebar";
import Navbar from "../../components/Navbar"; // Imported Navbar here

const INITIAL_TICKETS = [
  { id: "CR-1014", customer: "Smitha Rao", category: "Internet Down", date: "2026-07-05", priority: "High", status: "Pending", assignedTo: "You", description: '"My broadband connection went completely red this morning. I tried power-cycling the fiber ONT box and router multiple times, but there is still no WAN link light. I need this running urgently for work."' },
  { id: "CR-1013", customer: "John Doe", category: "Billing Query", date: "2026-07-04", priority: "Medium", status: "In Progress", assignedTo: "You", description: '"I was double-charged on my auto-pay transaction for this monthly billing cycle."' },
  { id: "CR-1012", customer: "Vikram Negi", category: "Fiber Cut", date: "2026-07-03", priority: "High", status: "Pending", assignedTo: "Unassigned", description: '"Main distribution cable sliced during road construction excavation workspace area."' },
  { id: "CR-1011", customer: "Rajesh Kumar", category: "Account Hacked", date: "2026-07-02", priority: "High", status: "In Progress", assignedTo: "Agent Rahul", description: '"Cannot log into my main dashboard panel."' },
  { id: "CR-1010", customer: "Kiran Shah", category: "Slow Speed", date: "2026-07-01", priority: "Low", status: "Resolved", assignedTo: "Agent Priya", description: '"Bandwidth speeds dropping well below baseline threshold guarantees."' },
  { id: "CR-1009", customer: "Alice Vance", category: "Router Setup", date: "2026-06-30", priority: "Low", status: "Resolved", assignedTo: "You", description: '"Need step-by-step guidance on how to update my router configuration."' }
];

export default function ComplaintDetails() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusInput, setStatusInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cms_tickets");
    if (saved) {
      setTickets(JSON.parse(saved));
    } else {
      setTickets(INITIAL_TICKETS);
      localStorage.setItem("cms_tickets", JSON.stringify(INITIAL_TICKETS));
    }
  }, [selectedTicket]);

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

  const handleOpenClick = (ticket) => {
    setSelectedTicket(ticket);
    setStatusInput(ticket.status);
    setPriorityInput(ticket.priority);
  };

  const handleSaveChanges = () => {
    const updated = tickets.map((t) =>
      t.id === selectedTicket.id ? { ...t, status: statusInput, priority: priorityInput } : t
    );
    setTickets(updated);
    localStorage.setItem("cms_tickets", JSON.stringify(updated));
    setSelectedTicket(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AgentSidebar />
      <div style={{ flex: 1, marginLeft: "256px", boxSizing: "border-box" }}>
        
        {/* Rendered Navbar components correctly */}
        <Navbar title="Global Ticket Database" />

        <div style={{ padding: "0 40px 40px 40px" }}>
          {selectedTicket ? (
            /* WORKSPACE VIEW */
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Complaint Workspace</h1>
                <button onClick={() => setSelectedTicket(null)} style={{ padding: "8px 16px", backgroundColor: "#ffffff", color: "#475569", border: "1px solid #E2E8F0", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
                  ← Back to Database
                </button>
              </div>

              <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
                <div style={{ flex: 2, backgroundColor: "#ffffff", padding: "32px", borderRadius: "24px", border: "1px solid #EEF2F6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Ticket #{selectedTicket.id}</h2>
                    <span style={{ color: "#94A3B8", fontSize: "14px" }}>Opened: {selectedTicket.date}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Customer</span>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", marginTop: "6px" }}>{selectedTicket.customer}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Category</span>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "#475569", marginTop: "6px" }}>{selectedTicket.category}</div>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase" }}>Issue Description</span>
                    <div style={{ backgroundColor: "#F8FAFC", padding: "20px", borderRadius: "16px", color: "#475569", fontSize: "15px", marginTop: "10px", border: "1px solid #E2E8F0" }}>
                      {selectedTicket.description}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, backgroundColor: "#ffffff", padding: "32px", borderRadius: "24px", border: "1px solid #EEF2F6" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", margin: "0 0 24px 0" }}>Update Ticket</h3>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>Status</label>
                    <select value={statusInput} onChange={(e) => setStatusInput(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: "32px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#475569", marginBottom: "8px" }}>Priority</label>
                    <select value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <button onClick={handleSaveChanges} style={{ width: "100%", padding: "14px", backgroundColor: "#2563EB", color: "#ffffff", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer" }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ALL COMPLAINTS DATABASE MAIN GRID LIST */
            <div>
              <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "24px", border: "1px solid #EEF2F6" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px", fontWeight: "600" }}>ID</th>
                      <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px", fontWeight: "600" }}>Customer</th>
                      <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px", fontWeight: "600" }}>Category</th>
                      <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px", fontWeight: "600" }}>Assigned To</th>
                      <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px", fontWeight: "600" }}>Priority</th>
                      <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px", fontWeight: "600" }}>Status</th>
                      <th style={{ padding: "12px 16px", color: "#64748B", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "20px 16px", fontSize: "14px", fontWeight: "600", color: "#2563EB" }}>#{ticket.id}</td>
                        <td style={{ padding: "20px 16px", fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>{ticket.customer}</td>
                        <td style={{ padding: "20px 16px", fontSize: "14px", color: "#475569" }}>{ticket.category}</td>
                        <td style={{ padding: "20px 16px", fontSize: "14px", fontWeight: "600", color: ticket.assignedTo === "Unassigned" ? "#EF4444" : "#475569" }}>{ticket.assignedTo}</td>
                        <td style={{ padding: "20px 16px" }}>
                          <span style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", ...getPriorityStyle(ticket.priority) }}>{ticket.priority}</span>
                        </td>
                        <td style={{ padding: "20px 16px" }}>
                          <span style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", ...getStatusStyle(ticket.status) }}>{ticket.status}</span>
                        </td>
                        <td style={{ padding: "20px 16px", textAlign: "center" }}>
                          <button onClick={() => handleOpenClick(ticket)} style={{ padding: "6px 14px", backgroundColor: "#EFF6FF", color: "#2563EB", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                            Open 👁️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}