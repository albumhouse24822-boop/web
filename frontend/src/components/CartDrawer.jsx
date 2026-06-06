import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../mock';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, updateQty, removeItem } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-white flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200">
          <h3 className="font-serif text-2xl">Cart</h3>
          <button onClick={onClose} aria-label="close"><X size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <p className="text-center text-neutral-500 mt-20">Your cart is currently empty.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3">
                  <img src={it.image} alt={it.name} className="w-20 h-24 object-cover"/>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{it.name}</p>
                    <p className="text-sm text-neutral-700 mt-1">{formatPrice(it.price)}</p>
                    <div className="flex items-center gap-2 mt-2 border border-neutral-300 w-fit">
                      <button className="p-1.5" onClick={() => updateQty(it.id, it.qty - 1)}><Minus size={12}/></button>
                      <span className="text-sm px-2">{it.qty}</span>
                      <button className="p-1.5" onClick={() => updateQty(it.id, it.qty + 1)}><Plus size={12}/></button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(it.id)} className="text-xs underline self-start">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-5 border-t border-neutral-200 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="uppercase tracking-wider">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <p className="text-xs text-neutral-500">Shipping, taxes, and discount codes calculated at checkout.</p>
          <button className="btn-primary w-full" disabled={items.length === 0}>Check out</button>
        </div>
      </aside>
    </div>
  );
}
