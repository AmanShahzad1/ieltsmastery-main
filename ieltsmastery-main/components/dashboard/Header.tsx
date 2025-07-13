// components/dashboard/Header.tsx
"use client";
import React from "react";
import styles from "./dashboard.module.css";

interface UserPlan {
  id: number;
  level?:string;
  // Add other properties that userPlan might have
  [key: string]: unknown; // For any additional dynamic properties
}

interface HeaderProps {
  userPlan: UserPlan;
  username: string; // Add this line
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Header: React.FC<HeaderProps> = ({ userPlan, username }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Dashboard</h1>
      {userPlan && (
        <p className={styles.planIndicator}>
          Current Plan: <span className={styles.planLevel}>{userPlan.level}</span>
          {/* You can now use username here if needed */}
        </p>
      )}
    </header>
  );
};

export default Header;