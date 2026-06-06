import React from 'react';
import { promoBanners, mentorPicks, studioBookings, stores } from '../mock';
import { Phone, MapPin, Video, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

export function PromoBanners() {
  return (
    <section className="divide-y divide-neutral-200">
      {promoBanners.map((b, idx) => (
        <div key={idx} className={`relative w-full grid grid-cols-1 md:grid-cols-2 ${idx % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[420px] overflow-hidden bg-neutral-100">
            <img src={b.image} alt={b.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="flex items-center justify-center p-10 md:p-16 bg-[#f7f3ee] [direction:ltr]">
            <div className="max-w-md text-center md:text-left">
              {b.tag && <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-600 mb-3">{b.tag}</p>}
              <h3 className="font-serif text-3xl md:text-5xl leading-tight mb-6">{b.title}</h3>
              <a href="#" className="inline-block btn-primary">{b.cta}</a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function MentorPicks() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
        <h2 className="section-title mb-10">SHOP FROM YOUR MENTOR'S COLLECTION</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {mentorPicks.map((m) => (
            <a href="#" key={m.name} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="text-center py-5">
                <h3 className="font-serif text-2xl mb-3 uppercase tracking-wide">{m.name}</h3>
                <span className="inline-block text-[11px] uppercase tracking-[0.2em] underline underline-offset-4">Shop Now</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StudioBookings() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3">
      {studioBookings.map((s, idx) => (
        <div key={idx} className="relative aspect-[3/4] md:aspect-[3/4] overflow-hidden">
          <img src={s.image} alt={s.heading} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-end text-center text-white p-8 md:p-12">
            <p className="text-[12px] uppercase tracking-[0.2em] mb-3">{s.line1}</p>
            <h3 className="font-serif text-3xl md:text-4xl mb-2">{s.heading}</h3>
            <p className="text-sm mb-6 opacity-90">{s.sub}</p>
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="btn-outline">{s.cta}</a>
          </div>
        </div>
      ))}
    </section>
  );
}

export function Marquee() {
  const text = "India's First Prop Store";
  const items = Array.from({ length: 20 }, () => text);
  return (
    <section className="bg-neutral-900 text-white py-6 overflow-hidden">
      <div className="flex marquee-track">
        <div className="flex shrink-0">
          {items.map((t, i) => (
            <span key={i} className="px-6 font-serif text-2xl tracking-wide">{t}</span>
          ))}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {items.map((t, i) => (
            <span key={`d-${i}`} className="px-6 font-serif text-2xl tracking-wide">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stores() {
  return (
    <section className="py-14 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {stores.map((s) => (
          <div key={s.name} className="bg-white">
            <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="pt-6">
              <h3 className="font-serif text-2xl mb-3">{s.name}</h3>
              <p className="text-sm text-neutral-700 leading-relaxed mb-3">{s.address}</p>
              <p className="text-sm"><span className="font-medium">Call us:</span> {s.phone}</p>
              <p className="text-xs text-neutral-500 mt-1">{s.extra}</p>
              <p className="text-sm text-neutral-700 mt-3">{s.hours}</p>
              <div className="flex items-center gap-3 mt-5">
                <a href={`tel:${s.phone.replace(/[^0-9+]/g, '')}`} className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white flex items-center justify-center transition-colors" aria-label="call"><Phone size={16}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white flex items-center justify-center transition-colors" aria-label="video"><Video size={16}/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white flex items-center justify-center transition-colors" aria-label="map"><MapPin size={16}/></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-neutral-300">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-serif text-2xl text-white mb-4">Madras Prop Store</h3>
          <p className="text-sm leading-relaxed">Handcrafted & handpicked photography props at premium finish, affordable pricing. India's first prop store.</p>
          <div className="flex items-center gap-3 mt-5">
            <a href="https://www.instagram.com/madras_prop_store/" target="_blank" rel="noreferrer" className="hover:text-white" aria-label="instagram"><Instagram size={18}/></a>
            <a href="#" className="hover:text-white" aria-label="facebook"><Facebook size={18}/></a>
            <a href="#" className="hover:text-white" aria-label="youtube"><Youtube size={18}/></a>
          </div>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase tracking-[0.16em] mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Apparels</a></li>
            <li><a href="#" className="hover:text-white">Props</a></li>
            <li><a href="#" className="hover:text-white">Studio Backdrops</a></li>
            <li><a href="#" className="hover:text-white">Themes</a></li>
            <li><a href="#" className="hover:text-white">Imported Collection</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase tracking-[0.16em] mb-4">Information</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Meet Our Founder</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white">Refund Policy</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase tracking-[0.16em] mb-4">Newsletter</h4>
          <p className="text-sm mb-3">Subscribe to get updates on new launches & exclusive offers.</p>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} className="flex">
            <input type="email" required placeholder="Your email" className="flex-1 bg-transparent border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-white" />
            <button type="submit" className="bg-white text-neutral-900 px-4 text-xs uppercase tracking-[0.16em]">Join</button>
          </form>
          <div className="flex items-center gap-2 mt-5 text-xs">
            <Mail size={14}/> info@madraspropstore.com
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-5">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Madras Prop Store. All rights reserved.</p>
          <p>Crafted with love in Chennai, India.</p>
        </div>
      </div>
    </footer>
  );
}
