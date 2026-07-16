import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import Feedback from "./pages/Feedback";
import RaiseComplaint from "./pages/RaiseComplaint";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import FeedbackHistory from "./pages/FeedbackHistory";

// Agent Pages
import AgentDashboard from "./pages/agent/AgentDashboard";
import AssignedComplaints from "./pages/agent/AssignedComplaints";
import ComplaintDetails from "./pages/agent/ComplaintDetails";
import Feedbacks from "./pages/agent/Feedbacks";
import Reports from "./pages/agent/Reports";
import AgentProfile from "./pages/agent/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/Customers";
import AdminComplaints from "./pages/admin/Complaints";
import AdminFeedbacks from "./pages/admin/Feedbacks";
import AdminReports from "./pages/admin/Reports";

export default function App() {
  const [userEmail] = useState(localStorage.getItem("userEmail") || "");

  const [userName, setUserName] = useState(
    JSON.parse(localStorage.getItem("user"))?.name || ""
  );

  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              userEmail={userEmail}
              userName={userName}
            />
          }
        />

        <Route
          path="/complaints"
          element={
            <Complaints
              userEmail={userEmail}
              userName={userName}
            />
          }
        />

        <Route
          path="/raise-complaint"
          element={
            <RaiseComplaint
              userEmail={userEmail}
              userName={userName}
            />
          }
        />

        <Route
          path="/feedback"
          element={
            <Feedback
              userEmail={userEmail}
              userName={userName}
            />
          }
        />

        <Route
          path="/feedback-history"
          element={
            <FeedbackHistory
              userEmail={userEmail}
              userName={userName}
            />
          }
        />

        <Route
          path="/messages"
          element={
            <Messages
              userEmail={userEmail}
              userName={userName}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <Profile
              userEmail={userEmail}
              userName={userName}
              setUserName={setUserName}
            />
          }
        />

        {/* Agent */}
        <Route
          path="/agent/dashboard"
          element={<AgentDashboard />}
        />

        <Route
          path="/agent/assigned"
          element={<AssignedComplaints />}
        />

        <Route
          path="/agent/all-complaints"
          element={<ComplaintDetails />}
        />

        <Route
          path="/agent/feedback"
          element={<Feedbacks />}
        />

        <Route
          path="/agent/reports"
          element={<Reports />}
        />

        <Route
          path="/agent/profile"
          element={<AgentProfile />}
        />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/feedback" element={<AdminFeedbacks />} />
        <Route path="/admin/reports" element={<AdminReports />} />

      </Routes>
    </Router>
  );
}