import React from "react";
import AgentSidebar from "../components/AgentSidebar";
import Navbar from "../components/Navbar";

export default function AgentLayout({
  children,
  title,
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <AgentSidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "256px",
        }}
      >
        <Navbar title={title} />

        <main
          style={{
            padding: "30px",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}