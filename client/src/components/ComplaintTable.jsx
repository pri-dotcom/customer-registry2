import React, { useState, useEffect } from "react";

export default function ComplaintTable({complaints=[]}) {
  // 1. Manage state to track which row is currently expanded
  const [expandedId, setExpandedId] = useState(null);
  const [agents, setAgents] = useState([]);
  const isAdmin = localStorage.getItem("role") === "admin";

  useEffect(() => {
    if (isAdmin) {
      const fetchAgents = async () => {
        try {
          const response = await fetch("http://localhost:5001/api/agents", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          const data = await response.json();
          if (data.success && data.data) {
            setAgents(data.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchAgents();
    }
  }, [isAdmin]);

  const handleAssignAgent = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      const response = await fetch(`http://localhost:5001/api/complaints/${complaintId}/assign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ agentId })
      });
      const data = await response.json();
      if (data.success) {
        alert("Agent assigned successfully!");
        window.location.reload();
      } else {
        alert(data.message || "Failed to assign agent.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle rows logic handler
  const handleToggleDetails = (id) => {
    if (expandedId === id) {
      setExpandedId(null); // Collapse if clicked again
    } else {
      setExpandedId(id); // Expand selection
    }
  };

  // Helper styles for operational status pills matching image_ab4a24.png
  const getStatusStyle = (status) => {
    if (status === "Pending") return { backgroundColor: "#FEF3C7", color: "#D97706" };
    return { backgroundColor: "#D1FAE5", color: "#059669" };
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") return { backgroundColor: "#FEE2E2", color: "#DC2626" };
    if (priority === "Medium") return { backgroundColor: "#FFFBEB", color: "#D97706" };
    return { backgroundColor: "#F1F5F9", color: "#475569" };
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
        <thead>
          <tr style={{ color: "#94a3b8", fontWeight: "600", borderBottom: "1px solid #f1f5f9" }}>
            <th style={{ padding: "16px 8px" }}>Complaint ID</th>
            <th style={{ padding: "16px 8px" }}>Category</th>
            <th style={{ padding: "16px 8px" }}>Submission Date</th>
            <th style={{ padding: "16px 8px" }}>Priority</th>
            <th style={{ padding: "16px 8px" }}>Status</th>
            <th style={{ padding: "16px 8px", textAlign: "right" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((row) => {
            const isExpanded = expandedId === (row._id || row.id);
            return (
              <React.Fragment key={row._id || row.id}>
                {/* Master Matrix Table Data Row */}
                <tr style={{ 
                  borderBottom: isExpanded ? "none" : "1px solid #f8fafc", 
                  backgroundColor: isExpanded ? "#f8fafc" : "transparent",
                  transition: "background-color 0.2s ease" 
                }}>
                  <td style={{ padding: "20px 8px", color: "#2563eb", fontWeight: "700" }}>{row._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: "20px 8px", color: "#1e293b", fontWeight: "600" }}>{row.category}</td>
                  <td style={{ padding: "20px 8px", color: "#64748b" }}>{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "20px 8px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", ...getPriorityStyle(row.priority) }}>
                      {row.priority}
                    </span>
                  </td>
                  <td style={{ padding: "20px 8px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", ...getStatusStyle(row.status) }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "20px 8px", textAlign: "right" }}>
                    {/* Functional Active Trigger Interaction */}
                    <button 
                      onClick={() => handleToggleDetails(row._id || row.id)}
                      style={{ 
                        background: "none", 
                        border: "none", 
                        color: "#2563eb", 
                        fontWeight: "600", 
                        cursor: "pointer", 
                        fontSize: "14px",
                        padding: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      {isExpanded ? "Hide Details ↑" : "View Details →"}
                    </button>
                  </td>
                </tr>

                {/* 2. DYNAMIC EXPANDABLE LOGICAL PANEL VIEW */}
                {isExpanded && (
                  <tr>
                    <td colSpan="6" style={{ backgroundColor: "#f8fafc", padding: "0 24px 24px 24px" }}>
                      <div style={{ 
                        backgroundColor: "#ffffff", 
                        border: "1px solid #e2e8f0", 
                        borderRadius: "12px", 
                        padding: "20px", 
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" 
                      }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "15px", fontWeight: "700" }}>
                          Full System Log Description ({row._id.slice(-6).toUpperCase()})
                        </h4>
                        <p style={{ margin: "0 0 16px 0", color: "#475569", lineHeight: "1.6", fontSize: "13.5px" }}>
                          {row.description}
                        </p>
                        <div style={{ display: "flex", gap: "24px", fontSize: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                           <div>
                            <span style={{ color: "#94a3b8", fontWeight: "600" }}>Escalation Target Group:</span>{" "}
                            {isAdmin ? (
                              <select 
                                value={row.assignedAgent?._id || row.assignedAgent || ""} 
                                onChange={(e) => handleAssignAgent(row._id, e.target.value)}
                                style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", outline: "none" }}
                              >
                                <option value="">Select Agent</option>
                                {agents.map(agent => (
                                  <option key={agent._id} value={agent._id}>{agent.name}</option>
                                ))}
                              </select>
                            ) : (
                              <span style={{ color: "#475569", fontWeight: "700" }}>{row.assignedAgent?.name || "Not Assigned"}</span>
                            )}
                          </div>
                          <div>
                            <span style={{ color: "#94a3b8", fontWeight: "600" }}>SLA Validation:</span>{" "}
                            <span style={{ color: "#10b981", fontWeight: "700" }}>Active (Healthy)</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}