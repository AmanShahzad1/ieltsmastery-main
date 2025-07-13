"use client";
import React, { useState } from "react";
import styles from "./dashboard.module.css";
import ProtectedRoute from "../../app/pages/RouteProtected/RouteProtected";
import HamburgerMenu from "./HamburgerMenu";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

interface UserPlan {
  id: number;
  // Add other properties that userPlan might have
  [key: string]: unknown; // For any additional dynamic properties
}


interface DashboardLayoutProps {
  children: React.ReactNode;
  username: string;
  userPlan: UserPlan;
  loading: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  username,
  userPlan,
  loading,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.dashboardContainer}>
          <div className={styles.loading}>Loading dashboard...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.dashboardContainer}>
        <HamburgerMenu 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <Sidebar 
          username={username} 
          userPlan={userPlan}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        <MainContent username={username} userPlan={userPlan}>
          {children}
        </MainContent>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;