import { API_URL } from "../../config";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export default function Customers() {
  const [activeTab, setActiveTab] = useState("Customers");
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [customFields, setCustomFields] = useState([]);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCustomFields, setEditCustomFields] = useState({});

  // New Custom Field State
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL + "/admin/customers", {
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
      const response = await fetch(API_URL + "/agents", {
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
    fetchCustomers();
    fetchAgents();
    fetchCustomFields();
  }, []);

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer registry?")) {
      try {
        const response = await fetch(API_URL + `/admin/customer/${id}`, {
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
      const response = await fetch(API_URL + `/agents/${id}/status`, {
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
        const response = await fetch(API_URL + `/agents/${id}`, {
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

  const handleAddCustomField = async (e) => {
    e.preventDefault();
    if (!newFieldName.trim()) return;
    try {
      const response = await fetch(API_URL + "/admin/custom-fields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: newFieldName,
          type: newFieldType,
          isRequired: newFieldRequired
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Custom field added successfully.");
        setNewFieldName("");
        setNewFieldType("text");
        setNewFieldRequired(false);
        fetchCustomFields();
      } else {
        alert(data.message || "Failed to add custom field.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCustomField = async (id) => {
    if (window.confirm("Are you sure you want to delete this custom field? All values associated with this field will be permanently lost.")) {
      try {
        const response = await fetch(API_URL + `/admin/custom-fields/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success) {
          alert("Custom field deleted successfully.");
          fetchCustomFields();
        } else {
          alert(data.message || "Failed to delete custom field.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOpenEditModal = async (cust) => {
    try {
      const response = await fetch(API_URL + `/admin/customer/${cust._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        const c = data.data;
        setSelectedCustomer(c);
        setEditName(c.name || "");
        setEditPhone(c.phone || "");
        setEditAddress(c.address || "");
        setEditCustomFields(c.customFields || {});
        setIsEditModalOpen(true);
      } else {
        alert("Failed to load customer details.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveCustomerChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL + `/admin/customer/${selectedCustomer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          address: editAddress,
          customFields: editCustomFields
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Customer details updated successfully!");
        setIsEditModalOpen(false);
        fetchCustomers();
      } else {
        alert(data.message || "Failed to update customer details.");
      }
    } catch (error) {
      console.error(error);
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
            {["Customers", "Agents", "Custom Fields"].map((tab) => {
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

          {activeTab === "Customers" && (
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
                          <td style={{ padding: "16px", fontSize: "14px", textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button 
                              onClick={() => handleOpenEditModal(cust)} 
                              style={{ 
                                padding: "6px 12px", backgroundColor: "#2563EB", color: "#ffffff", 
                                border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "12px" 
                              }}
                            >
                              View/Edit
                            </button>
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
          )}

          {activeTab === "Agents" && (
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

          {activeTab === "Custom Fields" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
              {/* Form Block */}
              <div style={{ backgroundColor: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>Create New Custom Field</h3>
                <form onSubmit={handleAddCustomField} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Field Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Preferred Language" 
                      value={newFieldName} 
                      onChange={(e) => setNewFieldName(e.target.value)} 
                      required 
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} 
                    />
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Field Type</label>
                    <select 
                      value={newFieldType} 
                      onChange={(e) => setNewFieldType(e.target.value)} 
                      style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#ffffff" }}
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
                    <input 
                      type="checkbox" 
                      id="required" 
                      checked={newFieldRequired} 
                      onChange={(e) => setNewFieldRequired(e.target.checked)} 
                    />
                    <label htmlFor="required" style={{ fontSize: "13px", fontWeight: "600", color: "#475569", cursor: "pointer" }}>Is Required</label>
                  </div>

                  <button 
                    type="submit" 
                    style={{ 
                      backgroundColor: "#2563EB", color: "#ffffff", padding: "12px", 
                      borderRadius: "8px", border: "none", fontWeight: "600", cursor: "pointer", fontSize: "14px", transition: "0.2s" 
                    }}
                  >
                    Add Field
                  </button>
                </form>
              </div>

              {/* Data Table Block */}
              <div style={{ backgroundColor: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>Configured Customizable Fields</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #F1F5F9" }}>
                        <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Field Name</th>
                        <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Type</th>
                        <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Required</th>
                        <th style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customFields.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ padding: "16px", fontStyle: "italic", color: "#94a3b8", textAlign: "center" }}>No custom fields configured.</td>
                        </tr>
                      ) : (
                        customFields.map((field) => (
                          <tr key={field._id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td style={{ padding: "16px", fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>{field.name}</td>
                            <td style={{ padding: "16px", fontSize: "14px", color: "#475569" }}>{field.type}</td>
                            <td style={{ padding: "16px", fontSize: "14px", color: "#64748B" }}>{field.isRequired ? "Yes" : "No"}</td>
                            <td style={{ padding: "16px", fontSize: "14px", textAlign: "center" }}>
                              <button 
                                onClick={() => handleDeleteCustomField(field._id)} 
                                style={{ 
                                  padding: "6px 12px", backgroundColor: "#EF4444", color: "#ffffff", 
                                  border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "12px" 
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CUSTOMER DETAIL VIEW/EDIT MODAL */}
      {isEditModalOpen && selectedCustomer && (
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
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#94a3b8" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCustomerChanges} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Full Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required 
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Phone Number</label>
                <input 
                  type="text" 
                  value={editPhone} 
                  onChange={(e) => setEditPhone(e.target.value)} 
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} 
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Address</label>
                <textarea 
                  value={editAddress} 
                  onChange={(e) => setEditAddress(e.target.value)} 
                  style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", minHeight: "80px", fontFamily: "inherit" }} 
                />
              </div>

              {/* RENDER CUSTOMIZABLE FIELDS DYNAMICALLY */}
              {customFields.length > 0 && (
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b", margin: "0 0 4px 0" }}>Additional Business Properties</h4>
                  {customFields.map((field) => (
                    <div key={field._id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>
                        {field.name} {field.isRequired && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input 
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} 
                        value={editCustomFields[field.name] || ""} 
                        onChange={(e) => setEditCustomFields({ ...editCustomFields, [field.name]: e.target.value })} 
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
                  onClick={() => setIsEditModalOpen(false)} 
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
