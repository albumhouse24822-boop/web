import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Instagram, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigationData } from './DesktopNav';

export default function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const nav = useNavigationData();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[88vw] max-w-md bg-[var(--ahps-cream)] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <span className="font-display text-xl font-medium">Album House</span>
          <button onClick={onClose} aria-label="close"><X size={22} /></button>
        </div>
        <Link to="/quiz" className="flex items-center gap-3 px-5 py-4 bg-[var(--ahps-soft)]" onClick={onClose}>
          <Sparkles size={18} className="text-[var(--ahps-primary)]" />
          <span className="font-semibold text-sm uppercase tracking-wider">Try the AI Prop Stylist</span>
        </Link>
        <ul className="divide-y divide-neutral-200">
          {nav.map((n, idx) => (
            <li key={n.id}>
              <div className="flex items-stretch">
                <Link to={n.href} onClick={onClose} className="flex-1 px-5 py-4 text-left nav-link">{n.label}</Link>
                {n.columns && n.columns.length > 0 && (
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="px-4 border-l border-neutral-200"
                    aria-label="toggle"
                  >
                    {expanded === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                )}
              </div>
              {expanded === idx && n.columns && (
                <div className="px-5 pb-4 space-y-4 bg-white/60">
                  {n.columns.map((c) => (
                    <div key={c.title}>
                      <h4 className="text-[11px] uppercase tracking-[0.18em] font-bold text-[var(--ahps-primary)] mb-2">{c.title}</h4>
                      <ul className="space-y-1.5">
                        {c.items.map((it) => (
                          <li key={it.label}>
                            <Link to={it.href} onClick={onClose} className="text-sm text-neutral-700">{it.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 p-5 border-t border-neutral-200">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm"><Instagram size={18}/> Instagram</a>
        </div>
      </div>
    </div>
  );
}
