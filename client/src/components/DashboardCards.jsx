import React from "react";
import {
  MdOutlineHourglassEmpty,
  MdCheckCircleOutline,
  MdAssignmentTurnedIn,
  MdAssignment,
  MdWarningAmber,
} from "react-icons/md";

export default function DashboardCards({complaints=[]}) {
  const email = localStorage.getItem("userEmail") || "";
  const isAgent = email.toLowerCase().includes("agent");

  const customerCards = [
    {
      title: "Total Complaints",
      count: complaints.length,
      bg: "#eff6ff",
      color: "#2563eb",
      icon: <MdAssignmentTurnedIn size={24} />,
    },
    {
      title: "Pending Resolution",
      count:
complaints.filter(
(c)=>c.status==="Pending"
).length,
      bg: "#fffbeb",
      color: "#d97706",
      icon: <MdOutlineHourglassEmpty size={24} />,
    },
    {
      title: "Resolved Cases",
      count:
complaints.filter(
(c)=>c.status==="Resolved"
).length,
      bg: "#ecfdf5",
      color: "#059669",
      icon: <MdCheckCircleOutline size={24} />,
    },
  ];

  const agentCards = [
    {
      title: "Assigned Complaints",
      count:
complaints.filter(
(c)=>c.status==="Assigned"
).length,
      bg: "#eff6ff",
      color: "#2563eb",
      icon: <MdAssignment size={24} />,
    },
    {
      title: "Pending Cases",
      count:
complaints.filter(
(c)=>c.status==="Pending"
).length,
      bg: "#fffbeb",
      color: "#d97706",
      icon: <MdOutlineHourglassEmpty size={24} />,
    },
    {
      title: "Resolved Today",
      count:
complaints.filter(
(c)=>c.status==="Resolved"
).length,
      bg: "#ecfdf5",
      color: "#059669",
      icon: <MdCheckCircleOutline size={24} />,
    },
    {
      title: "Escalated",
      count:
complaints.filter(
(c)=>c.priority==="High"
).length,
      bg: "#fef2f2",
      color: "#dc2626",
      icon: <MdWarningAmber size={24} />,
    },
  ];

  const cards = isAgent ? agentCards : customerCards;

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            minWidth: "240px",
            backgroundColor: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              {card.title}
            </p>

            <p
              style={{
                margin: "8px 0 0 0",
                fontSize: "30px",
                fontWeight: "800",
                color: "#1e293b",
              }}
            >
              {card.count}
            </p>
          </div>

          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: card.bg,
              color: card.color,
            }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}