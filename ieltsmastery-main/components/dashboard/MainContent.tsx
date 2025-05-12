"use client";
import React from "react";
import styles from "./dashboard.module.css";
import Header from "./Header";

interface MainContentProps {
  children: React.ReactNode;
  username: string;
  userPlan: any;
}

const MainContent: React.FC<MainContentProps> = ({ children, username, userPlan }) => {
  return (
    <main className={styles.mainContent}>
      <Header username={username} userPlan={userPlan} />
      {children}
    </main>
  );
};

export default MainContent;