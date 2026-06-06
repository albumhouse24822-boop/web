import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const NAVIGATION = [
  {
    label: 'New Arrivals',
    href: '/shop?category=new-arrivals',
    columns: [
      {
        title: 'Just In',
        items: [
          { label: 'All New Arrivals', href: '/shop?category=new-arrivals' },
          { label: 'Backdrops', href: '/shop?q=Backdrop' },
          { label: 'Wraps & Pillows', href: '/shop?q=Wrap' },
          { label: 'Posing Props', href: '/shop?q=Posing' },
          { label: 'Filler Props', href: '/shop?q=Filler' },
          { label: 'Mini Sets', href: '/shop?q=Setup' },
        ],
      },
    ],
  },
  {
    label: 'Newborn',
    href: '/shop?category=baby',
    columns: [
      {
        title: 'Apparel',
        items: [
          { label: 'Wraps', href: '/shop?q=Wrap' },
          { label: 'Pillows', href: '/shop?q=Pillow' },
          { label: 'Knit & Felted', href: '/shop?q=Felted' },
        ],
      },
      {
        title: 'Posing',
        items: [
          { label: 'Posing Aids', href: '/shop?q=Posing' },
          { label: 'Podiums', href: '/shop?q=Podium' },
          { label: 'Sofa Props', href: '/shop?q=Sofa' },
        ],
      },
      {
        title: 'Accessories',
        items: [
          { label: 'Headsets & Toys', href: '/shop?q=Headset' },
          { label: 'Filler Props', href: '/shop?q=Filler' },
          { label: 'Hand Props', href: '/shop?q=Combo' },
        ],
      },
    ],
  },
  {
    label: 'Maternity',
    href: '/shop?q=Maternity',
    columns: [
      {
        title: 'Backdrops',
        items: [
          { label: 'All Maternity', href: '/shop?q=Maternity' },
          { label: 'Floral', href: '/shop?q=Floral' },
          { label: 'Tropical', href: '/shop?q=Tropical' },
          { label: 'Garden', href: '/shop?q=Garden' },
          { label: 'Fairy Light Path', href: '/shop?q=Fairy' },
        ],
      },
    ],
  },
  {
    label: 'Backdrops',
    href: '/shop?q=Backdrop',
    columns: [
      {
        title: 'Baby',
        items: [
          { label: 'All Baby Backdrops', href: '/shop?q=Backdrop' },
          { label: 'Floral', href: '/shop?q=Floral' },
          { label: 'Royal Lotus', href: '/shop?q=Lotus' },
          { label: 'Sandy Shores', href: '/shop?q=Sandy' },
          { label: 'Adventure', href: '/shop?q=Adventure' },
        ],
      },
      {
        title: 'Maternity',
        items: [
          { label: 'All Maternity', href: '/shop?q=Maternity' },
          { label: 'Rose Corridor', href: '/shop?q=Rose' },
          { label: 'Neutral Arch', href: '/shop?q=Neutral' },
        ],
      },
      {
        title: 'Curated',
        items: [
          { label: 'Ready-made themes', href: '/shop?category=ready-themes' },
          { label: 'Theme Bundles', href: '/shop?q=Setup' },
        ],
      },
    ],
  },
  {
    label: 'Themes',
    href: '/shop',
    columns: [
      {
        title: 'Popular',
        items: [
          { label: 'Jungle', href: '/shop?q=Jungle' },
          { label: 'Beach', href: '/shop?q=Beach' },
          { label: 'Royal Traditional', href: '/shop?q=Royal' },
          { label: 'Birthday', href: '/shop?q=Birthday' },
        ],
      },
      {
        title: 'Storybook',
        items: [
          { label: 'Adventure', href: '/shop?q=Adventure' },
          { label: 'Carnival', href: '/shop?q=Carnival' },
          { label: 'Little Explorer', href: '/shop?q=Explorer' },
        ],
      },
      {
        title: 'Special',
        items: [
          { label: 'Cake Smash', href: '/shop?q=Cake' },
          { label: 'Vintage', href: '/shop?q=Vintage' },
          { label: 'Galaxy', href: '/shop?q=Galaxy' },
        ],
      },
    ],
  },
  {
    label: 'AI Stylist',
    href: '/quiz',
    highlight: true,
  },
  {
    label: 'About',
    href: '/shop',
    columns: [
      {
        title: 'Info',
        items: [
          { label: 'Our Story', href: '/shop' },
          { label: 'Studios', href: '/#stores' },
          { label: 'Contact', href: '/shop' },
        ],
      },
    ],
  },
];

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
          <Link
            to={n.href}
            className="nav-link inline-flex items-center gap-1.5 py-3 whitespace-nowrap"
            style={n.highlight ? { color: config.primaryColor } : undefined}
          >
            {n.highlight && <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: config.accentColor }} />}
            {n.label}
          </Link>
          {n.columns && <MegaMenu columns={n.columns} />}
        </div>
      ))}
    </nav>
  );
}

export { NAVIGATION };
