import { ReactNode, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

interface NavItem {
  href: string;
  label: string;
  local?: boolean;
  children?: NavItem[];
}

const TRITONAI_URL = 'https://tritonai.ucsd.edu';
const UCSD_WHITE_LOGO = 'https://cdn.ucsd.edu/cms/decorator-5/styles/img/ucsd-footer-logo-white.png';
const UCSD_FOOTER_LOGO = 'https://cdn.ucsd.edu/developer/decorator/5.0.2/img/ucsd-footer-logo-white.png';

const NAV_ITEMS: NavItem[] = [
  {
    href: `${TRITONAI_URL}/about/index.html`,
    label: 'About',
    children: [
      { href: `${TRITONAI_URL}/about/roadmap.html`, label: 'Roadmap' },
      { href: `${TRITONAI_URL}/about/sustainability.html`, label: 'Sustainable AI' },
      { href: `${TRITONAI_URL}/about/workgroup.html`, label: 'AI Development Workgroup' },
      { href: `${TRITONAI_URL}/about/get-involved.html`, label: 'Get Involved' },
      { href: `${TRITONAI_URL}/about/ai-updates.html`, label: 'AI Updates' },
    ],
  },
  {
    href: `${TRITONAI_URL}/tritongpt/index.html`,
    label: 'TritonGPT',
    children: [
      { href: `${TRITONAI_URL}/training-resources/tritongpt/index.html`, label: 'Guides' },
      { href: `${TRITONAI_URL}/tritongpt/instruction.html`, label: 'Instructional AI Pilot' },
      { href: `${TRITONAI_URL}/tritongpt/chatbot-widget.html`, label: 'Chatbot Widget' },
      { href: `${TRITONAI_URL}/tritongpt/release-notes/index.html`, label: 'Release Notes' },
      { href: `${TRITONAI_URL}/tritongpt/terms.html`, label: 'Terms of Use' },
      { href: `${TRITONAI_URL}/tritongpt/privacy.html`, label: 'Privacy Statement' },
    ],
  },
  {
    href: `${TRITONAI_URL}/training-resources/index.html`,
    label: 'Training & Resources',
    children: [
      { href: `${TRITONAI_URL}/training-resources/tritongpt/index.html`, label: 'TritonGPT Guides' },
      { href: `${TRITONAI_URL}/training-resources/prompting/index.html`, label: 'Prompting' },
      { href: `${TRITONAI_URL}/training-resources/webinars.html`, label: 'AI Webinars' },
      { href: `${TRITONAI_URL}/training-resources/faculty-ai-symposium.html`, label: 'Faculty AI Symposium' },
      { href: `${TRITONAI_URL}/training-resources/faq.html`, label: 'FAQ' },
    ],
  },
  {
    href: `${TRITONAI_URL}/developer-apis/index.html`,
    label: 'Developer APIs',
    children: [
      { href: `${TRITONAI_URL}/developer-apis/start.html`, label: 'Get Started' },
      { href: `${TRITONAI_URL}/developer-apis/faq.html`, label: 'FAQs' },
    ],
  },
  { href: `${TRITONAI_URL}/tools/index.html`, label: 'AI Tools' },
  { href: '/', label: 'Skills Library', local: true },
];

function isLocalSkillPath(pathname: string): boolean {
  return pathname === '/' || pathname === '/skills' || pathname.startsWith('/skills/');
}

function NavLink({
  item,
  className,
  onClick,
  extra,
}: {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  extra?: ReactNode;
}) {
  if (item.local) {
    return (
      <Link href={item.href} className={className} onClick={onClick}>
        {item.label}
        {extra ? ' ' : null}
        {extra}
      </Link>
    );
  }

  return (
    <a href={item.href} className={className}>
      {item.label}
      {extra ? ' ' : null}
      {extra}
    </a>
  );
}

function MobileNavItem({ item, onLocalClick }: { item: NavItem; onLocalClick: () => void }) {
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className={hasChildren ? 'dropdown open' : ''}>
      <NavLink
        item={item}
        onClick={item.local ? onLocalClick : undefined}
        extra={hasChildren ? <span className="caret" aria-hidden="true" /> : null}
      />
      {hasChildren && (
        <ul className="dropdown-menu navmenu-nav">
          {item.children?.map((child) => (
            <li key={child.href}>
              <NavLink item={child} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function DesktopNavItem({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const hasChildren = Boolean(item.children?.length);

  return (
    <li className={`${hasChildren ? 'dropdown' : ''}${active ? ' active' : ''}`}>
      <NavLink
        item={item}
        className={hasChildren ? 'dropdown-toggle' : undefined}
        extra={hasChildren ? <span className="caret" aria-hidden="true" /> : null}
      />
      {hasChildren && (
        <ul className="dropdown-menu">
          {item.children?.map((child) => (
            <li key={child.href}>
              <NavLink item={child} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SearchForm({ idPrefix }: { idPrefix: 'desktop' | 'mobile' }) {
  const scopeId = idPrefix === 'desktop' ? 'search-scope' : 'search-scope-m';
  const queryId = idPrefix === 'desktop' ? 'q' : 'q-m';
  const queryName = idPrefix === 'desktop' ? 'search-term' : 'search-term-m';

  return (
    <form action={`${TRITONAI_URL}/search/index.html`} method="get" id={`${idPrefix}-cse-search-box`}>
      <label className="sr-only" htmlFor={scopeId}>Search Scope</label>
      <select className="search-scope" id={scopeId} name="search-scope">
        <option value="tritonai">This Site</option>
        <option value="default_collection">All UCSD Sites</option>
        <option value="faculty-staff">Faculty/Staff</option>
      </select>
      <div className="input-group">
        <label className="sr-only" htmlFor={queryId}>Search Term</label>
        <input
          placeholder="Search..."
          type="search"
          className="form-control search-term"
          id={queryId}
          name={queryName}
        />
      </div>
    </form>
  );
}

export default function Layout({ children, title }: LayoutProps) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const skillSectionActive = isLocalSkillPath(router.pathname);

  useEffect(() => {
    const handleRouteChange = () => setNavOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  useEffect(() => {
    document.body.classList.toggle('offcanvas-open', navOpen);
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
            <a className="title-header title-header-large" href={TRITONAI_URL}>
              Triton AI
            </a>
            <a className="title-header title-header-short" href={TRITONAI_URL}>
              Triton AI
            </a>
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

      <div
        className={`navmenu navmenu-default navmenu-fixed-left offcanvas${navOpen ? ' in' : ''}`}
        aria-hidden={!navOpen}
      >
        <ul className="nav navbar-nav navbar-right msearch">
          <li>
            <div className="search">
              <button className="search-toggle btn-default" type="button" aria-hidden="true">
                <span className="glyphicon glyphicon-search" aria-hidden="true" /> <span className="caret" aria-hidden="true" />
              </button>
              <div className="search-content search-is-open mobile-search-content">
                <SearchForm idPrefix="mobile" />
              </div>
            </div>
          </li>
        </ul>

        <ul className="nav navmenu-nav">
          {NAV_ITEMS.map((item) => (
            <MobileNavItem item={item} key={item.href} onLocalClick={closeNav} />
          ))}
        </ul>
      </div>

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
                src={UCSD_WHITE_LOGO}
                alt="UC San Diego"
                className="img-responsive header-logo"
              />
            </div>
          </div>

          <div className="navbar-collapse collapse" id="navbar">
            <ul className="nav navbar-nav navbar-nav-list">
              {NAV_ITEMS.map((item) => (
                <DesktopNavItem
                  item={item}
                  key={item.href}
                  active={item.local ? skillSectionActive : false}
                />
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
                    <SearchForm idPrefix="desktop" />
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
                  <a href="https://ucsd.edu/about/terms-of-use.html" target="_blank" rel="noopener noreferrer">
                    Terms of Use
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
                  src={UCSD_FOOTER_LOGO}
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
