import React, { useState } from 'react';
import { formatPrice } from '../mock';
import { useCart } from '../context/CartContext';
import QuickViewDialog from './QuickViewDialog';

function ProductBadges({ tag, sale, soldOut }) {
  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
      {tag && (
        <span
          className={`badge ${
            soldOut ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 border border-neutral-300'
          }`}
        >
          {tag}
        </span>
      )}
      {sale && !soldOut && <span className="badge bg-[#a23a2c] text-white">Sale</span>}
    </div>
  );
}

function ProductPrice({ regularPrice, price, sale, save }) {
  const hasDiscount = Boolean(regularPrice);
  return (
    <>
      <div className="mt-2 flex items-center justify-center gap-2 text-sm">
        {hasDiscount && <span className="text-neutral-400 line-through">{formatPrice(regularPrice)}</span>}
        <span className={`${hasDiscount ? 'text-[#a23a2c]' : 'text-neutral-900'} font-medium`}>
          {sale ? 'from ' : ''}
          {formatPrice(price)}
        </span>
      </div>
      {save && <p className="mt-1 text-[11px] uppercase tracking-wider text-[#a23a2c]">Save {save}</p>}
    </>
  );
}

function ProductImage({ p, onQuickView }) {
  return (
    <a href="#" className="relative block aspect-[4/5] overflow-hidden bg-neutral-100">
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        className="img-primary absolute inset-0 w-full h-full object-cover"
      />
      {p.hover && (
        <img
          src={p.hover}
          alt={p.name}
          loading="lazy"
          className="img-hover absolute inset-0 w-full h-full object-cover"
        />
      )}
      <button
        onClick={onQuickView}
        className="quick-view-btn absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-neutral-900 text-[11px] uppercase tracking-[0.16em] px-4 py-2 border border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
      >
        Quick view
      </button>
    </a>
  );
}

export default function ProductCard({ p }) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const soldOut = p.tag === 'Sold Out';

  const handleQuickView = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <div className="product-card group relative">
        <ProductBadges tag={p.tag} sale={p.sale} soldOut={soldOut} />
        <ProductImage p={p} onQuickView={handleQuickView} />
        <div className="pt-4 pb-2 text-center px-2">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5em]">
            <a href="#" className="hover:underline">{p.name}</a>
          </h3>
          <ProductPrice regularPrice={p.regularPrice} price={p.price} sale={p.sale} save={p.save} />
        </div>
        {!soldOut && (
          <button
            onClick={() => addItem(p)}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-full text-[11px] uppercase tracking-[0.16em] py-3 border-t border-neutral-200 hover:bg-neutral-900 hover:text-white"
          >
            Add to cart
          </button>
        )}
      </div>
      <QuickViewDialog product={p} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
