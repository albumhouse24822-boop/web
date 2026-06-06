import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Instagram, User } from 'lucide-react';
import { navigation } from '../mock';

export default function MobileMenu({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[88vw] max-w-md bg-white overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <span className="font-serif text-xl">Madras Prop Store</span>
          <button onClick={onClose} aria-label="close"><X size={22} /></button>
        </div>
        <ul className="divide-y divide-neutral-200">
          {navigation.map((n, idx) => (
            <li key={n.label}>
              <button onClick={() => setExpanded(expanded === idx ? null : idx)} className="w-full flex items-center justify-between px-4 py-4 text-left">
                <span className="nav-link">{n.label}</span>
                {expanded === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expanded === idx && (
                <div className="px-4 pb-4 space-y-4 bg-neutral-50">
                  {n.columns.map((c) => (
                    <div key={c.title}>
                      <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-2">{c.title}</h4>
                      <ul className="space-y-1.5">
                        {c.items.map((it) => (
                          <li key={it}><a href="#" className="text-sm text-neutral-700">{it}</a></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4 p-4 border-t border-neutral-200">
          <a href="#" className="flex items-center gap-2 text-sm"><User size={18}/> Log in</a>
          <a href="https://www.instagram.com/madras_prop_store/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm"><Instagram size={18}/> Instagram</a>
        </div>
      </div>
    </div>
  );
}
