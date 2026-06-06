import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Minus, Plus, Truck, ShieldCheck, RotateCcw, ArrowLeft } from 'lucide-react';
import { fetchProduct, fetchProducts, formatPrice } from '../api';
import { useCart } from '../context/CartContext';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import { Footer } from '../components/Sections';
import ProductCard from '../components/ProductCard';

export default function ProductPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null);
    setActiveImg(null);
    setQty(1);
    fetchProduct(id)
      .then(p => { setProduct(p); setActiveImg(p.image); })
      .catch(() => nav('/', { replace: true }));
  }, [id, nav]);

  useEffect(() => {
    if (!product) return;
    fetchProducts({ category: product.category, limit: 12 })
      .then((all) => setRelated(all.filter(p => p.id !== product.id).slice(0, 8)))
      .catch(() => setRelated([]));
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--ahps-cream)' }}>
        <AnnouncementBar /><Header />
        <div className="flex-1 flex items-center justify-center p-10">Loading product…</div>
        <Footer />
      </div>
    );
  }

  const soldOut = product.tag === 'Sold Out';
  const images = [product.image, product.hover].filter(Boolean);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--ahps-cream)' }}>
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-5">
          <nav className="flex items-center gap-2 text-xs text-neutral-600">
            <Link to="/" className="hover:text-[var(--ahps-primary)]">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/shop?category=${product.category}`} className="hover:text-[var(--ahps-primary)] capitalize">
              {product.category.replace('-', ' ')}
            </Link>
            <ChevronRight size={12} />
            <span className="text-[var(--ahps-text)] line-clamp-1">{product.name}</span>
          </nav>
        </div>

        {/* Main grid */}
        <section className="max-w-screen-2xl mx-auto px-4 lg:px-8 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="aspect-[4/5] overflow-hidden rounded-3xl bg-white">
              <img src={activeImg || product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImg(img)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImg === img ? 'border-[var(--ahps-primary)]' : 'border-transparent'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.tag && <span className="chip mb-4">{product.tag}</span>}
            <h1 className="font-display text-3xl md:text-5xl leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {product.regularPrice && (
                <span className="text-neutral-400 line-through text-lg">{formatPrice(product.regularPrice)}</span>
              )}
              <span className={`${product.regularPrice ? 'text-[var(--ahps-primary)]' : 'text-[var(--ahps-text)]'} text-3xl font-semibold font-display`}>
                {formatPrice(product.price)}
              </span>
              {product.save && (
                <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full" style={{ background: 'var(--ahps-soft)', color: 'var(--ahps-primary)' }}>
                  Save {product.save}
                </span>
              )}
            </div>

            <p className="text-neutral-700 leading-relaxed mb-7">
              {product.description || 'Handcrafted in premium finish at the most affordable pricing. Made for Indian photographers, newborn & maternity studios. Ships pan-India.'}
            </p>

            {/* Qty + Add */}
            {!soldOut && (
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2 border border-[var(--ahps-text)]/15 rounded-full overflow-hidden bg-white">
                  <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="decrease"><Minus size={14}/></button>
                  <span className="px-3 text-sm font-semibold tabular-nums w-8 text-center">{qty}</span>
                  <button className="p-3" onClick={() => setQty(qty + 1)} aria-label="increase"><Plus size={14}/></button>
                </div>
                <button onClick={handleAdd} className="btn-primary flex-1 min-w-[200px]">
                  <ShoppingBag size={16}/> {added ? 'Added to bag!' : 'Add to bag'}
                </button>
              </div>
            )}
            {soldOut && (
              <button disabled className="btn-primary w-full opacity-60 cursor-not-allowed">Sold out</button>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 pt-8 border-t border-[var(--ahps-text)]/10">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-[var(--ahps-primary)]" />
                <div><p className="text-sm font-semibold">Free shipping</p><p className="text-xs text-neutral-500">On orders above ₹999</p></div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-[var(--ahps-primary)]" />
                <div><p className="text-sm font-semibold">Quality assured</p><p className="text-xs text-neutral-500">Handcrafted with love</p></div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-[var(--ahps-primary)]" />
                <div><p className="text-sm font-semibold">Easy returns</p><p className="text-xs text-neutral-500">7-day return window</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-14" style={{ background: 'var(--ahps-soft)' }}>
            <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <h2 className="section-title text-left">You may also love</h2>
                <Link to={`/shop?category=${product.category}`} className="text-[12px] uppercase tracking-[0.16em] font-semibold underline underline-offset-4 decoration-2 decoration-[var(--ahps-primary)] hidden md:inline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {related.slice(0, 4).map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            </div>
          </section>
        )}

        <div className="py-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft size={14}/> Continue shopping
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
