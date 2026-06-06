import React, { useState } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import DesktopNav from './DesktopNav';
import HeaderActions from './HeaderActions';
import Logo from './Logo';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-[var(--ahps-cream)]/90 border-b border-[var(--ahps-text)]/10">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="open menu">
            <Menu size={22} />
          </button>

          <Logo />

          <DesktopNav />

          <div className="flex items-center gap-3">
            <Link
              to="/quiz"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ background: 'var(--ahps-soft)', color: 'var(--ahps-text)' }}
            >
              <Sparkles size={14} className="text-[var(--ahps-primary)]" />
              AI Stylist
            </Link>
            <HeaderActions
              onSearchToggle={() => setSearchOpen((s) => !s)}
              onCartOpen={() => setCartOpen(true)}
            />
          </div>
        </div>

        <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
