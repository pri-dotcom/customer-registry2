import { API_URL } from "../../config";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAgents: 0,
    totalComplaints: 0,
    resolvedComplaints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resStats = await fetch(API_URL + "/admin/statistics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const dataStats = await resStats.json();
        if (dataStats.success && dataStats.data) {
          setStats(dataStats.data);
        }

        const resRecent = await fetch(API_URL + "/admin/recent-complaints", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const dataRecent = await resRecent.json();
        if (dataRecent.success && dataRecent.data) {
          setRecentComplaints(dataRecent.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { title: "Registered Customers", count: String(stats.totalCustomers), color: "#2563eb", subtitle: "Active consumer accounts" },
    { title: "Support Agents", count: String(stats.totalAgents), color: "#10b981", subtitle: "Assigned staff registry" },
    { title: "Total Complaints", count: String(stats.totalComplaints), color: "#F59E0B", subtitle: "Logged tickets across system" },
    { title: "Resolved Tickets", count: String(stats.resolvedComplaints), color: "#EF4444", subtitle: "Successfully closed cases" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <AdminSidebar />
      
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Admin Control Dashboard" />
        
        <main style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
          
          {/* METRIC CARDS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", width: "100%" }}>
            {metrics.map((card, i) => (
              <div key={i} style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02)" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>{card.title}</span>
                <h2 style={{ fontSize: "36px", fontWeight: "800", color: card.color, margin: "8px 0" }}>{card.count}</h2>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{card.subtitle}</p>
              </div>
            ))}
          </div>

          {/* CHARTS TREND AREA */}
          <div style={{ display: "flex", gap: "28px", width: "100%", flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: "350px", backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Global Overview</h3>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>Analysis of submitted vs resolved tickets globally</p>
                </div>
              </div>
              <div style={{ height: "260px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", padding: "24px 24px 16px 16px", boxSizing: "border-box", marginTop: "24px" }}>
                <div style={{ flex: 1, display: "flex", width: "100%", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", width: "24px", paddingRight: "12px", fontSize: "11px", fontWeight: "600", color: "#94a3b8", height: "100%", boxSizing: "border-box" }}>
                    <span>50</span>
                    <span>30</span>
                    <span>15</span>
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
                      <path d="M 20,110 Q 110,40 210,50 T 390,70 T 470,15 L 470,130 L 20,130 Z" fill="url(#blueGradient)" />
                      <path d="M 20,110 Q 110,40 210,50 T 390,70 T 470,15" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "36px", paddingRight: "8px", marginTop: "14px", fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT COMPLAINTS TABLE */}
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>System Log Data Records</h3>
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
                      <td colSpan="5" style={{ padding: "16px", fontStyle: "italic", color: "#94a3b8", textAlign: "center" }}>No complaints registered yet.</td>
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
