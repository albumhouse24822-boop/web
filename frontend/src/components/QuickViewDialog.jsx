import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { formatPrice } from '../mock';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function QuickViewDialog({ product, open, onClose }) {
  const { addItem } = useCart();
  if (!product) return null;
  const soldOut = product.tag === 'Sold Out';
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-neutral-100 aspect-[4/5]">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            {product.tag && <span className="badge bg-neutral-100 self-start mb-3">{product.tag}</span>}
            <h2 className="font-serif text-2xl md:text-3xl leading-tight mb-3">{product.name}</h2>
            <div className="flex items-center gap-3 mb-4">
              {product.regularPrice && <span className="text-neutral-400 line-through">{formatPrice(product.regularPrice)}</span>}
              <span className={`${product.regularPrice ? 'text-[#a23a2c]' : 'text-neutral-900'} text-lg font-medium`}>{formatPrice(product.price)}</span>
              {product.save && <span className="text-[11px] uppercase tracking-wider text-[#a23a2c]">Save {product.save}</span>}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">Handcrafted in premium finish at the most affordable pricing. Made for Indian photographers, newborn and maternity studios. Ships pan-India.</p>
            <div className="mt-auto space-y-3">
              <button disabled={soldOut} onClick={() => { addItem(product); onClose(); }} className={`w-full btn-primary inline-flex items-center justify-center gap-2 ${soldOut ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <ShoppingBag size={16}/> {soldOut ? 'Sold Out' : 'Add to Cart'}
              </button>
              <a href="#" className="block text-center text-xs uppercase tracking-[0.18em] underline">View full details</a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
