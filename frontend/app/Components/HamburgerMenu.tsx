// app/Components/HamburgerMenu.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './HamburgerMenu.module.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={styles.container}>
      {/* Hamburger Icon */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
      </div>

      {/* Dropdown Menu */}
      <nav className={isOpen ? styles.menuOpen : styles.menu}>
        <ul className="list-unstyled m-0 p-0">
          <li className="p-2 border-bottom">
            <Link href="/tabs" className="text-decoration-none text-dark">Tabs</Link>
          </li>
          <li className="p-2 border-bottom">
            <Link href="/pre-lab-questions" className="text-decoration-none text-dark">Pre-lab Questions</Link>
          </li>
          <li className="p-2 border-bottom">
            <Link href="/escape-room" className="text-decoration-none text-dark">Escape Room</Link>
          </li>
          <li className="p-2 border-bottom">
            <Link href="/coding-races" className="text-decoration-none text-dark">Coding Races</Link>
          </li>
          <li className="p-2">
            <Link href="/about" className="text-decoration-none text-dark">About</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
