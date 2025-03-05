"use client"; // Ensure this is a client component

import React from "react";
import { useRouter } from "next/navigation"; // Use the App Router's navigation
import styles from "./dashboard.module.css";
import ProtectedRoute from "../RouteProtected/RouteProtected";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/pages/profile");
  };

 const handleLogout=()=>{
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  router.push("/pages/login")
 }


 const [username, setUsername] = useState("");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<{ username: string }>(token);
          setUsername(decoded.username || "user");
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []); 
 



  const barData = [
    { date: "14, Jan", value: 44 },
    { date: "21, Jan", value: 50 },
    { date: "28, Jan", value: 62 },
    { date: "4, Feb", value: 68 },
    { date: "11, Feb", value: 65 },
    { date: "18, Feb", value: 79 },
    { date: "25, Feb", value: 85 },
    { date: "2, May", value: 90 },
  ];

  const testCategories = [
    { name: "Listening", route: "/tests/listening" },
    { name: "Reading", route: "/tests/reading" },
    { name: "Writing", route: "/tests/writing" },
    { name: "Speaking", route: "/tests/speaking" },
  ];

  const handleNavigation = (route: string) => {
    router.push(route); // Navigate to the desired route
  };

  return (
    <>
    <ProtectedRoute>
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <img
            src="/Logo.png"
            alt="IELTS Mastery Solutions Logo"
            className={styles.logo}
          />
        </div>
        <nav className={styles.navMenuHeading}>
          <h2>
            <b>Manage</b>
          </h2>
        </nav>

        <nav className={styles.navMenu}>
  {[
    { name: "Dashboard", icon: "/icons/category.png" },
    { name: "Analytics", icon: "/icons/stats.png" },
    { name: "Notifications", icon: "/icons/bell.png" },
    { name: "Study Material", icon: "/icons/books.png" },
    { name: "Subscriptions", icon: "/icons/refund-alt.png" },
    {
      name: "Logout",
      icon: "/icons/logout.png",
      action: handleLogout,
      isButton: true, // Add flag to identify it as a button
    },
  ].map((item, index) => (
    <div key={index} className={styles.navItemWrapper}>
      {item.isButton ? (
        <button
          className={`${styles.navItem} ${styles.navItemButton}`}  // Ensure it's consistent
          onClick={item.action} // Call the action when clicked
        >
          <img
            src={item.icon}
            alt={`${item.name} Icon`}
            className={styles.navIcon}
          />
          {item.name}
        </button>
      ) : (
        <a href="#" className={styles.navItem}>
          <img
            src={item.icon}
            alt={`${item.name} Icon`}
            className={styles.navIcon}
          />
          {item.name}
        </a>
      )}
    </div>
  ))}
</nav>



        <div className={styles.profile}>
          <img
            src="/profile.jpg"
            alt="My Profile"
            className={styles.profileImage}
          />
          <div className={styles.nameAndEmail}>
            <p className={styles.profileName} onClick={handleClick}  style={{ cursor: 'pointer' }}>{username}</p>
            <p className={styles.profileEmail}>myprofile@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Dashboard</h1>
        </header>

        <div className={styles.contentLayout}>
          {/* Left Content */}
          <div className={styles.leftContent}>
            {/* Today's Tests */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Today's Tests</h2>
              <p className={styles.cardSubtitle}>(11/11/2024)</p>
              <div className={styles.testCategories}>
                {testCategories.map((test, index) => (
                  <button
                    key={index}
                    className={styles.testButton}
                    onClick={() => handleNavigation(test.route)}
                  >
                    <img
                      src={`/icons/${test.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}.png`}
                      alt={`${test.name} icon`}
                      className={styles.icon}
                    />
                    {test.name}
                  </button>
                ))}
              </div>
              <button className={styles.viewPastTests}>View Past Tests</button>
            </section>

            {/* Overview Section */}
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
                  {barData && barData.length > 0 ? (
                    barData.map((bar, index) => (
                      <div key={index} className={styles.barWrapper}>
                        <div
                          className={styles.bar}
                          style={{
                            height: `${(bar.value / 100) * 100}%`, // Calculate height dynamically
                          }}
                        ></div>
                        <p className={styles.barLabel}>{bar.date}</p>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noData}>No data available</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Activity Section (Right-Aligned) */}
          <div className={styles.activitySection}>
            {/* Activity Section */}
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Activity</h2>
              <div className={styles.activityCircles}>
                <div className={`${styles.circle} ${styles.largeCircle}`}>
                  <span className={styles.circleText}>
                    1.25 <br /> hrs/day
                  </span>
                </div>
                <div className={`${styles.circle} ${styles.mediumCircle}`}>
                  <span className={styles.circleText}>
                    79%
                    <br />
                    Accuracy
                  </span>
                </div>
                <div className={`${styles.circle} ${styles.smallCircle}`}>
                  <span className={styles.circleText}>
                    14
                    <br />
                    Tests Taken
                  </span>
                </div>
              </div>
              <div className={styles.comparisonSection}>
                <h3 className={styles.comparisonTitle}>
                  Comparison <br />
                  (Performance)
                </h3>
                <div className={styles.comparisonRow}>
                  <span>Last Week</span>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.lastWeek}`}
                    ></div>
                  </div>
                </div>
                <div className={styles.comparisonRow}>
                  <span>This Week</span>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.thisWeek}`}
                    ></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
    </>
    
  );
};

export default Dashboard;
