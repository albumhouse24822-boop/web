import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNavigation } from '../api';

const NavContext = React.createContext([]);

export function useNavigationData() {
  return React.useContext(NavContext);
}

export function NavigationProvider({ children }) {
  const [nav, setNav] = useState([]);
  useEffect(() => { fetchNavigation().then(setNav).catch(() => setNav([])); }, []);
  return <NavContext.Provider value={nav}>{children}</NavContext.Provider>;
}

function MegaMenuColumn({ column }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.18em] font-bold mb-3 text-[var(--ahps-primary)]">{column.title}</h4>
      <ul className="space-y-2">
        {column.items.map((item) => (
          <li key={`${column.title}-${item.label}`}>
            <Link to={item.href} className="text-[13px] text-neutral-700 hover:text-[var(--ahps-primary)] transition-colors">{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaMenu({ columns }) {
  if (!columns || columns.length === 0) return null;
  const cols = Math.min(columns.length, 4);
  return (
    <div className="mega-menu absolute left-1/2 -translate-x-1/2 top-full pt-3">
      <div
        className="bg-white border border-neutral-200 shadow-2xl p-8 grid gap-8 rounded-2xl"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(180px, 1fr))`, minWidth: `${cols * 200}px` }}
      >
        {columns.map((c) => (<MegaMenuColumn key={c.title} column={c} />))}
      </div>
    </div>
  );
}

export default function DesktopNav() {
  const nav = useNavigationData();
  return (
    <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
      {nav.map((n) => (
        <div key={n.id} className="nav-item relative">
          <Link
            to={n.href}
            className="nav-link inline-flex items-center gap-1.5 py-3 whitespace-nowrap"
            style={n.highlight ? { color: 'var(--ahps-primary)' } : undefined}
          >
            {n.highlight && <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ahps-accent)' }} />}
            {n.label}
          </Link>
          {n.columns && n.columns.length > 0 && <MegaMenu columns={n.columns} />}
        </div>
      ))}
    </nav>
  );
}
