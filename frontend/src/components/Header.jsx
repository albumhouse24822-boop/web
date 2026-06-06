import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import CartDrawer from './CartDrawer';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import DesktopNav from './DesktopNav';
import HeaderActions from './HeaderActions';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="open menu">
            <Menu size={22} />
          </button>

          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-serif text-xl md:text-2xl lg:text-[26px] tracking-wide font-medium whitespace-nowrap">
              Madras Prop Store
            </span>
          </a>

          <DesktopNav />

          <HeaderActions
            onSearchToggle={() => setSearchOpen((s) => !s)}
            onCartOpen={() => setCartOpen(true)}
          />
        </div>

        <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
