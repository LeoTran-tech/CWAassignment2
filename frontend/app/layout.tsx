// app/layout.tsx
'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from './Components/ThemeProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="d-flex flex-column min-vh-100">
            {/* Header */}
            <header className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h1 className="m-0 flex-grow-1 text-center">Generate code for your text</h1>
              <div className="student-number">21519278</div>
              <div style={{ width: '80px' }} />
            </header>

            {/* Main */}
            <main className="flex-grow-1">{children}</main>

            {/* Footer */}
            <footer className="text-center p-3 border-top mt-auto">
              © Leo Tran | Student No: 21519278 | 24-08-2025
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
