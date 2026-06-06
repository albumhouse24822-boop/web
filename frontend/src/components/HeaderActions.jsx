import React from 'react';
import { Search, User, ShoppingBag, Instagram, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function HeaderActions({ onSearchToggle, onCartOpen }) {
  const { count } = useCart();
  return (
    <div className="flex items-center gap-4 md:gap-5">
      <button onClick={onSearchToggle} aria-label="search" className="hover:opacity-70">
        <Search size={20} />
      </button>
      <a
        href="https://www.instagram.com/madras_prop_store/"
        target="_blank"
        rel="noreferrer"
        className="hidden md:inline-flex hover:opacity-70"
        aria-label="instagram"
      >
        <Instagram size={20} />
      </a>
      <a href="#" className="hidden md:inline-flex hover:opacity-70" aria-label="account">
        <User size={20} />
      </a>
      <a href="#" className="hidden md:inline-flex hover:opacity-70" aria-label="wishlist">
        <Heart size={20} />
      </a>
      <button onClick={onCartOpen} className="relative hover:opacity-70" aria-label="cart">
        <ShoppingBag size={20} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-neutral-900 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>
    </div>
  );
}
