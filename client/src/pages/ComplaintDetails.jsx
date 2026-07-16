import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ComplaintDetails() {
  const timelineSteps = [
    { title: "Complaint Registered", date: "Jul 02, 2026 - 10:30 AM", desc: "Ticket initialized successfully under ID CMP-4829.", done: true },
    { title: "Assigned to Agent", date: "Jul 02, 2026 - 02:15 PM", desc: "Route completed to Technical Operations Group.", done: true },
    { title: "Investigation Underway", date: "In Progress", desc: "Verifying current backend account ledger configuration errors.", done: false },
    { title: "Resolution Complete", date: "Pending", desc: "Final verification steps remaining.", done: false },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F6F8FC" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Complaint Information Overview" />
        <main style={{ padding: "32px", maxWidth: "1100px", width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
          
          {/* Details Block */}
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", height: "fit-content" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "20px" }}>
              <span style={{ fontFamily: "monospace", fontWeight: "700", color: "#2563eb", fontSize: "18px" }}>Ticket: CMP-4829</span>
              <span style={{ backgroundColor: "#fffbeb", color: "#b45309", fontSize: "12px", padding: "4px 12px", borderRadius: "9999px", fontWeight: "700" }}>Under Review</span>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Subject Category</h4>
              <p style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginTop: "4px", margin: 0 }}>Billing Discrepancy & Service Error</p>
            </div>
            <div>
              <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>Detailed Description</h4>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", marginTop: "4px", margin: 0 }}>
                The automated monthly subscription payment charged my linked account ledger twice on July 1st. Please reverse the secondary duplicate statement and update the profile status.
              </p>
            </div>
          </div>

          {/* Progress Timeline */}
          <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", height: "fit-content" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "24px", margin: 0 }}>Milestone Progress</h3>
            <div style={{ borderLeft: "2px solid #e2e8f0", marginLeft: "8px", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {timelineSteps.map((step, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: "-25px", top: "2px", width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #ffffff",
                    backgroundColor: step.done ? "#2563eb" : "#cbd5e1"
                  }} />
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: step.done ? "#1e293b" : "#94a3b8" }}>{step.title}</p>
                  <p style={{ margin: "2px 0", fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>{step.date}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}