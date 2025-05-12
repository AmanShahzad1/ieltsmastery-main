// components/dashboard/HamburgerMenu.tsx
"use client";
import styles from "./dashboard.module.css";

interface HamburgerMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, setIsOpen }) => {
  return (
    <button 
      className={styles.hamburgerButton}
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? "✕" : "☰"}
    </button>
  );
};

export default HamburgerMenu;