import React, { useState, useEffect } from "react";
import AgentSidebar from "../../components/AgentSidebar";
import Navbar from "../../components/Navbar";

export default function AgentDashboard() {
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/dashboard/agent", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          setStats({
            totalAssigned: data.data.totalAssigned || 0,
            pending: data.data.pending || 0,
            resolved: data.data.resolved || 0,
            inProgress: data.data.inProgress || 0
          });
          setRecentComplaints(data.data.recentComplaints || []);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboard();
  }, []);

  const metrics = [
    { title: "Assigned Cases", count: String(stats.totalAssigned), color: "#2563eb", subtitle: "Active tickets assigned to you" },
    { title: "Pending Resolution", count: String(stats.pending), color: "#F59E0B", subtitle: "Awaiting backend fix" },
    { title: "Resolved Today", count: String(stats.resolved), color: "#10b981", subtitle: "Closed within past 24 hrs" },
    { title: "New Urgent Tickets", count: String(stats.inProgress), color: "#EF4444", subtitle: "In Progress tickets" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Agent Sidebar Navigation Component */}
      <AgentSidebar />
      
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Agent Dashboard" />
        
        <main style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
          
          {/* AGENT METRIC CARDS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", width: "100%" }}>
            {metrics.map((card, i) => (
              <div key={i} style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02)" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>{card.title}</span>
                <h2 style={{ fontSize: "36px", fontWeight: "800", color: card.color, margin: "8px 0" }}>{card.count}</h2>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{card.subtitle}</p>
              </div>
            ))}
          </div>

          {/* CHARTS CONTAINER CONTAINER MATCHING CUSTOMER PORTAL */}
          <div style={{ display: "flex", gap: "28px", width: "100%", flexWrap: "wrap" }}>
            
            {/* Box 1: Performance/Complaints Trends Overview Card */}
            <div style={{ flex: 2, minWidth: "350px", backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Performance Overview</h3>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>Monthly trend analysis of incoming vs resolved tickets</p>
                </div>
                
                <div style={{ display: "flex", gap: "16px", fontSize: "12px", fontWeight: "600" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "12px", height: "3px", backgroundColor: "#2563eb", borderRadius: "2px" }} />
                    <span style={{ color: "#475569" }}>Assigned</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "12px", height: "3px", backgroundColor: "#10b981", borderRadius: "2px" }} />
                    <span style={{ color: "#475569" }}>Resolved</span>
                  </div>
                </div>
              </div>
              
              <div style={{ height: "260px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", padding: "24px 24px 16px 16px", boxSizing: "border-box", marginTop: "24px" }}>
                <div style={{ flex: 1, display: "flex", width: "100%", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", width: "24px", paddingRight: "12px", fontSize: "11px", fontWeight: "600", color: "#94a3b8", height: "100%", boxSizing: "border-box" }}>
                    <span>20</span>
                    <span>14</span>
                    <span>7</span>
                    <span>0</span>
                  </div>

                  <div style={{ flex: 1, position: "relative", height: "100%" }}>
                    <svg viewBox="0 0 500 130" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>
                      <path d="M 20,110 Q 110,50 210,60 T 390,85 T 470,25 L 470,130 L 20,130 Z" fill="url(#blueGradient)" />
                      <path d="M 20,110 Q 110,50 210,60 T 390,85 T 470,25" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 20,120 Q 110,75 210,70 T 390,75 T 470,35" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="470" cy="25" r="4.5" fill="#2563eb" />
                      <circle cx="470" cy="35" r="4.5" fill="#10b981" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "36px", paddingRight: "8px", marginTop: "14px", fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>
            </div>

            {/* Box 2: Category distribution card matching styling preview */}
            <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Ticket Categories</h3>
                <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 24px 0" }}>Distribution by type</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    <span style={{ color: "#475569" }}>Technical Issues</span>
                    <span style={{ color: "#1e293b" }}>55%</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "#F1F5F9", borderRadius: "4px" }}>
                    <div style={{ width: "55%", height: "100%", backgroundColor: "#2563eb", borderRadius: "4px" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    <span style={{ color: "#475569" }}>Billing & Payments</span>
                    <span style={{ color: "#1e293b" }}>30%</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "#F1F5F9", borderRadius: "4px" }}>
                    <div style={{ width: "30%", height: "100%", backgroundColor: "#10b981", borderRadius: "4px" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                    <span style={{ color: "#475569" }}>Account Security</span>
                    <span style={{ color: "#1e293b" }}>15%</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "#F1F5F9", borderRadius: "4px" }}>
                    <div style={{ width: "15%", height: "100%", backgroundColor: "#EF4444", borderRadius: "4px" }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RECENT ASSIGNED COMPLAINTS CONTAINER */}
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>Recent Assigned Complaints</h3>
            
            {/* Simple Table structure matching your portal theme styles */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Complaint ID</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Customer</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Category</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Priority</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: "16px", fontStyle: "italic", color: "#94a3b8", textAlign: "center" }}>No complaints assigned to you yet.</td>
                    </tr>
                  ) : (
                    recentComplaints.map((ticket) => (
                      <tr key={ticket._id || ticket.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#2563eb" }}>#{ticket._id ? ticket._id.slice(-6).toUpperCase() : ticket.id}</td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#334155" }}>{ticket.customer?.name || "Customer"}</td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#475569" }}>{ticket.category}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <span style={{ 
                            color: ticket.priority === "High" ? "#EF4444" : ticket.priority === "Medium" ? "#D97706" : "#64748B", 
                            backgroundColor: ticket.priority === "High" ? "#FEE2E2" : ticket.priority === "Medium" ? "#FEF3C7" : "#F1F5F9", 
                            padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" 
                          }}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <span style={{ 
                            color: ticket.status === "Resolved" ? "#10B981" : ticket.status === "In Progress" ? "#2563EB" : "#D97706", 
                            backgroundColor: ticket.status === "Resolved" ? "#D1FAE5" : ticket.status === "In Progress" ? "#DBEAFE" : "#FEF3C7", 
                            padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" 
                          }}>
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}