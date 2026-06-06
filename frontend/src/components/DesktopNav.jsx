import React from 'react';
import { navigation } from '../mock';

function MegaMenuColumn({ column }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3 text-neutral-900">
        {column.title}
      </h4>
      <ul className="space-y-2">
        {column.items.map((item) => (
          <li key={`${column.title}-${item}`}>
            <a href="#" className="text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaMenu({ columns }) {
  const cols = Math.min(columns.length, 5);
  return (
    <div className="mega-menu absolute left-1/2 -translate-x-1/2 top-full pt-2">
      <div
        className="bg-white border border-neutral-200 shadow-xl p-8 grid gap-8"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(160px, 1fr))`,
          minWidth: `${cols * 180}px`,
        }}
      >
        {columns.map((c) => (
          <MegaMenuColumn key={c.title} column={c} />
        ))}
      </div>
    </div>
  );
}

export default function DesktopNav() {
  return (
    <nav className="hidden lg:flex items-center gap-5 xl:gap-7 mx-auto">
      {navigation.map((n) => (
        <div key={n.label} className="nav-item relative">
          <button className="nav-link text-neutral-900 py-3 whitespace-nowrap">{n.label}</button>
          {n.columns && <MegaMenu columns={n.columns} />}
        </div>
      ))}
    </nav>
  );
}
