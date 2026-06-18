import { ReactNode, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/skills', label: 'Skills Library' },
];

export default function Layout({ children, title }: LayoutProps) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  }

  // Close offcanvas on route change
  useEffect(() => {
    setNavOpen(false);
  }, [router.pathname]);

  // Prevent body scroll when offcanvas is open
  useEffect(() => {
    if (navOpen) {
      document.body.classList.add('offcanvas-open');
    } else {
      document.body.classList.remove('offcanvas-open');
    }
    return () => document.body.classList.remove('offcanvas-open');
  }, [navOpen]);

  const closeNav = useCallback(() => setNavOpen(false), []);

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

      {/* Offcanvas mobile navigation panel */}
      <div
        className={`navmenu navmenu-default navmenu-fixed-left offcanvas${navOpen ? ' open' : ''}`}
        aria-hidden={!navOpen}
      >
        {/* Search in offcanvas */}
        <ul className="nav navbar-nav navbar-right offcanvas-search">
          <li>
            <div className="search">
              <form
                action="https://act.ucsd.edu/cwp/tools/search-redir"
                method="get"
                id="cse-site-search"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="input-group">
                  <input
                    placeholder="Search..."
                    type="search"
                    className="form-control search-term"
                    name="search-term"
                    aria-label="Search"
                  />
                </div>
              </form>
            </div>
          </li>
        </ul>

        <ul className="nav navmenu-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className={isActive(item.href) ? 'active' : ''}>
              <Link href={item.href} onClick={closeNav}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Offcanvas overlay */}
      {navOpen && <div className="navmenu-overlay" onClick={closeNav} />}

      <nav className="navbar navbar-default navbar-static-top">
        <div className="layout-container">
          <div className="navbar-header">
            <button
              type="button"
              className={`navbar-toggle ${navOpen ? 'open' : 'collapsed'}`}
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              aria-controls="navbar"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <div className="visible-xs-inline-block mobile-nav-icon">
              <span className="mobile-nav-label">MENU</span>
            </div>
            <div className="visible-xs-block pull-right mobile-header-logo">
              <img
                src="https://cdn.ucsd.edu/developer/decorator/5.0.2/img/ucsd-footer-logo-white.png"
                alt="UC San Diego"
                className="img-responsive header-logo"
              />
            </div>
          </div>

          <div className="navbar-collapse collapse" id="navbar">
            <ul className="nav navbar-nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className={isActive(item.href) ? 'active' : ''}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li>
                <div className="search">
                  <button
                    className="search-toggle btn-default"
                    onClick={() => setSearchOpen(!searchOpen)}
                    aria-label="Toggle search"
                    aria-expanded={searchOpen}
                  >
                    <span className="search-icon" aria-hidden="true" />
                  </button>

                  <div
                    className={`search-content${searchOpen ? ' open' : ''}`}
                    id="desktop-search"
                  >
                    <form
                      action="https://act.ucsd.edu/cwp/tools/search-redir"
                      method="get"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <select className="search-scope" name="search-scope" aria-label="Search scope">
                        <option value="default_collection">All UCSD Sites</option>
                        <option value="faculty-staff">Faculty/Staff</option>
                      </select>
                      <div className="input-group">
                        <input
                          placeholder="Search..."
                          type="search"
                          className="form-control search-term"
                          name="search-term"
                          aria-label="Search"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </li>
            </ul>
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

      <footer className="footer">
        <div className="layout-container">
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'left' }}>
              <p style={{ margin: '0 0 10px', lineHeight: 1.5 }}>
                <span>UC San Diego 9500 Gilman Dr. La Jolla, CA 92093 (858) 534-2230</span>
                <br />
                <span>Copyright &copy; {new Date().getFullYear()} Regents of the University of California. All rights reserved.</span>
              </p>
              <ul className="footer-links">
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
