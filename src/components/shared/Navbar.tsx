import { useState } from 'react';
import { FiChevronDown, FiHeart, FiLogOut, FiMenu, FiUser, FiX } from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/recipes', label: 'Explore Recipes' },
  { to: '/about', label: 'About' },
];

const privateLinks = [
  { to: '/ai-assistant', label: 'AI Assistant' },
  { to: '/ai-recommendations', label: 'AI Recommendations' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/recipes/add', label: 'Add Recipe' },
  { to: '/recipes/manage', label: 'Manage Recipes' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/preferences', label: 'Preferences' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700 hover:bg-stone-100 hover:text-emerald-700'
  }`;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const links = user === null ? publicLinks : [...publicLinks.slice(0, 2), ...privateLinks];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-canvas/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-white"><FiHeart aria-hidden="true" /></span>
          <span className="text-xl font-extrabold tracking-tight text-neutral">MealMind <span className="text-primary">AI</span></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => <NavLink key={link.to} to={link.to} className={linkClass}>{link.label}</NavLink>)}
          {user === null ? (
            <Link to="/login" className="btn btn-primary btn-sm ml-2">Login</Link>
          ) : (
            <details className="dropdown dropdown-end ml-2">
              <summary className="btn btn-ghost flex list-none items-center gap-2 px-2" aria-label="Open user menu">
                {user.photoURL ? (
                  <img className="size-8 rounded-full border border-stone-200 object-cover" src={user.photoURL} alt={`${user.name} profile`} referrerPolicy="no-referrer" />
                ) : (
                  <span className="grid size-8 place-items-center rounded-full bg-emerald-100 text-primary"><FiUser /></span>
                )}
                <span className="max-w-28 truncate text-sm font-semibold">{user.name}</span>
                <FiChevronDown aria-hidden="true" />
              </summary>
              <div className="dropdown-content z-50 mt-2 w-64 rounded-card border border-stone-200 bg-base-100 p-3 shadow-soft">
                <div className="border-b border-stone-100 px-2 pb-3">
                  <p className="truncate font-bold text-neutral">{user.name}</p>
                  <p className="truncate text-sm text-stone-500">{user.email}</p>
                </div>
                <button className="btn btn-ghost btn-sm mt-2 w-full justify-start text-stone-700" onClick={() => void logout()}>
                  <FiLogOut aria-hidden="true" /> Logout
                </button>
              </div>
            </details>
          )}
        </div>

        <button
          className="btn btn-ghost btn-square lg:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-base-100 px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>
            ))}
            {user === null ? (
              <Link to="/login" className="btn btn-primary btn-sm mt-2" onClick={() => setMenuOpen(false)}>Login</Link>
            ) : (
              <div className="mt-3 border-t border-stone-200 pt-3">
                <div className="flex items-center gap-3 px-3 pb-3">
                  {user.photoURL ? <img className="size-10 rounded-full object-cover" src={user.photoURL} alt={`${user.name} profile`} referrerPolicy="no-referrer" /> : <span className="grid size-10 place-items-center rounded-full bg-emerald-100 text-primary"><FiUser /></span>}
                  <div className="min-w-0"><p className="truncate text-sm font-bold">{user.name}</p><p className="truncate text-xs text-stone-500">{user.email}</p></div>
                </div>
                <button className="btn btn-outline btn-sm w-full" onClick={() => { setMenuOpen(false); void logout(); }}><FiLogOut aria-hidden="true" /> Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
