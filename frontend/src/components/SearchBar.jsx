import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="border-t border-neutral-200 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-3 flex items-center gap-3">
        <Search size={18} className="text-neutral-500" />
        <input
          autoFocus
          placeholder="Search props, backdrops, themes..."
          className="flex-1 outline-none text-sm py-2 bg-transparent"
        />
        <button onClick={onClose} aria-label="close search"><X size={18} /></button>
      </div>
    </div>
  );
}
