import React from "react";
import AgentSidebar from "../../components/AgentSidebar";
import Navbar from "../../components/Navbar";

export default function Reports() {
  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh", 
      backgroundColor: "#F8FAFC", 
      fontFamily: "system-ui, -apple-system, sans-serif" 
    }}>
      <AgentSidebar />
      
      <div style={{ 
        flex: 1, 
        marginLeft: "256px", 
        width: "calc(100% - 256px)", 
        display: "flex", 
        flexDirection: "column",
        backgroundColor: "#F8FAFC"
      }}>
        <Navbar title="Performance Reports" />
        
        <main style={{ 
          padding: "32px", 
          maxWidth: "1200px", 
          width: "100%", 
          margin: "0 auto", 
          display: "flex", 
          flexDirection: "column", 
          gap: "32px", 
          boxSizing: "border-box" 
        }}>
          
          {/* TOP METRIC CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", width: "100%" }}>
            
            {/* Card 1: Speed */}
            <div style={{ 
              backgroundColor: "#ffffff", 
              padding: "32px", 
              borderRadius: "24px", 
              border: "1px solid #EEF2F6", 
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)"
            }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Average Time to Fix Problems
              </span>
              <div style={{ display: "flex", alignItems: "baseline", margin: "16px 0 12px 0" }}>
                <h2 style={{ fontSize: "48px", fontWeight: "800", color: "#2563EB", margin: 0, lineHeight: "1" }}>
                  1.8
                </h2>
                <span style={{ fontSize: "16px", fontWeight: "600", color: "#94A3B8", marginLeft: "8px" }}>
                  Hours
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "#10B981", fontWeight: "600", margin: 0 }}>
                ↓ 12% faster than last month
              </p>
            </div>

            {/* Card 2: First Attempt */}
            <div style={{ 
              backgroundColor: "#ffffff", 
              padding: "32px", 
              borderRadius: "24px", 
              border: "1px solid #EEF2F6", 
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)"
            }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Solved on First Attempt
              </span>
              <div style={{ margin: "16px 0 12px 0" }}>
                <h2 style={{ fontSize: "48px", fontWeight: "800", color: "#10B981", margin: 0, padding: 0, lineHeight: "1" }}>
                  84.2%
                </h2>
              </div>
              <p style={{ fontSize: "13px", color: "#94A3B8", fontWeight: "500", margin: 0 }}>
                Target goal: 80%
              </p>
            </div>

          </div>

          {/* LOWER PROGRESS BARS */}
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "40px", 
            borderRadius: "24px", 
            border: "1px solid #EEF2F6", 
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)" 
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: "0 0 6px 0" }}>
              Monthly Speed Targets
            </h3>
            <p style={{ fontSize: "15px", color: "#64748B", margin: "0 0 32px 0" }}>
              How well our support agents are keeping up with customer deadlines and complaints
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              
              {/* Target 1: Deadlines */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "600", marginBottom: "10px" }}>
                  <span style={{ color: "#334155" }}>Fixed Before Deadline</span>
                  <span style={{ color: "#1E293B", fontWeight: "700" }}>96%</span>
                </div>
                <div style={{ width: "100%", height: "10px", backgroundColor: "#F1F5F9", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: "96%", height: "100%", backgroundColor: "#10B981", borderRadius: "999px" }} />
                </div>
              </div>

              {/* Target 2: Daily Clearance */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "600", marginBottom: "10px" }}>
                  <span style={{ color: "#334155" }}>Daily Complaints Cleared</span>
                  <span style={{ color: "#1E293B", fontWeight: "700" }}>78%</span>
                </div>
                <div style={{ width: "100%", height: "10px", backgroundColor: "#F1F5F9", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: "78%", height: "100%", backgroundColor: "#2563EB", borderRadius: "999px" }} />
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}