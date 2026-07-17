import { API_URL } from "../config";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function FeedbackHistory({ userName }) {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const isAdmin = localStorage.getItem("role") === "admin";
        const url = isAdmin ? API_URL + "/feedback" : API_URL + "/feedback/my";
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          const formatted = data.data.map(item => {
            const getRatingText = (score) => {
              if (score >= 5) return "Excellent";
              if (score === 4) return "Good";
              if (score === 3) return "Average";
              return "Poor";
            };
            return {
              id: item.complaint ? `#${item.complaint._id.slice(-6).toUpperCase()}` : "Feedback",
              title: item.complaint ? item.complaint.title : "Feedback comment",
              date: new Date(item.createdAt).toLocaleDateString(),
              rating: item.rating,
              status: getRatingText(item.rating)
            };
          });
          setHistoryData(formatted);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: "256px" }}>
        <Navbar title="Feedback History" userName={userName} />
        
        <main style={{ padding: "32px", maxWidth: "1000px" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0F172A", marginBottom: "20px" }}>All Feedback History</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {historyData.map((item) => (
                <div key={item.id} style={{ border: "1px solid #F1F5F9", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>{item.id} - {item.title}</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{item.date}</div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", backgroundColor: "#ECFDF5", color: "#10B981", padding: "4px 12px", borderRadius: "6px" }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}