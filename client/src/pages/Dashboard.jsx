import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCards from "../components/DashboardCards";
import ComplaintTable from "../components/ComplaintTable";

export default function Dashboard() {
 const [complaints, setComplaints] = useState([]);
 const [customers, setCustomers] = useState([]);

 useEffect(() => {
   const isAdm = localStorage.getItem("role") === "admin";
   const fetchComplaints = async () => {
     try {
       const url = isAdm ? "http://localhost:5001/api/complaints" : "http://localhost:5001/api/complaints/my";
       const response = await fetch(
         url,
         {
           method:"GET",
           headers:{
             Authorization:
             `Bearer ${localStorage.getItem("token")}`
           }
         }
       );

       const data = await response.json();

       if(data.success){
         setComplaints(data.data);
       }
     }
     catch(error){
       console.log(error);
     }
   };

   const fetchCustomersList = async () => {
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
       console.log(error);
     }
   };

   fetchComplaints();
   if (isAdm) {
     fetchCustomersList();
   }
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
       console.log(error);
     }
   }
 };
  return (
    
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Sidebar />
      
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Dashboard" />
        
        <main style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
          <DashboardCards complaints={complaints}/>

          {/* CHARTS CONTAINER */}
          <div style={{ display: "flex", gap: "28px", width: "100%", flexWrap: "wrap" }}>
            
            {/* Box 1: Complaints Overview Card (With Vertical Axis Numbers) */}
            <div style={{ flex: 2, minWidth: "350px", backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
              <div style={{ display: "flex", justifycontent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Complaints Overview</h3>
                  <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>Monthly trend analysis of submitted vs resolved tickets</p>
                </div>
                
                <div style={{ display: "flex", gap: "16px", fontSize: "12px", fontWeight: "600" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "12px", height: "3px", backgroundColor: "#2563eb", borderRadius: "2px" }} />
                    <span style={{ color: "#475569" }}>Complaints</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "12px", height: "3px", backgroundColor: "#10b981", borderRadius: "2px" }} />
                    <span style={{ color: "#475569" }}>Resolved</span>
                  </div>
                </div>
              </div>
              
              <div style={{ height: "260px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", padding: "24px 24px 16px 16px", boxSizing: "border-box", marginTop: "24px" }}>
                
                {/* Graph Workspace Container with Vertical Y-Axis Numbers Grid */}
                <div style={{ flex: 1, display: "flex", width: "100%", position: "relative" }}>
                  
                  {/* Vertical Y-Axis Numbers Side Strip */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", width: "24px", paddingRight: "12px", fontSize: "11px", fontWeight: "600", color: "#94a3b8", height: "100%", boxSizing: "border-box" }}>
                    <span>12</span>
                    <span>8</span>
                    <span>4</span>
                    <span>0</span>
                  </div>

                  {/* SVG Chart paths window viewbox */}
                  <div style={{ flex: 1, position: "relative", height: "100%" }}>
                    <svg viewBox="0 0 500 130" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill Gradient under Curve */}
                      <path d="M 20,110 Q 110,60 210,50 T 390,95 T 470,35 L 470,130 L 20,130 Z" fill="url(#blueGradient)" />

                      {/* Line 1: Total Complaints (Solid Blue) */}
                      <path d="M 20,110 Q 110,60 210,50 T 390,95 T 470,35" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Line 2: Resolved Cases (Dashed Green) */}
                      <path d="M 20,120 Q 110,85 210,65 T 390,80 T 470,45" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Endpoint Markers */}
                      <circle cx="470" cy="35" r="4.5" fill="#2563eb" />
                      <circle cx="470" cy="45" r="4.5" fill="#10b981" />
                    </svg>
                  </div>
                </div>

                {/* Horizontal Month Labels Offset aligned with Y-axis width */}
                <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "36px", paddingRight: "8px", marginTop: "14px", fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>
            </div>

            {/* Box 2: Complaints by Category Card */}
            <div style={{ flex: 1, minWidth: "320px", backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Complaints by Category</h3>
              <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 20px 0" }}>Distribution breakdown</p>
              
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
                <div style={{ position: "relative", width: "130px", height: "130px" }}>
                  <svg width="100%" height="100%" viewBox="0 0 42 42" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="5.5" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="6" strokeDasharray="50 100" strokeDashoffset="0" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray="25 100" strokeDashoffset="-50" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="15 100" strokeDashoffset="-75" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="10 100" strokeDashoffset="-90" />
                  </svg>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", width: "100%", padding: "0 8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#2563eb", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Billing (50%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Security (25%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Technical (15%)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Others (10%)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Table Container */}
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>System Log Data Records</h3>
            <ComplaintTable complaints={complaints}/>
          </div>

          {localStorage.getItem("role") === "admin" && (
            <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: "0 0 20px 0" }}>System Customer Directory</h3>
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
          )}

        </main>
      </div>
    </div>
  );
}