"use client";
import { useAuth } from "@/hooks/auth";
import React from "react";

const Dashboard = () => {
  const user = useAuth();

  return (
    <div>
      {JSON.stringify(user)}
      Dashboard
    </div>
  );
};

export default Dashboard;
