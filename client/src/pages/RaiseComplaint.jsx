import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function RaiseComplaint() {
  const [priority, setPriority] = useState("Medium");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // Connected category choice to a state tracking option matching your UI
  const [category, setCategory] = useState("Select a category");
  const [contactMethod, setContactMethod] = useState("Email");
  
  // --- FILE UPLOAD STATE & REFERENCE ---
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "Screenshot_2025-05-29.png", size: "2.4 MB" },
    { name: "Invoice_May2025.pdf", size: "1.2 MB" }
  ]);
  const fileInputRef = useRef(null);

  // --- COMPLAINT SUBMISSION HANDLER ---
  const handleSubmitComplaint = async () => {
    if (!title.trim()) {
      alert("Please enter an Issue Title.");
      return;
    }
    if (category === "Select a category") {
      alert("Please select a valid Category.");
      return;
    }
    if (!description.trim()) {
      alert("Please provide a Detailed Description.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Complaint raised successfully!");
        setTitle("");
        setCategory("Select a category");
        setPriority("Medium");
        setContactMethod("Email");
        setDescription("");
        setUploadedFiles([]);
      } else {
        alert(data.message || "Failed to submit complaint.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  };

  // --- CANCEL COMPLAINT HANDLER ---
  const handleCancelComplaint = () => {
    if (window.confirm("Are you sure you want to clear this complaint form?")) {
      setTitle("");
      setCategory("Select a category");
      setPriority("Medium");
      setContactMethod("Email");
      setDescription("");
      setUploadedFiles([]);
    }
  };

  // Trigger local machine file system window
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Process selected file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  // Remove file from attachment state panel
  const handleRemoveFile = (indexToRemove) => {
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB"
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Sidebar />

      <div style={{ flex: 1, marginLeft: "256px", width: "calc(100% - 256px)", display: "flex", flexDirection: "column" }}>
        <Navbar title="Raise Complaint" />

        <main style={{ padding: "32px", maxWidth: "1250px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Raise a New Complaint</h1>
            <div style={{ fontSize: "13px", fontWeight: "500", color: "#94a3b8", marginTop: "6px" }}>
              <span style={{ color: "#2563eb", cursor: "pointer" }}>Dashboard</span> &gt; <span style={{ color: "#64748b" }}>Raise Complaint</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* COMPLAINT DETAILS COMPONENT */}
              <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
                  <div style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "8px", borderRadius: "8px", display: "flex" }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Complaint Details</h3>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Issue Title <span style={{ color: "#ef4444" }}>*</span></label>
                    <input type="text" maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a short title for your issue" style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} />
                    <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "right" }}>{title.length}/100</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Category <span style={{ color: "#ef4444" }}>*</span></label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#ffffff" }}>
                      <option>Select a category</option>
                      <option>Billing Error</option>
                      <option>Account Access Failure</option>
                      <option>Service Interruption</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Priority <span style={{ color: "#ef4444" }}>*</span></label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button type="button" onClick={() => setPriority("High")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: priority === "High" ? "2px solid #ef4444" : "1px solid #e2e8f0", backgroundColor: priority === "High" ? "#fef2f2" : "#ffffff", color: "#dc2626", fontWeight: "600", cursor: "pointer" }}>↑ High</button>
                      <button type="button" onClick={() => setPriority("Medium")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: priority === "Medium" ? "2px solid #f59e0b" : "1px solid #e2e8f0", backgroundColor: priority === "Medium" ? "#fffbeb" : "#ffffff", color: "#d97706", fontWeight: "600", cursor: "pointer" }}>– Medium</button>
                      <button type="button" onClick={() => setPriority("Low")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: priority === "Low" ? "2px solid #10b981" : "1px solid #e2e8f0", backgroundColor: priority === "Low" ? "#ecfdf5" : "#ffffff", color: "#059669", fontWeight: "600", cursor: "pointer" }}>↓ Low</button>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Preferred Contact Method</label>
                    <select value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} style={{ padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#ffffff" }}>
                      <option>Email</option>
                      <option>Phone call</option>
                      <option>In-app Message</option>
                    </select>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", gridColumn: "1 / span 2", marginTop: "8px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Detailed Description <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please provide as much detail as possible about your issue..." style={{ padding: "16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", minHeight: "120px", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
                    <span style={{ fontSize: "11px", color: "#94a3b8", textAlign: "right" }}>{description.length}/1000</span>
                  </div>
                </div>
              </div>

              {/* CARD BLOCK 2: ATTACHMENTS SYSTEM (Now fully interactive) */}
              <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                  <div style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "6px", borderRadius: "6px", display: "flex" }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", margin: 0 }}>Attachments <span style={{ color: "#94a3b8", fontWeight: "500", fontSize: "13px" }}>(Optional)</span></h3>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px 42px" }}>Upload screenshots or documents related to your issue</p>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
                  
                  {/* Dotted Drag & Drop Area (With Drag Handlers & Click Ref) */}
                  <div 
                    onClick={handleBrowseClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{ border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "32px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: "#f8fafc" }}
                  >
                    {/* Hidden system native input element */}
                    <input 
                      type="file" 
                      multiple
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      style={{ display: "none" }} 
                    />
                    <svg width="32" height="32" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" style={{ marginBottom: "12px" }}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600", textAlign: "center" }}>
                      Drag and drop files here or <span style={{ color: "#2563eb", textDecoration: "underline" }}>click to browse</span>
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>PNG, JPG, PDF up to 10MB</span>
                  </div>

                  {/* Dynamic Render Pipeline File List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>Uploaded Files</span>
                    
                    {uploadedFiles.length === 0 ? (
                      <div style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic", padding: "12px", textAlign: "center", border: "1px dashed #e2e8f0", borderRadius: "8px" }}>No attachments added yet.</div>
                    ) : (
                      uploadedFiles.map((file, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", border: "1px solid #e2e8f0", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#ffffff" }}>
                          <div style={{ color: file.name.endsWith(".pdf") ? "#ef4444" : "#2563eb" }}>
                            {file.name.endsWith(".pdf") ? "📄" : "💾"}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "12.5px", fontWeight: "600", color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{file.size}</div>
                          </div>
                          <span style={{ color: "#10b981", fontSize: "14px" }}>✓</span>
                          <button type="button" onClick={() => handleRemoveFile(idx)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "14px" }}>🗑️</button>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              </div>

              {/* ACTION FOOTER BUTTONS */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", marginBottom: "40px" }}>
                <button type="button" onClick={handleCancelComplaint} style={{ padding: "12px 24px", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#475569", backgroundColor: "#ffffff", fontWeight: "600", cursor: "pointer" }}>Cancel</button>
                <button type="button" onClick={handleSubmitComplaint} style={{ padding: "12px 28px", border: "none", borderRadius: "8px", color: "#ffffff", backgroundColor: "#2563eb", fontWeight: "600", cursor: "pointer" }}>🚀 Submit Complaint</button>
              </div>

            </div>

            {/* SIDE PANEL STATS INFO BOXES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 20px 0" }}>Tips for a quick resolution</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span>💡</span><p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>Provide a clear and concise description of the issue.</p></div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span>🖼️</span><p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>Attach screenshots or documents if applicable.</p></div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span>🏷️</span><p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>Choose the correct category for faster routing.</p></div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}><span>⏱️</span><p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>Our team typically responds within 24 hours.</p></div>
                </div>
              </div>

              <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "24px", border: "1px solid #dbeafe" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1e3a8a", margin: "0 0 20px 0" }}>What happens next?</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "12.5px", color: "#1e40af", fontWeight: "500" }}>
                  <div>1️⃣ We will review your complaint</div>
                  <div>2️⃣ Our team will assign it to the right expert</div>
                  <div>3️⃣ You will receive updates via email/SMS</div>
                  <div>4️⃣ We will work to resolve your issue</div>
                  <div>5️⃣ You can provide feedback after resolution</div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}