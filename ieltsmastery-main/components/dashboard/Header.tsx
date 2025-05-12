// components/dashboard/Header.tsx
"use client";
import React from "react";
import styles from "./dashboard.module.css";

interface HeaderProps {
  userPlan: any;
  username: string; // Add this line
}

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