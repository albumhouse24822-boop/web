import React from 'react';
import { useSite } from '../context/SiteContext';

const NAVIGATION = [
  {
    label: 'New Arrivals',
    columns: [
      { title: 'Just In', items: ['Backdrops', 'Wraps & Pillows', 'Posing Props', 'Filler Props', 'Mini Sets'] },
    ],
  },
  {
    label: 'Newborn',
    columns: [
      { title: 'Apparel', items: ['Wraps', 'Pillows', 'Bonnets', 'Knit Outfits', 'Furs & Layers'] },
      { title: 'Posing', items: ['Posing Aids', 'Posing Cushions', 'Bean Bag Sets', 'Podiums'] },
      { title: 'Accessories', items: ['Headsets & Toys', 'Crochet Buddies', 'Filler Props', 'Hand Props'] },
    ],
  },
  {
    label: 'Maternity',
    columns: [
      { title: 'Backdrops', items: ['Floral', 'Boho', 'Fairylights', 'Garden Arch', 'Tropical'] },
      { title: 'Outfits', items: ['Flowing Gowns', 'Ethnic', 'Bodysuits'] },
      { title: 'Studio', items: ['Posing Stands', 'Maternity Hair Accessories', 'Detash Props'] },
    ],
  },
  {
    label: 'Backdrops',
    columns: [
      { title: 'Baby', items: ['Printed', 'Fabric', 'Painted', 'Floors & Walls', 'Windows'] },
      { title: 'Maternity', items: ['Printed', 'Fabric', 'Floral', 'Festival'] },
      { title: 'Event', items: ['Birthday', 'Baby Shower', 'Naming Ceremony', 'Cake Smash'] },
      { title: 'Curated', items: ['Ready to Ship', 'Mini Sets', 'Theme Bundles'] },
    ],
  },
  {
    label: 'Themes',
    columns: [
      { title: 'Popular', items: ['Jungle', 'Beach', 'Royal Traditional', 'Birthday Party', 'Boss Babe'] },
      { title: 'Storybook', items: ['Fairytale', 'Unicorn', 'Mermaid', 'Little Chef', 'Pirate'] },
      { title: 'Festive', items: ['Christmas', 'Halloween', 'Easter', 'Diwali', 'Valentine'] },
      { title: 'Special', items: ['Cake Smash', 'Bath & Spa', 'Adventure', 'Vintage', 'Music'] },
    ],
  },
  {
    label: 'AI Stylist',
    href: '/quiz',
    highlight: true,
  },
  {
    label: 'About',
    columns: [
      { title: 'Info', items: ['Our Story', 'Studios', 'Rentals', 'Contact', 'Policies'] },
    ],
  },
];

function MegaMenuColumn({ column }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.18em] font-bold mb-3 text-[var(--ahps-primary)]">{column.title}</h4>
      <ul className="space-y-2">
        {column.items.map((item) => (
          <li key={`${column.title}-${item}`}>
            <a href="#" className="text-[13px] text-neutral-700 hover:text-[var(--ahps-primary)] transition-colors">{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaMenu({ columns }) {
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
  const { config } = useSite();
  return (
    <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mx-auto">
      {NAVIGATION.map((n) => (
        <div key={n.label} className="nav-item relative">
          {n.href ? (
            <a
              href={n.href}
              className="nav-link inline-flex items-center gap-1.5 py-3 whitespace-nowrap"
              style={n.highlight ? { color: config.primaryColor } : undefined}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: config.accentColor }} />
              {n.label}
            </a>
          ) : (
            <button className="nav-link py-3 whitespace-nowrap">{n.label}</button>
          )}
          {n.columns && <MegaMenu columns={n.columns} />}
        </div>
      ))}
    </nav>
  );
}

export { NAVIGATION };
