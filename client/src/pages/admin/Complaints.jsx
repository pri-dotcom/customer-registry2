import { API_URL } from "../../config";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [customerFilter, setCustomerFilter] = useState("All");
  const [agentFilter, setAgentFilter] = useState("All");

  const fetchData = async () => {
    try {
      const resComplaints = await fetch(API_URL + "/complaints", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const dataComplaints = await resComplaints.json();
      if (dataComplaints.success) {
        setComplaints(dataComplaints.data);
      }

      const resAgents = await fetch(API_URL + "/agents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const dataAgents = await resAgents.json();
      if (dataAgents.success) {
        setAgents(dataAgents.data);
      }

      const resCustomers = await fetch(API_URL + "/admin/customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const dataCustomers = await resCustomers.json();
      if (dataCustomers.success) {
        setCustomers(dataCustomers.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignAgent = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      const response = await fetch(`${API_URL}/complaints/${complaintId}/assign`, {
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
        fetchData();
      } else {
        alert(data.message || "Failed to assign agent.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Helper styles for operational status pills
  const getStatusStyle = (status) => {
    if (status === "Pending") return { backgroundColor: "#FEF3C7", color: "#D97706" };
    if (status === "Resolved") return { backgroundColor: "#D1FAE5", color: "#059669" };
    if (status === "In Progress") return { backgroundColor: "#DBEAFE", color: "#2563EB" };
    return { backgroundColor: "#F1F5F9", color: "#475569" };
  };

  const getPriorityStyle = (priority) => {
    if (priority === "High") return { backgroundColor: "#FEE2E2", color: "#DC2626" };
    if (priority === "Medium") return { backgroundColor: "#FFFBEB", color: "#D97706" };
    return { backgroundColor: "#F1F5F9", color: "#475569" };
  };

  const filteredComplaints = complaints.filter(ticket => {
    const matchesSearch = 
      ticket._id?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.category?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customer?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesCustomer = customerFilter === "All" || ticket.customer?._id === customerFilter;
    const matchesAgent = agentFilter === "All" || (ticket.assignedAgent?._id || ticket.assignedAgent) === agentFilter;

    return matchesSearch && matchesStatus && matchesCustomer && matchesAgent;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <AdminSidebar />
      
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Global Complaint Registry" />
        
        <main style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", boxSizing: "border-box" }}>
          
          {/* Filter Toolbar */}
          <div style={{ display: "flex", gap: "16px", backgroundColor: "#ffffff", padding: "16px 24px", borderRadius: "16px", border: "1px solid #eef2f6", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <input 
                type="text" 
                placeholder="Search complaints..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none" }}
              />
            </div>
            <div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", backgroundColor: "#FFFFFF" }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <select 
                value={customerFilter} 
                onChange={(e) => setCustomerFilter(e.target.value)}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", backgroundColor: "#FFFFFF" }}
              >
                <option value="All">All Customers</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select 
                value={agentFilter} 
                onChange={(e) => setAgentFilter(e.target.value)}
                style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", backgroundColor: "#FFFFFF" }}
              >
                <option value="All">All Agents</option>
                {agents.map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Complaints Table Container */}
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>System Complaints Records</h3>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Complaint ID</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Customer</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Category</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Priority</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Assigned Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: "16px", fontStyle: "italic", color: "#94a3b8", textAlign: "center" }}>No matching complaints found.</td>
                    </tr>
                  ) : (
                    filteredComplaints.map((ticket) => (
                      <tr key={ticket._id || ticket.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "600", color: "#2563eb" }}>#{ticket._id ? ticket._id.slice(-6).toUpperCase() : ticket.id}</td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#334155", fontWeight: "700" }}>{ticket.customer?.name || "Customer"}</td>
                        <td style={{ padding: "16px", fontSize: "14px", color: "#475569" }}>{ticket.category}</td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", ...getPriorityStyle(ticket.priority) }}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", ...getStatusStyle(ticket.status) }}>
                            {ticket.status}
                          </span>
                        </td>
                        <td style={{ padding: "16px", fontSize: "14px" }}>
                          <select 
                            value={ticket.assignedAgent?._id || ticket.assignedAgent || ""} 
                            onChange={(e) => handleAssignAgent(ticket._id, e.target.value)}
                            style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "13px", outline: "none", backgroundColor: "#FFFFFF" }}
                          >
                            <option value="">Select Agent</option>
                            {agents.map(agent => (
                              <option key={agent._id} value={agent._id}>{agent.name}</option>
                            ))}
                          </select>
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
