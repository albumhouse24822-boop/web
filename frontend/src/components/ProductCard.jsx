import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../api';
import QuickViewDialog from './QuickViewDialog';

function badgeClass(tag, isSale) {
  if (tag === 'Sold Out') return 'badge-soldout';
  if (tag === 'Ready to Ship') return 'badge-ready';
  if (tag === 'Made to Order') return 'badge-new';
  return isSale ? 'badge-sale' : 'badge-new';
}

function ProductBadges({ tag, sale, soldOut }) {
  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
      {tag && <span className={`badge ${badgeClass(tag, false)}`}>{tag}</span>}
      {sale && !soldOut && <span className="badge badge-sale">Sale</span>}
    </div>
  );
}

function ProductPrice({ regularPrice, price, sale, save }) {
  const hasDiscount = Boolean(regularPrice);
  return (
    <>
      <div className="mt-2 flex items-center justify-center gap-2 text-sm">
        {hasDiscount && <span className="text-neutral-400 line-through">{formatPrice(regularPrice)}</span>}
        <span className={`${hasDiscount ? 'text-[var(--ahps-primary)]' : 'text-[var(--ahps-text)]'} font-semibold`}>
          {sale ? 'from ' : ''}{formatPrice(price)}
        </span>
      </div>
      {save && <p className="mt-1 text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--ahps-primary)]">Save {save}</p>}
    </>
  );
}

function ProductImage({ p, onQuickView }) {
  return (
    <a href="#" className="relative block aspect-[4/5] overflow-hidden bg-[var(--ahps-cream)]" onClick={onQuickView}>
      <img src={p.image} alt={p.name} loading="lazy" className={`${p.hover ? 'img-primary' : 'img-only'} absolute inset-0 w-full h-full object-cover transition-transform duration-700`} />
      {p.hover && (
        <img src={p.hover} alt={p.name} loading="lazy" className="img-hover absolute inset-0 w-full h-full object-cover" />
      )}
      <button
        onClick={onQuickView}
        className="quick-view-btn absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-[var(--ahps-text)] text-[11px] uppercase tracking-[0.16em] px-4 py-2 rounded-full border border-[var(--ahps-text)] hover:bg-[var(--ahps-text)] hover:text-white transition-colors font-semibold"
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
      <div className="product-card group">
        <ProductBadges tag={p.tag} sale={p.sale} soldOut={soldOut} />
        <ProductImage p={p} onQuickView={handleQuickView} />
        <div className="pt-4 pb-3 text-center px-3">
          <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5em]">
            <a href="#" className="hover:underline">{p.name}</a>
          </h3>
          <ProductPrice regularPrice={p.regularPrice} price={p.price} sale={p.sale} save={p.save} />
        </div>
        {!soldOut && (
          <button
            onClick={() => addItem(p)}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-full text-[11px] uppercase tracking-[0.16em] py-3 font-semibold flex items-center justify-center gap-2"
            style={{ background: 'var(--ahps-text)', color: '#fff' }}
          >
            <ShoppingBag size={13} /> Add to bag
          </button>
        )}
      </div>
      <QuickViewDialog product={p} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
