"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

interface TodayTestsCardProps {
  testCategories: Array<{
    name: string;
    route: string;
    available: boolean;
  }>;
}

const TodayTestsCard: React.FC<TodayTestsCardProps> = ({ testCategories }) => {
  const router = useRouter();

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Today&apos;s Tests</h2>
      <p className={styles.cardSubtitle}>({new Date().toLocaleDateString()})</p>
      <div className={styles.testCategories}>
        {testCategories.map((test, index) => (
          <button
            key={index}
            className={styles.testButton}
            onClick={() => router.push(test.route)}
          >
            <img
              src={`/icons/${test.name.toLowerCase()}.png`}
              alt={`${test.name} icon`}
              className={styles.icon}
            />
            {test.name}
          </button>
        ))}
        {testCategories.length === 0 && (
          <p className={styles.noTests}>No tests available today</p>
        )}
      </div>
      <button 
        className={styles.viewPastTests}
        onClick={() => router.push('/pages/past-tests')}
      >
        View Past Tests
      </button>
    </section>
  );
};

export default TodayTestsCard;