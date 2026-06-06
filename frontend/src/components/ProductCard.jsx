import React, { useState } from 'react';
import { formatPrice } from '../mock';
import { useCart } from '../context/CartContext';
import QuickViewDialog from './QuickViewDialog';

export default function ProductCard({ p }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const soldOut = p.tag === 'Sold Out';
  return (
    <>
      <div className="product-card group relative">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {p.tag && (
            <span className={`badge ${soldOut ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border border-neutral-300'}`}>{p.tag}</span>
          )}
          {p.sale && !soldOut && (
            <span className="badge bg-[#a23a2c] text-white">Sale</span>
          )}
        </div>
        <a href="#" className="relative block aspect-[4/5] overflow-hidden bg-neutral-100">
          <img src={p.image} alt={p.name} loading="lazy" className="img-primary absolute inset-0 w-full h-full object-cover" />
          {p.hover && (
            <img src={p.hover} alt={p.name} loading="lazy" className="img-hover absolute inset-0 w-full h-full object-cover" />
          )}
          <button onClick={(e) => { e.preventDefault(); setOpen(true); }} className="quick-view-btn absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-neutral-900 text-[11px] uppercase tracking-[0.16em] px-4 py-2 border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors">
            Quick view
          </button>
        </a>
        <div className="pt-4 pb-2 text-center px-2">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5em]">
            <a href="#" className="hover:underline">{p.name}</a>
          </h3>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm">
            {p.regularPrice && <span className="text-neutral-400 line-through">{formatPrice(p.regularPrice)}</span>}
            <span className={`${p.regularPrice ? 'text-[#a23a2c]' : 'text-neutral-900'} font-medium`}>{p.sale ? 'from ' : ''}{formatPrice(p.price)}</span>
          </div>
          {p.save && <p className="mt-1 text-[11px] uppercase tracking-wider text-[#a23a2c]">Save {p.save}</p>}
        </div>
        {!soldOut && (
          <button onClick={() => addItem(p)} className="opacity-0 group-hover:opacity-100 transition-opacity w-full text-[11px] uppercase tracking-[0.16em] py-3 border-t border-neutral-200 hover:bg-neutral-900 hover:text-white">
            Add to cart
          </button>
        )}
      </div>
      <QuickViewDialog product={p} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
