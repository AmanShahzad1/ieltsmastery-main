"use client";
import React, { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api' ;


interface HistoricalData {
  week_start: string;
  avg_accuracy: number;
}

const OverviewCard: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode<{ userId: number }>(token);
          const response = await axios.get(
            `${BASE_URL}/performance/historical-performance/${decoded.userId}`
          );
          setHistoricalData(response.data);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format data for the chart
  const chartData = historicalData.map(item => ({
    date: new Date(item.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.avg_accuracy
  }));

  if (loading) return <div className={styles.card}>Loading...</div>;

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Overview</h2>
      <p className={styles.cardSubtitle}>Weekly Progress Summary</p>
      <div className={styles.barChartContainer}>
        <div className={styles.yAxis}>
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        <div className={styles.barChart}>
          {chartData.map((bar, index) => (
            <div key={index} className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{ height: `${bar.value}%` }}
              ></div>
              <p className={styles.barLabel}>{bar.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverviewCard;