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
    const handleRouteChange = () => setNavOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

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
        <a className="sr-only" href="#main-content">Skip to main content</a>
        <div id="uc-emergency" />
        <section className="layout-title">
          <div className="layout-container container">
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
        className={`navmenu navmenu-default navmenu-fixed-left offcanvas${navOpen ? ' in' : ''}`}
        aria-hidden={!navOpen}
      >
        <ul className="nav navbar-nav navbar-right offcanvas-search">
          <li>
            <div className="search">
              <button className="search-toggle btn-default" type="button" aria-hidden="true">
                <span className="glyphicon glyphicon-search" aria-hidden="true" /> <span className="caret" aria-hidden="true" />
              </button>
              <div className="search-content search-is-open mobile-search-content">
                <form
                  action="https://act.ucsd.edu/cwp/tools/search-redir"
                  method="get"
                  id="mobile-cse-site-search"
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
      {navOpen && <div className="navmenu-backdrop" onClick={closeNav} />}

      <nav className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle"
              onClick={() => setNavOpen(!navOpen)}
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              aria-controls="navbar"
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="col-sm-1 mobile-nav-bars">
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </div>
              <div className="col-sm-1 mobile-nav-icon">
                MENU
              </div>
            </button>
            <div className="col-sm-4 pull-right visible-xs-block mobile-header-logo">
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
                    className={`search-toggle btn-default${searchOpen ? ' search-is-open' : ''}`}
                    type="button"
                    onClick={() => setSearchOpen(!searchOpen)}
                    aria-label="Toggle search"
                    aria-expanded={searchOpen}
                  >
                    <span className="glyphicon glyphicon-search" aria-hidden="true" />
                    <span className="caret" aria-hidden="true" />
                  </button>

                  <div
                    className={`search-content${searchOpen ? ' search-is-open' : ''}`}
                    id="search"
                  >
                    <form
                      action="https://act.ucsd.edu/cwp/tools/search-redir"
                      method="get"
                      id="desktop-cse-site-search"
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

      <main className="layout-main" id="main-content" role="main">
        <div className="container site-main-container">
          {title && (
            <h1 className="page-header">{title}</h1>
          )}
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <p>
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
            <div className="col-sm-4">
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
