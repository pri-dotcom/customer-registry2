import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Feedback({ userName }) {
  // --- FORM STATES ---
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("The support team was very helpful and resolved my issue quickly. Great service!");
  const [whatWeDidWell, setWhatWeDidWell] = useState(["Quick Resolution"]);
  const [whatToImprove, setWhatToImprove] = useState(["Better Communication"]);

  // Fetch complaints on mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/complaints/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        if (data.success && data.data) {
          const list = data.data;
          setComplaints(list);
          if (list.length > 0) {
            setSelectedComplaint(list[0]._id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchComplaints();
  }, []);

  // Multi-select toggle helper functions
  const toggleWellChip = (chip) => {
    setWhatWeDidWell(prev => 
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  // --- SUBMIT ACTION HANDLER ---
  const handleSubmitFeedback = async () => {
    if (!selectedComplaint) {
      alert("Please select a complaint ticket.");
      return;
    }
    if (!feedbackMessage.trim()) {
      alert("Please enter a feedback message.");
      return;
    }

    // Find selected complaint details to extract agentId
    const compObj = complaints.find(c => c._id === selectedComplaint);
    const agentId = compObj?.assignedAgent?._id || compObj?.assignedAgent || null;

    try {
      const response = await fetch("http://localhost:5001/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          complaintId: selectedComplaint,
          agentId,
          rating,
          comment: feedbackMessage
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Feedback submitted successfully!");
        setFeedbackMessage("");
        setRating(4);
        setWhatWeDidWell([]);
        setWhatToImprove([]);
      } else {
        alert(data.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting feedback");
    }
  };

  // --- CANCEL ACTION HANDLER ---
  const handleCancelFeedback = () => {
    if (window.confirm("Are you sure you want to clear the form?")) {
      setFeedbackMessage("");
      setRating(4);
      setWhatWeDidWell([]);
      setWhatToImprove([]);
    }
  };

  const toggleImproveChip = (chip) => {
    setWhatToImprove(prev => 
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  // Get qualitative text label for rating score matching layout
  const getRatingLabel = (score) => {
    if (score >= 5) return { text: "Excellent", color: "#10B981", bg: "#ECFDF5" };
    if (score === 4) return { text: "Good", color: "#10B981", bg: "#ECFDF5" };
    if (score === 3) return { text: "Average", color: "#F59E0B", bg: "#FFFBEB" };
    return { text: "Poor", color: "#EF4444", bg: "#FEF2F2" };
  };

  const currentLabel = getRatingLabel(rating);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Sidebar without messages navigation link option */}
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Feedback" userName={userName} />

        <main style={{ padding: "32px", maxWidth: "1280px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          
          {/* TOP PAGE BANNER */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Provide Feedback</h1>
            <p style={{ fontSize: "14px", color: "#64748B", margin: "4px 0 0 0" }}>Your feedback helps us improve our services.</p>
          </div>

          {/* MASTER TWO-COLUMN GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>
            
            {/* LEFT SIDE: FEEDBACK FORM AREA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                
                {/* Section Header Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ color: "#6366F1", backgroundColor: "#EEF2F6", padding: "6px", borderRadius: "8px", fontSize: "18px", display: "flex" }}>💬</div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Share Your Experience</h3>
                </div>

                {/* Form Elements Collection */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  
                  {/* Select Complaint Block */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Select Complaint <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <select 
                        value={selectedComplaint} 
                        onChange={(e) => setSelectedComplaint(e.target.value)}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", outline: "none", backgroundColor: "#FFFFFF", color: "#0F172A", appearance: "none" }}
                      >
                        {complaints.length === 0 ? (
                          <option value="">No complaints raised yet</option>
                        ) : (
                          complaints.map(c => (
                            <option key={c._id} value={c._id}>
                              #{c._id.slice(-6).toUpperCase()} - {c.title}
                            </option>
                          ))
                        )}
                      </select>
                      {selectedComplaint && (
                        <span style={{ 
                          position: "absolute", 
                          right: "44px", 
                          top: "50%", 
                          transform: "translateY(-50%)", 
                          fontSize: "11px", 
                          fontWeight: "600", 
                          color: (complaints.find(c => c._id === selectedComplaint)?.status === "Resolved" || complaints.find(c => c._id === selectedComplaint)?.status === "Closed") ? "#10B981" : "#D97706", 
                          backgroundColor: (complaints.find(c => c._id === selectedComplaint)?.status === "Resolved" || complaints.find(c => c._id === selectedComplaint)?.status === "Closed") ? "#ECFDF5" : "#FEF3C7", 
                          padding: "2px 8px", 
                          borderRadius: "4px" 
                        }}>
                          {complaints.find(c => c._id === selectedComplaint)?.status}
                        </span>
                      )}
                      <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }}>▼</span>
                    </div>
                  </div>

                  {/* Rating Dashboard Area */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Overall Rating <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            style={{ 
                              fontSize: "28px", 
                              cursor: "pointer", 
                              color: star <= (hoverRating || rating) ? "#F59E0B" : "#E2E8F0",
                              transition: "color 0.1s"
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: currentLabel.color, backgroundColor: currentLabel.bg, padding: "4px 12px", borderRadius: "6px" }}>
                        {currentLabel.text}
                      </span>
                    </div>
                    <span style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>Thank you for your rating!</span>
                  </div>

                  {/* Feedback Message Input Textarea Block */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Feedback Message <span style={{ color: "#EF4444" }}>*</span></label>
                    <textarea 
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      maxLength={1000}
                      style={{ width: "100%", padding: "16px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", minHeight: "100px", resize: "vertical", outline: "none", fontFamily: "inherit", color: "#334155", boxSizing: "border-box" }}
                    />
                    <span style={{ fontSize: "11px", color: "#94A3B8", textAlign: "right" }}>{feedbackMessage.length}/1000</span>
                  </div>

                  {/* What Did We Do Well Custom Tag Component Array */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>What did we do well? <span style={{ color: "#94A3B8", fontWeight: "500" }}>(Optional)</span></label>
                    <span style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>Tell us what you liked about our service</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {["Quick Resolution", "Friendly Agent", "Good Communication", "Effective Fix"].map((chip) => {
                        const isSelected = whatWeDidWell.includes(chip);
                        return (
                          <button
                            type="button"
                            key={chip}
                            onClick={() => toggleWellChip(chip)}
                            style={{ padding: "8px 16px", borderRadius: "8px", border: isSelected ? "1px solid #10B981" : "1px solid #E2E8F0", backgroundColor: isSelected ? "#ECFDF5" : "#FFFFFF", color: isSelected ? "#059669" : "#475569", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            {isSelected && "✓"} {chip}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* What Can We Improve Custom Tag Component Array */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>What can we improve? <span style={{ color: "#94A3B8", fontWeight: "500" }}>(Optional)</span></label>
                    <span style={{ fontSize: "12px", color: "#64748B", marginBottom: "4px" }}>How can we serve you better?</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {["Response Time", "Better Communication", "Technical Expertise", "Follow-up"].map((chip) => {
                        const isSelected = whatToImprove.includes(chip);
                        return (
                          <button
                            type="button"
                            key={chip}
                            onClick={() => toggleImproveChip(chip)}
                            style={{ padding: "8px 16px", borderRadius: "8px", border: isSelected ? "1px solid #6366F1" : "1px solid #E2E8F0", backgroundColor: isSelected ? "#EEF2F6" : "#FFFFFF", color: isSelected ? "#4F46E5" : "#475569", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            {isSelected && "✓"} {chip}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Submittal Footer Button Actions Strip Layout Panel */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "24px", marginTop: "32px" }}>
                  <button 
                    type="button" 
                    onClick={handleCancelFeedback}
                    style={{ padding: "12px 24px", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#475569", backgroundColor: "#FFFFFF", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSubmitFeedback}
                    style={{ padding: "12px 28px", border: "none", borderRadius: "8px", color: "#FFFFFF", backgroundColor: "#2563EB", fontWeight: "600", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    🚀 Submit Feedback
                  </button>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE: INFO CARDS & HISTORY SIDEBAR PANELS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* INFORMATION WIDGET PANEL 1 */}
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <span style={{ color: "#6366F1", fontSize: "16px" }}>⚙️</span>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>How Your Feedback Helps</h4>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "16px", marginTop: "2px" }}>📈</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Improves Our Services</div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px", lineHeight: "1.4" }}>Your feedback helps us understand what we're doing well and what needs improvement.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "16px", marginTop: "2px" }}>👤</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Recognizes Our Team</div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px", lineHeight: "1.4" }}>Positive feedback motivates our team to maintain high service standards.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "16px", marginTop: "2px" }}>⏱️</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Faster Resolutions</div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px", lineHeight: "1.4" }}>Your suggestions help us reduce resolution time for future issues.</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "16px", marginTop: "2px" }}>❤️</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>Better Customer Experience</div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px", lineHeight: "1.4" }}>Together, we create a better experience for everyone.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FEEDBACK HISTORY LOG WORKSPACE PANEL 2 */}
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0 }}>Your Recent Feedback</h4>
                  <Link to="/feedback-history" style={{ fontSize: "12px", color: "#2563EB", fontWeight: "600", cursor: "pointer", textDecoration: "none" }}>View All</Link>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  {/* Item row 1 */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", borderBottom: "1px solid #F1F5F9", paddingBottom: "14px" }}>
                    <div style={{ backgroundColor: "#ECFDF5", color: "#10B981", borderRadius: "50%", padding: "6px", display: "flex", fontSize: "14px" }}>😊</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#F59E0B" }}>★★★★★</span>
                        <span style={{ fontSize: "10px", fontWeight: "700", backgroundColor: "#ECFDF5", color: "#10B981", padding: "2px 6px", borderRadius: "4px" }}>Excellent</span>
                      </div>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#1E293B", marginTop: "3px" }}>#CR-1008 - Billing Problem</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>May 25, 2025</div>
                    </div>
                  </div>

                  {/* Item row 2 */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", borderBottom: "1px solid #F1F5F9", paddingBottom: "14px" }}>
                    <div style={{ backgroundColor: "#FFFBEB", color: "#F59E0B", borderRadius: "50%", padding: "6px", display: "flex", fontSize: "14px" }}>😐</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#F59E0B" }}>★★★★☆</span>
                        <span style={{ fontSize: "10px", fontWeight: "700", backgroundColor: "#FFFBEB", color: "#D97706", padding: "2px 6px", borderRadius: "4px" }}>Good</span>
                      </div>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#1E293B", marginTop: "3px" }}>#CR-1005 - Service Down</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>May 20, 2025</div>
                    </div>
                  </div>

                  {/* Item row 3 */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ backgroundColor: "#ECFDF5", color: "#10B981", borderRadius: "50%", padding: "6px", display: "flex", fontSize: "14px" }}>😊</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#F59E0B" }}>★★★★★</span>
                        <span style={{ fontSize: "10px", fontWeight: "700", backgroundColor: "#ECFDF5", color: "#10B981", padding: "2px 6px", borderRadius: "4px" }}>Excellent</span>
                      </div>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#1E293B", marginTop: "3px" }}>#CR-1001 - Account Access</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>May 15, 2025</div>
                    </div>
                  </div>

                </div>

                {/* Footer anchor redirect button link item */}
                <Link to="/feedback-history" style={{ borderTop: "1px solid #F1F5F9", marginTop: "16px", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px", color: "#2563EB", fontWeight: "600", cursor: "pointer", textDecoration: "none" }}>
                  <span>View All Feedback History</span>
                  <span>➔</span>
                </Link>

              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}