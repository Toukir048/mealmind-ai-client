import { useState } from 'react';
import { FiHeart, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/recipes', label: 'Explore Recipes' },
  { to: '/about', label: 'About' },
];

const privateLinks = [
  { to: '/assistant', label: 'AI Assistant' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/recipes/add', label: 'Add Recipe' },
  { to: '/recipes/manage', label: 'Manage Recipes' },
  { to: '/favorites', label: 'Favorites' },
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
            <button className="btn btn-ghost btn-sm ml-2 text-stone-700" onClick={() => void logout()}>
              <FiLogOut aria-hidden="true" /> Logout
            </button>
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
              <button className="btn btn-outline btn-sm mt-2" onClick={() => { setMenuOpen(false); void logout(); }}>
                <FiLogOut aria-hidden="true" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
