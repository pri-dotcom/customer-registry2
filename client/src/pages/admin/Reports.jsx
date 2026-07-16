import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export default function Reports() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAgents: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    assignedComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    closedComplaints: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/admin/statistics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <AdminSidebar />
      
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="System Reports & Analytics" />
        
        <main style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
          
          {/* Performance stats indicators */}
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 8px 0" }}>SLA Processing Distribution</h3>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 24px 0" }}>Breakdown of operational backlogs and ticket status</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  <span style={{ color: "#475569" }}>Resolved Cases ({stats.resolvedComplaints} tickets)</span>
                  <span style={{ color: "#1e293b" }}>{stats.totalComplaints > 0 ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "#F1F5F9", borderRadius: "4px" }}>
                  <div style={{ width: `${stats.totalComplaints > 0 ? (stats.resolvedComplaints / stats.totalComplaints) * 100 : 0}%`, height: "100%", backgroundColor: "#10b981", borderRadius: "4px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  <span style={{ color: "#475569" }}>In Progress / Debugging ({stats.inProgressComplaints} tickets)</span>
                  <span style={{ color: "#1e293b" }}>{stats.totalComplaints > 0 ? Math.round((stats.inProgressComplaints / stats.totalComplaints) * 100) : 0}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "#F1F5F9", borderRadius: "4px" }}>
                  <div style={{ width: `${stats.totalComplaints > 0 ? (stats.inProgressComplaints / stats.totalComplaints) * 100 : 0}%`, height: "100%", backgroundColor: "#2563eb", borderRadius: "4px" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
                  <span style={{ color: "#475569" }}>Pending / Unassigned ({stats.pendingComplaints} tickets)</span>
                  <span style={{ color: "#1e293b" }}>{stats.totalComplaints > 0 ? Math.round((stats.pendingComplaints / stats.totalComplaints) * 100) : 0}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", backgroundColor: "#F1F5F9", borderRadius: "4px" }}>
                  <div style={{ width: `${stats.totalComplaints > 0 ? (stats.pendingComplaints / stats.totalComplaints) * 100 : 0}%`, height: "100%", backgroundColor: "#F59E0B", borderRadius: "4px" }} />
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
