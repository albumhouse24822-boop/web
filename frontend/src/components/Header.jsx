import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu, X, Instagram, Heart } from 'lucide-react';
import { navigation } from '../mock';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="open menu">
            <Menu size={22} />
          </button>

          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-serif text-xl md:text-2xl lg:text-[26px] tracking-wide font-medium whitespace-nowrap">Madras Prop Store</span>
          </a>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 mx-auto">
            {navigation.map((n) => (
              <div key={n.label} className="nav-item relative">
                <button className="nav-link text-neutral-900 py-3 whitespace-nowrap">{n.label}</button>
                {n.columns && (
                  <div className="mega-menu absolute left-1/2 -translate-x-1/2 top-full pt-2">
                    <div className="bg-white border border-neutral-200 shadow-xl p-8 grid gap-8" style={{gridTemplateColumns: `repeat(${Math.min(n.columns.length, 5)}, minmax(160px, 1fr))`, minWidth: `${Math.min(n.columns.length, 5) * 180}px`}}>
                      {n.columns.map((c) => (
                        <div key={c.title}>
                          <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold mb-3 text-neutral-900">{c.title}</h4>
                          <ul className="space-y-2">
                            {c.items.map((it) => (
                              <li key={it}>
                                <a href="#" className="text-[13px] text-neutral-600 hover:text-neutral-900 transition-colors">{it}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-5">
            <button onClick={() => setSearchOpen((s) => !s)} aria-label="search" className="hover:opacity-70">
              <Search size={20} />
            </button>
            <a href="https://www.instagram.com/madras_prop_store/" target="_blank" rel="noreferrer" className="hidden md:inline-flex hover:opacity-70" aria-label="instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="hidden md:inline-flex hover:opacity-70" aria-label="account">
              <User size={20} />
            </a>
            <a href="#" className="hidden md:inline-flex hover:opacity-70" aria-label="wishlist">
              <Heart size={20} />
            </a>
            <button onClick={() => setCartOpen(true)} className="relative hover:opacity-70" aria-label="cart">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-neutral-200 bg-white">
            <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3">
              <Search size={18} className="text-neutral-500" />
              <input autoFocus placeholder="Search props, backdrops, themes..." className="flex-1 outline-none text-sm py-2" />
              <button onClick={() => setSearchOpen(false)} aria-label="close"><X size={18} /></button>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
