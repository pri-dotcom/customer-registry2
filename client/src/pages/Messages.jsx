import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Accept userEmail as a prop from your router setup
export default function Messages({ userEmail }) {
  // Grab the active email session from props or fallback to storage
  const activeEmail = userEmail || localStorage.getItem("userEmail") || "";
  const isAgent = activeEmail.trim().toLowerCase() === "agent@company.com";

  const [messages, setMessages] = useState([
    { sender: "agent", text: "Hello Priyanka, I am reviewing your duplicate transaction complaint right now.", time: "4:15 PM" },
    { sender: "user", text: "Thanks! Will the balance reflect back onto the original card directly?", time: "4:17 PM" },
    { sender: "agent", text: "Yes, once approved, standard processing timelines apply.", time: "4:20 PM" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Dynamically tag sender type based on who logged in
    const currentSender = isAgent ? "agent" : "user";

    setMessages([...messages, { sender: currentSender, text: input, time: "Just Now" }]);
    setInput("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F6F8FC" }}>
      
      {/* Passing the userEmail ensures the sidebar dynamically retains its adaptive context links! */}
      <Sidebar userEmail={activeEmail} />
      
      <div style={{ flex: 1, paddingLeft: "256px", width: "100%" }}>
        <Navbar title={isAgent ? "Messages Desk Queue" : "Live Agent Support Chat"} />
        
        <main style={{ paddingTop: "96px", padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", height: "calc(100vh - 160px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            
            {/* Banner */}
            <div style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }} />
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                {isAgent ? `Responding as System Operator (${activeEmail})` : "Dedicated Case Manager"}
              </p>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {messages.map((msg, i) => {
                // If an Agent logs in, align agent replies to the right side!
                const isRightSide = isAgent ? msg.sender === "agent" : msg.sender === "user";
                
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isRightSide ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "450px",
                      padding: "12px 16px",
                      borderRadius: "16px",
                      borderTopRightRadius: isRightSide ? "0px" : "16px",
                      borderTopLeftRadius: isRightSide ? "16px" : "0px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      backgroundColor: isRightSide ? "#2563eb" : "#f1f5f9",
                      color: isRightSide ? "#ffffff" : "#1e293b"
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: "10px", color: "#94a3b8", marginTop: "4px", padding: "0 4px" }}>{msg.time}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={sendMessage} style={{ padding: "16px", borderTop: "1px solid #f1f5f9", display: "flex", gap: "12px", backgroundColor: "#ffffff" }}>
              <input
                type="text"
                placeholder={isAgent ? "Type assignment follow up instructions..." : "Type your response message details here..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, padding: "12px", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", fontSize: "14px" }}
              />
              <button type="submit" style={{ backgroundColor: "#2563eb", color: "#ffffff", padding: "0 24px", borderRadius: "12px", border: "none", fontWeight: "600", cursor: "pointer" }}>
                Send
              </button>
            </form>

          </div>
        </main>
      </div>
    </div>
  );
}