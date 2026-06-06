import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mps_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('mps_cart', JSON.stringify(items));
  }, [items]);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) return prev.map((p) => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems((prev) => prev.map((p) => p.id === id ? { ...p, qty } : p));
  }, [removeItem]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, updateQty, removeItem, subtotal, count }),
    [items, addItem, updateQty, removeItem, subtotal, count]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
