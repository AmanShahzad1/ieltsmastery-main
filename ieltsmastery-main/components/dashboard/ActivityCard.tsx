"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface PerformanceData {
  test_type: string;
  tests_taken: number;
  avg_band_score: number | null;
  avg_accuracy: number | null;
  last_test_date: string;
}

const ActivityCard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode<{ userId: number }>(token);
          const response = await axios.get(
            `http://localhost:5000/api/performance/user-performance/${decoded.userId}`
          );
          console.log("API Response:", response.data); // Debug log
          setPerformanceData(response.data);
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (value: unknown): string => {
    // Handle all possible cases
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(1);
  };

  // New calculation approach
  const calculateMetrics = () => {
  // Initialize counters
  let totalTests = 0;
  const bandScores: number[] = [];
  const accuracies: number[] = [];

  performanceData.forEach(item => {
    // Ensure tests_taken is treated as a proper number
    totalTests += Number(item.tests_taken) || 0; // This line changed
    
    // Rest of the calculations remain the same
    if (item.avg_band_score !== null && !isNaN(Number(item.avg_band_score))) {
      bandScores.push(Number(item.avg_band_score));
    }

    if (item.avg_accuracy !== null && !isNaN(Number(item.avg_accuracy))) {
      accuracies.push(Number(item.avg_accuracy));
    } else if (item.avg_band_score !== null && !isNaN(Number(item.avg_band_score))) {
      accuracies.push((Number(item.avg_band_score) / 9) * 100);
    }
  });

  // Rest of the function remains unchanged
  const avgBandScore = bandScores.length > 0 
    ? bandScores.reduce((a, b) => a + b, 0) / bandScores.length
    : null;

  const overallAccuracy = accuracies.length > 0
    ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length
    : null;

  return {
    totalTests,
    avgBandScore,
    overallAccuracy
  };
};
  const { totalTests, avgBandScore, overallAccuracy } = calculateMetrics();

  if (loading) return <div className={styles.card}>Loading...</div>;

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Activity</h2>
      <div className={styles.activityCircles}>
        <div className={`${styles.circle} ${styles.largeCircle}`}>
          <span className={styles.circleText}>
            {formatNumber(avgBandScore)} <br /> Avg. Band
          </span>
        </div>
        <div className={`${styles.circle} ${styles.mediumCircle}`}>
          <span className={styles.circleText}>
            {formatNumber(overallAccuracy)}%
            <br />
            Accuracy
          </span>
        </div>
        <div className={`${styles.circle} ${styles.smallCircle}`}>
          <span className={styles.circleText}>
            {totalTests}
            <br />
            Tests Taken
          </span>
        </div>
      </div>
      <div className={styles.comparisonSection}>
        <h3 className={styles.comparisonTitle}>
          Test Types <br />
          (Performance)
        </h3>
        {performanceData.map((item) => {
          const displayAccuracy = item.avg_accuracy !== null 
            ? item.avg_accuracy 
            : item.avg_band_score !== null 
              ? (Number(item.avg_band_score) / 9) * 100 
              : null;

          return (
            <div key={item.test_type} className={styles.comparisonRow}>
              <span>{item.test_type.charAt(0).toUpperCase() + item.test_type.slice(1)}</span>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${styles.thisWeek}`}
                  style={{ width: `${displayAccuracy || 0}%` }}
                ></div>
              </div>
              <span>{formatNumber(item.avg_band_score)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActivityCard;