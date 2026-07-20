import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiGrid, FiLogOut, FiMenu, FiSettings, FiUser, FiX } from 'react-icons/fi';
import { Link, NavLink, useLocation } from 'react-router-dom';

import logoImage from '../../assets/image.png';
import { useAuth } from '../../hooks/useAuth';

const guestLinks = [
  { to: '/', label: 'Home' },
  { to: '/recipes', label: 'Explore Recipes' },
  { to: '/about', label: 'About' },
  { to: '/login', label: 'Login' },
];

const memberLinks = [
  { to: '/', label: 'Home' },
  { to: '/recipes', label: 'Explore Recipes' },
  { to: '/ai-assistant', label: 'AI Assistant' },
  { to: '/ai-recommendations', label: 'AI Recommendations' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/recipes/add', label: 'Add Recipe' },
  { to: '/recipes/manage', label: 'Manage Recipes' },
  { to: '/favorites', label: 'Favorites' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
    isActive
      ? 'bg-primary text-white shadow-sm'
      : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-800'
  }`;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const links = user === null ? guestLinks : memberLinks;

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleLogout = async () => {
    setAccountOpen(false);
    setMenuOpen(false);
    await logout();
  };

  const handleAccountKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setAccountOpen(false);
      accountButtonRef.current?.focus();
    }
  };

  const avatar = user?.photoURL ? (
    <img
      className="size-9 shrink-0 rounded-full border border-stone-200 object-cover"
      src={user.photoURL}
      alt={`${user.name} profile`}
      referrerPolicy="no-referrer"
    />
  ) : (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-primary" aria-hidden="true">
      <FiUser />
    </span>
  );

  return (
    <header className="sticky top-0 z-[70] w-full border-b border-stone-200/90 bg-canvas/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link
          to="/"
          className="flex min-w-0 shrink-0 items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <img src={logoImage} alt="MealMind AI logo" className="size-10 rounded-xl object-cover shadow-sm" />
          <span className="hidden text-lg font-extrabold tracking-tight text-neutral sm:inline">
            MealMind <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="ml-auto hidden min-w-0 items-center gap-0.5 xl:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <div ref={accountRef} className="relative ml-1" onKeyDown={handleAccountKeyDown}>
              <button
                ref={accountButtonRef}
                type="button"
                className="flex max-w-44 items-center gap-2 rounded-xl border border-stone-200 bg-white px-2 py-1.5 text-left hover:border-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Open user account menu"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
              >
                {avatar}
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-neutral">{user.name}</span>
                <FiChevronDown className={`shrink-0 transition-transform ${accountOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {accountOpen ? (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-card border border-stone-200 bg-white p-2 shadow-soft" role="menu">
                  <div className="border-b border-stone-100 px-3 py-2">
                    <p className="truncate font-bold text-neutral">{user.name}</p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                  </div>
                  <NavLink to="/preferences" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100" role="menuitem" onClick={() => setAccountOpen(false)}>
                    <FiSettings aria-hidden="true" /> Preferences
                  </NavLink>
                  <NavLink to="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100" role="menuitem" onClick={() => setAccountOpen(false)}>
                    <FiGrid aria-hidden="true" /> Dashboard
                  </NavLink>
                  <button type="button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-700 hover:bg-stone-100" role="menuitem" onClick={() => void handleLogout()}>
                    <FiLogOut aria-hidden="true" /> Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-square ml-auto xl:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX size={22} aria-hidden="true" /> : <FiMenu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {menuOpen ? (
        <div id="mobile-navigation" className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-stone-200 bg-white px-4 py-4 xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <div className="mt-3 border-t border-stone-200 pt-3">
                <div className="flex min-w-0 items-center gap-3 px-2 pb-3">
                  {avatar}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-neutral">{user.name}</p>
                    <p className="truncate text-xs text-stone-500">{user.email}</p>
                  </div>
                </div>
                <NavLink to="/preferences" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100" onClick={() => setMenuOpen(false)}>
                  <FiSettings aria-hidden="true" /> Preferences
                </NavLink>
                <button type="button" className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100" onClick={() => void handleLogout()}>
                  <FiLogOut aria-hidden="true" /> Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
