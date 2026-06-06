import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Mail, Instagram, Facebook, Youtube, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchBanners, fetchMentorPicks, fetchStudioBookings, fetchStores } from '../api';
import { useSite } from '../context/SiteContext';

// ----------- Promo banners (API) -----------
export function PromoBanners() {
  const [banners, setBanners] = useState([]);
  useEffect(() => { fetchBanners('promo').then(setBanners).catch(() => setBanners([])); }, []);
  if (!banners.length) return null;
  return (
    <section>
      {banners.map((b, idx) => (
        <div key={b.id} className={`relative w-full grid grid-cols-1 md:grid-cols-2 ${idx % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[460px] overflow-hidden bg-[var(--ahps-cream)]">
            <img src={b.image} alt={b.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div
            className="flex items-center justify-center p-10 md:p-16 [direction:ltr]"
            style={{ background: idx === 0 ? 'var(--ahps-soft)' : idx === 1 ? 'var(--ahps-cream)' : 'var(--ahps-soft)' }}
          >
            <div className="max-w-md text-center md:text-left">
              {b.tag && <span className="section-eyebrow">{b.tag}</span>}
              <h3 className="font-display text-3xl md:text-5xl leading-tight mb-6">{b.title}</h3>
              <a href="#" className="btn-primary">{b.cta || 'Shop Now'} <ArrowRight size={16}/></a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

// ----------- Mentor picks (API) -----------
export function MentorPicks() {
  const [picks, setPicks] = useState([]);
  useEffect(() => { fetchMentorPicks().then(setPicks).catch(() => setPicks([])); }, []);
  if (!picks.length) return null;
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 text-center">
        <span className="section-eyebrow">Curated by experts</span>
        <h2 className="section-title mb-12">Shop from your <span className="accent-underline">mentor's</span> picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {picks.map((m) => (
            <a href="#" key={m.id} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--ahps-cream)]">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="font-display text-2xl mb-2">{m.name}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] font-semibold">Shop Now <ArrowRight size={12}/></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------- Studio bookings (API) -----------
export function StudioBookings() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchStudioBookings().then(setItems).catch(() => setItems([])); }, []);
  if (!items.length) return null;
  return (
    <section className="grid grid-cols-1 md:grid-cols-3">
      {items.map((s) => (
        <div key={s.id} className="relative aspect-[3/4] overflow-hidden">
          <img src={s.image} alt={s.heading} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-end text-center text-white p-8 md:p-12">
            <p className="text-[11px] uppercase tracking-[0.22em] mb-3 opacity-90">{s.line1}</p>
            <h3 className="font-display text-3xl md:text-4xl mb-2">{s.heading}</h3>
            <p className="text-sm mb-6 opacity-90">{s.sub}</p>
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline">{s.cta}</a>
          </div>
        </div>
      ))}
    </section>
  );
}

// ----------- Marquee -----------
const MARQUEE_ITEMS = Array.from({ length: 20 }, (_, i) => ({ id: `m-${i}` }));

function MarqueeRow({ ariaHidden = false, text }) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden || undefined}>
      {MARQUEE_ITEMS.map((m) => (
        <span key={`${ariaHidden ? 'dup-' : ''}${m.id}`} className="px-6 font-display text-2xl tracking-tight flex items-center gap-6">
          {text}
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: 'var(--ahps-accent)' }} />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section className="py-6 overflow-hidden" style={{ background: 'var(--ahps-text)', color: 'var(--ahps-cream)' }}>
      <div className="flex marquee-track">
        <MarqueeRow text="Bold props for tiny souls." />
        <MarqueeRow ariaHidden text="Bold props for tiny souls." />
      </div>
    </section>
  );
}

// ----------- Stores (API) -----------
export function Stores() {
  const [items, setItems] = useState([]);
  useEffect(() => { fetchStores().then(setItems).catch(() => setItems([])); }, []);
  if (!items.length) return null;
  return (
    <section className="py-16 md:py-24" style={{ background: 'var(--ahps-cream)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-eyebrow">Visit Us</span>
          <h2 className="section-title">Our <span className="accent-underline">studios</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl mb-3">{s.name}</h3>
                <p className="text-sm text-neutral-700 leading-relaxed mb-3">{s.address}</p>
                <p className="text-sm"><span className="font-semibold">Call us:</span> {s.phone}</p>
                <p className="text-xs text-neutral-500 mt-1">{s.extra}</p>
                <p className="text-sm text-neutral-700 mt-3">{s.hours}</p>
                <div className="flex items-center gap-3 mt-5">
                  <a href={`tel:${s.phone.replace(/[^0-9+]/g, '')}`} className="w-10 h-10 rounded-full bg-[var(--ahps-soft)] hover:bg-[var(--ahps-primary)] hover:text-white flex items-center justify-center transition-colors" aria-label="call"><Phone size={16}/></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-[var(--ahps-soft)] hover:bg-[var(--ahps-primary)] hover:text-white flex items-center justify-center transition-colors" aria-label="map"><MapPin size={16}/></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------- CTA: Quiz Banner -----------
export function QuizCta() {
  return (
    <section className="py-14 md:py-20" style={{ background: 'var(--ahps-secondary)', color: '#fff' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 chip mb-5" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>
          <Sparkles size={14} /> New · AI Powered
        </span>
        <h2 className="font-display text-4xl md:text-6xl font-medium leading-tight mb-5 max-w-3xl mx-auto">
          Tell us your <span style={{ color: 'var(--ahps-accent)' }}>vibe</span> — we'll style your shoot.
        </h2>
        <p className="text-base md:text-lg opacity-85 max-w-2xl mx-auto mb-8">
          Take our 60-second quiz and get a personalised prop & backdrop bundle curated by AI + our in-house stylists.
        </p>
        <Link to="/quiz" className="btn-outline" style={{ borderColor: 'var(--ahps-accent)', color: 'var(--ahps-accent)' }}>
          <Sparkles size={16} className="mr-2" /> Start Quiz · Free
        </Link>
      </div>
    </section>
  );
}

// ----------- Footer -----------
const FOOTER_SHOP = [
  { id: 'fs-1', label: 'New Arrivals' },
  { id: 'fs-2', label: 'Newborn' },
  { id: 'fs-3', label: 'Maternity' },
  { id: 'fs-4', label: 'Backdrops' },
  { id: 'fs-5', label: 'Themes' },
];
const FOOTER_INFO = [
  { id: 'fi-1', label: 'Our Story' },
  { id: 'fi-2', label: 'Privacy Policy' },
  { id: 'fi-3', label: 'Shipping Policy' },
  { id: 'fi-4', label: 'Refund Policy' },
  { id: 'fi-5', label: 'Contact' },
];

function FooterBrand() {
  const { config } = useSite();
  return (
    <div className="col-span-2 md:col-span-1">
      <h3 className="font-display text-3xl text-white mb-4">{config.brand}</h3>
      <p className="text-sm leading-relaxed opacity-80">{config.aboutText || 'Handcrafted and handpicked photography props for newborn, baby, kids & maternity. Designed in India, loved by photographers worldwide.'}</p>
      <div className="flex items-center gap-3 mt-5">
        <a href={config.instagram} target="_blank" rel="noreferrer" className="hover:text-white" aria-label="instagram"><Instagram size={18}/></a>
        <a href="#" className="hover:text-white" aria-label="facebook"><Facebook size={18}/></a>
        <a href="#" className="hover:text-white" aria-label="youtube"><Youtube size={18}/></a>
      </div>
    </div>
  );
}

function FooterLinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-white text-sm uppercase tracking-[0.16em] mb-4 font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.id}><a href="#" className="hover:text-white">{l.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

function FooterNewsletter() {
  const { config } = useSite();
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Subscribed!');
  };
  return (
    <div>
      <h4 className="text-white text-sm uppercase tracking-[0.16em] mb-4 font-semibold">Newsletter</h4>
      <p className="text-sm mb-3 opacity-80">Get first dibs on new launches & exclusive offers.</p>
      <form onSubmit={handleSubmit} className="flex rounded-full overflow-hidden bg-white/10">
        <input type="email" required placeholder="your@email.com" className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-white/40" />
        <button type="submit" className="px-5 text-xs uppercase tracking-[0.14em] font-semibold" style={{ background: 'var(--ahps-accent)', color: 'var(--ahps-text)' }}>Join</button>
      </form>
      <div className="flex items-center gap-2 mt-5 text-xs opacity-80">
        <Mail size={14}/> {config.email}
      </div>
    </div>
  );
}

export function Footer() {
  const { config } = useSite();
  return (
    <footer style={{ background: 'var(--ahps-deep)', color: 'rgba(255,255,255,0.7)' }}>
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <FooterBrand />
        <FooterLinkColumn title="Shop" links={FOOTER_SHOP} />
        <FooterLinkColumn title="Information" links={FOOTER_INFO} />
        <FooterNewsletter />
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-60">
          <p>© {new Date().getFullYear()} {config.brand}. All rights reserved.</p>
          <p>Designed in India  ·  <Link to="/admin" className="underline hover:text-white">Admin</Link></p>
        </div>
      </div>
    </footer>
  );
}
