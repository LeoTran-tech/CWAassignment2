// app/Components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HamburgerMenu from './HamburgerMenu';
import ThemeButton from './ThemeButton';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const { theme } = useTheme();
  const pathname = usePathname(); // current route

  const linkColorClass =
    theme === 'light'
      ? 'text-dark'
      : theme === 'dark'
        ? 'text-light'
        : 'text-secondary';

  return (
    <nav className="navbar navbar-light bg-light border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <ul className="navbar-nav d-flex flex-row">
          {[
            { href: '/', label: 'Tabs' },
            { href: '/pre-lab-questions', label: 'Pre-lab Questions' },
            { href: '/escape-room', label: 'Escape Room' },
            { href: '/coding-races', label: 'Coding Races' },
            { href: '/about', label: 'About' },
          ].map((link) => (
            <li className="nav-item me-3" key={link.href}>
              <Link
                href={link.href}
                className={`nav-link ${linkColorClass} ${pathname === link.href ? 'active fw-bold' : ''
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Hamburger menu and Theme button */}
        <div className="d-flex">
          <div className="me-2">
            <ThemeButton />
          </div>
          <HamburgerMenu />
        </div>
      </div>
    </nav>
  );
}