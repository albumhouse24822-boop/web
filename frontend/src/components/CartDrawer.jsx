import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../api';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, updateQty, removeItem } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-[var(--ahps-cream)] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[var(--ahps-text)]/10">
          <h3 className="font-display text-2xl flex items-center gap-2"><ShoppingBag size={20}/> Your Bag</h3>
          <button onClick={onClose} aria-label="close"><X size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="text-center mt-24">
              <p className="text-neutral-600 mb-2">Your bag is empty.</p>
              <p className="text-xs text-neutral-500">Try our AI Stylist to discover your perfect bundle.</p>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 bg-white p-3 rounded-xl">
                  <img src={it.image} alt={it.name} className="w-20 h-24 object-cover rounded-lg"/>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight line-clamp-2">{it.name}</p>
                    <p className="text-sm text-[var(--ahps-primary)] font-semibold mt-1">{formatPrice(it.price)}</p>
                    <div className="flex items-center gap-2 mt-2 border border-neutral-300 w-fit rounded-full overflow-hidden">
                      <button className="p-1.5 px-2.5" onClick={() => updateQty(it.id, it.qty - 1)}><Minus size={12}/></button>
                      <span className="text-sm">{it.qty}</span>
                      <button className="p-1.5 px-2.5" onClick={() => updateQty(it.id, it.qty + 1)}><Plus size={12}/></button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(it.id)} className="text-[10px] uppercase tracking-wider self-start text-neutral-500 hover:text-[var(--ahps-primary)]">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-5 border-t border-[var(--ahps-text)]/10 space-y-3 bg-white">
          <div className="flex items-center justify-between text-sm">
            <span className="uppercase tracking-wider font-semibold">Subtotal</span>
            <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
          </div>
          <p className="text-xs text-neutral-500">Shipping & taxes calculated at checkout.</p>
          <button className="btn-primary w-full" disabled={items.length === 0}>Check out</button>
        </div>
      </aside>
    </div>
  );
}
