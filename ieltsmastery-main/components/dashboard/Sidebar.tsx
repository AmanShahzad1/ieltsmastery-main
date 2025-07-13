"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

interface UserPlan {
  id: number;
  // Add other properties that userPlan might have
  [key: string]: unknown; // For any additional dynamic properties
}

interface SidebarProps {
  username: string;
  userPlan: UserPlan;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavigationItem {
  name: string;
  icon: string;
  isButton?: boolean;
  route?: string;
  action?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  username, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userPlan, 
  isOpen, 
  setIsOpen 
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/pages/profile");
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/pages/login");
    setIsOpen(false);
  };

  const handleNavigation = (route: string) => {
    router.push(route);
    setIsOpen(false);
  };

  const navItems: NavigationItem[] = [
    { name: "Dashboard", icon: "/icons/category.png", route: "/pages/dashboard" },
    { name: "Analytics", icon: "/icons/stats.png", route: "/pages/analytics" },
    
    {
      name: "Logout",
      icon: "/icons/logout.png",
      isButton: true,
      action: handleLogout
    },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <button 
        className={styles.mobileCloseButton}
        onClick={() => setIsOpen(false)}
        aria-label="Close menu"
      >
        &times;
      </button>

      <div className={styles.logoContainer}>
        <img src="/Logo.png" alt="IELTS Mastery Solutions Logo" className={styles.logo} />
      </div>


      <nav className={styles.navMenu}>
         <h2><b>Manage</b></h2>
        {navItems.map((item, index) => (
          <div key={index} className={styles.navItemWrapper}>
            {item.isButton ? (
              <button 
                className={`${styles.navItem} ${styles.navItemButton}`} 
                onClick={item.action}
              >
                <img src={item.icon} alt={`${item.name} Icon`} className={styles.navIcon} />
                {item.name}
              </button>
            ) : (
              <button 
                className={styles.navItem}
                onClick={() => item.route && handleNavigation(item.route)}
              >
                <img src={item.icon} alt={`${item.name} Icon`} className={styles.navIcon} />
                {item.name}
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className={styles.profile}>
        <img src="/profile.jpg" alt="My Profile" className={styles.profileImage} />
        <div className={styles.nameAndEmail}>
          <p 
            className={styles.profileName} 
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          >
            {username}
          </p>
          <p className={styles.profileEmail}>myprofile@gmail.com</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;