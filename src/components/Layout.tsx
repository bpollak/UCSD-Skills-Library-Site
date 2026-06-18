import { ReactNode, useState } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/skills', label: 'Skills Library' },
];

export default function Layout({ children, title }: LayoutProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <header className="layout-header">
        <section className="layout-title">
          <div className="layout-container" style={{ overflow: 'hidden' }}>
            <Link href="/" className="title-header title-header-large">
              TritonAI Skills Library
            </Link>
            <Link href="/" className="title-header title-header-short">
              Skills
            </Link>
            <a
              className="title-logo"
              href="https://ucsd.edu"
              target="_blank"
              rel="noopener noreferrer"
            >
              UC San Diego
            </a>
          </div>
        </section>
      </header>

      <nav className="ucsd-navbar">
        <div className="layout-container">
          <button
            className="navbar-toggle"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle navigation"
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </button>
          <div className={`nav-collapse ${navOpen ? 'open' : ''}`}>
            {NAV_ITEMS.map((item) => {
              const isActive =
                typeof window !== 'undefined' &&
                item.href !== '/'
                  ? window.location.pathname.startsWith(item.href)
                  : typeof window !== 'undefined' &&
                    window.location.pathname === '/UCSD-Skills-Library-Site/';
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="layout-main" id="main-content">
        <div className="layout-container" style={{ padding: '32px 0 48px' }}>
          {title && (
            <h1 className="ucsd-h1">{title}</h1>
          )}
          {children}
        </div>
      </main>

      <footer className="ucsd-footer">
        <div className="layout-container">
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'left' }}>
              <p style={{ margin: '0 0 10px', lineHeight: 1.5 }}>
                <span>UC San Diego 9500 Gilman Dr. La Jolla, CA 92093 (858) 534-2230</span>
                <br />
                <span>Copyright &copy; {new Date().getFullYear()} Regents of the University of California. All rights reserved.</span>
              </p>
              <ul className="ucsd-footer-links">
                <li>
                  <a href="https://www.ucsd.edu/_about/legal/index.html" target="_blank" rel="noopener noreferrer">
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a href="https://accessibility.ucsd.edu/" target="_blank" rel="noopener noreferrer">
                    Accessibility
                  </a>
                </li>
                <li>
                  <a href="https://ucsd.edu/about/privacy.html" target="_blank" rel="noopener noreferrer">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="mailto:tritonai@ucsd.edu">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
            <div style={{ float: 'right' }}>
              <a href="https://ucsd.edu" target="_blank" rel="noopener noreferrer">
                <img
                  className="footer-logo"
                  src="https://cdn.ucsd.edu/developer/decorator/5.0.2/img/ucsd-footer-logo-white.png"
                  alt="UC San Diego homepage"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
