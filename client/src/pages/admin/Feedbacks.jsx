import { API_URL } from "../../config";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Navbar from "../../components/Navbar";

export default function Feedbacks() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(API_URL + "/feedback", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          const formatted = data.data.map(item => ({
            id: item.complaint ? `#${item.complaint._id.slice(-6).toUpperCase()}` : "Feedback",
            customer: item.customer?.name || "Customer",
            rating: "★".repeat(item.rating) + "☆".repeat(5 - item.rating),
            text: item.comment || "",
            date: new Date(item.createdAt).toLocaleDateString(),
            rawRating: item.rating
          }));
          setReviews(formatted);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, []);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, item) => sum + item.rawRating, 0) / totalReviews).toFixed(1) : "0.0";
  const highRatings = reviews.filter(r => r.rawRating >= 4).length;
  const satisfactionRate = totalReviews > 0 ? Math.round((highRatings / totalReviews) * 100) : 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <AdminSidebar />
      
      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Global Customer Feedback Logs" />
        
        <main style={{ padding: "32px", maxWidth: "1200px", width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
          
          {/* OVERVIEW CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", width: "100%" }}>
            <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #eef2f6" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Global Average Score</span>
              <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#F59E0B", margin: "8px 0" }}>{avgRating} <span style={{ fontSize: "18px", fontWeight: "500", color: "#94A3B8" }}>/ 5</span></h2>
              <p style={{ fontSize: "12px", color: "#10b981", margin: 0, fontWeight: "600" }}>★ Customer Approved Portal</p>
            </div>
            <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #eef2f6" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Satisfaction Threshold</span>
              <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#10b981", margin: "8px 0" }}>{satisfactionRate}%</h2>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Computed across {totalReviews} reviews</p>
            </div>
          </div>

          {/* STREAM LIST OF INDIVIDUAL FEEDBACKS */}
          <div style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "20px", border: "1px solid #eef2f6", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", margin: "0 0 24px 0" }}>Latest Customer Reviews</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {reviews.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#94A3B8", fontStyle: "italic" }}>No reviews logged in system yet.</div>
              ) : (
                reviews.map((rev, idx) => (
                  <div key={idx} style={{ padding: "20px", borderRadius: "16px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <span style={{ fontSize: "14px", fontWeight: "700", color: "#334155", marginRight: "12px" }}>{rev.customer}</span>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#2563eb" }}>{rev.id}</span>
                      </div>
                      <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>{rev.date}</span>
                    </div>
                    <div style={{ fontSize: "16px", color: "#F59E0B", marginBottom: "8px", letterSpacing: "2px" }}>{rev.rating}</div>
                    <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: "1.5" }}>"{rev.text}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
