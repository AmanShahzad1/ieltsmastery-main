"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getUserPlan } from "../../../api/plans";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import TodayTestsCard from "../../../components/dashboard/TodayTestsCard";
import OverviewCard from "../../../components/dashboard/OverviewCard";
import ActivityCard from "../../../components/dashboard/ActivityCard";
import styles from "./dashboard.module.css";

const Dashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const [username, setUsername] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userId, setUserId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userPlan, setUserPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode<{ username: string; userId: number }>(token);
            setUsername(decoded.username || "user");
            setUserId(decoded.userId);
            
            const planData = await getUserPlan(decoded.userId);
            setUserPlan(planData.plan);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const getTestCategories = () => {
    if (!userPlan?.completion_status) return [];
    
    const { completion_status } = userPlan;
    
    return [
      { 
        name: "Listening", 
        route: `/tests/listening/${completion_status.listening?.pending?.[0] || 1}`,
        available: completion_status.listening?.pending?.length > 0
      },
      { 
        name: "Reading", 
        route: `/tests/reading/${completion_status.reading?.pending?.[0] || 1}`,
        available: completion_status.reading?.pending?.length > 0
      },
      { 
        name: "Writing", 
        route: `/tests/writing/${completion_status.writing?.pending?.[0] || 1}`,
        available: completion_status.writing?.pending?.length > 0
      },
      { 
        name: "Speaking", 
        route: `/tests/speaking/${completion_status.speaking?.pending?.[0] || 1}`,
        available: completion_status.speaking?.pending?.length > 0
      },
    ].filter(test => test.available);
  };

  return (
  <DashboardLayout username={username} userPlan={userPlan} loading={loading}>
    <div className={styles.contentWrapper}>
      <div className={styles.leftContent}>
        <TodayTestsCard testCategories={getTestCategories()} />
        <OverviewCard />
      </div>
      <div className={styles.activitySection}>
        <ActivityCard />
      </div>
    </div>
  </DashboardLayout>
);
};

export default Dashboard;