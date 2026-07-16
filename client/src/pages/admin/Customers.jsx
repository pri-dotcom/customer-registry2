import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export default function Customers() {
  const [activeTab, setActiveTab] = useState("Customers");
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/admin/customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/agents", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAgents(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchAgents();
  }, []);

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer registry?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/admin/customer/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success) {
          alert("Customer deleted successfully.");
          setCustomers(customers.filter(c => c._id !== id));
        } else {
          alert(data.message || "Failed to delete customer.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleAgentStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/agents/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert("Agent status updated successfully.");
        fetchAgents();
      } else {
        alert(data.message || "Failed to toggle status.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAgent = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent registry?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/agents/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success) {
          alert("Agent deleted successfully.");
          setAgents(agents.filter(a => a._id !== id));
        } else {
          alert(data.message || "Failed to delete agent.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <AdminSidebar />
      
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Registered Users" />
        
        <main style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
          
          {/* Tab Selector buttons */}
          <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid #E2E8F0", marginBottom: "8px" }}>
            {["Customers", "Agents"].map((tab) => {
              const isTabActive = activeTab === tab;
              return (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    color: isTabActive ? "#2563EB" : "#64748B",
                    fontWeight: isTabActive ? "600" : "500",
                    borderBottom: isTabActive ? "2px solid #2563EB" : "2px solid transparent",
                    paddingBottom: "12px",
                    cursor: "pointer",
                    fontSize: "15px"
                  }}
                >
                  {tab}
                </div>
              );
            })}
          </div>

          {activeTab === "Customers" ? (
            <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>System Customer Directory</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Name</th>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Email</th>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Phone</th>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: "16px", fontStyle: "italic", color: "#94a3b8", textAlign: "center" }}>No registered customers found.</td>
                      </tr>
                    ) : (
                      customers.map((cust) => (
                        <tr key={cust._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>{cust.name}</td>
                          <td style={{ padding: "16px", fontSize: "14px", color: "#475569" }}>{cust.email}</td>
                          <td style={{ padding: "16px", fontSize: "14px", color: "#64748B" }}>{cust.phone || "N/A"}</td>
                          <td style={{ padding: "16px", fontSize: "14px", textAlign: "center" }}>
                            <button 
                              onClick={() => handleDeleteCustomer(cust._id)} 
                              style={{ 
                                padding: "6px 12px", backgroundColor: "#EF4444", color: "#ffffff", 
                                border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "12px" 
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>System Support Agents Directory</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Name</th>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Email</th>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Status</th>
                      <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: "16px", fontStyle: "italic", color: "#94a3b8", textAlign: "center" }}>No support agents found.</td>
                      </tr>
                    ) : (
                      agents.map((agent) => (
                        <tr key={agent._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>{agent.name}</td>
                          <td style={{ padding: "16px", fontSize: "14px", color: "#475569" }}>{agent.email}</td>
                          <td style={{ padding: "16px", fontSize: "14px" }}>
                            <span 
                              onClick={() => handleToggleAgentStatus(agent._id)}
                              style={{ 
                                padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer",
                                backgroundColor: agent.isActive ? "#D1FAE5" : "#FEE2E2", 
                                color: agent.isActive ? "#059669" : "#DC2626" 
                              }}
                            >
                              {agent.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td style={{ padding: "16px", fontSize: "14px", textAlign: "center" }}>
                            <button 
                              onClick={() => handleDeleteAgent(agent._id)} 
                              style={{ 
                                padding: "6px 12px", backgroundColor: "#EF4444", color: "#ffffff", 
                                border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "12px" 
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
