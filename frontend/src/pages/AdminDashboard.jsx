import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  adminMe, auth,
  fetchSiteConfig, adminUpdateSiteConfig,
  fetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  fetchThemes, adminCreateTheme, adminUpdateTheme, adminDeleteTheme,
  fetchBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner,
  fetchReviews, adminCreateReview, adminUpdateReview, adminDeleteReview,
  fetchMentorPicks, adminCreateMentorPick, adminUpdateMentorPick, adminDeleteMentorPick,
  fetchStudioBookings, adminCreateStudioBooking, adminUpdateStudioBooking, adminDeleteStudioBooking,
  fetchStores, adminCreateStore, adminUpdateStore, adminDeleteStore,
} from '../api';
import { LogOut, Save, Plus, Trash2, Edit3, ExternalLink, Palette } from 'lucide-react';
import CrudGrid from '../components/admin/CrudGrid';
import NavigationTab from '../components/admin/NavigationTab';

const TABS = ['Brand & Colors', 'Navigation', 'Products', 'Themes', 'Banners', 'Mentor Picks', 'Studios', 'Stores', 'Reviews'];

// ------------- Brand & Colors -------------
function SiteAndBrandTab() {
  const [cfg, setCfg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchSiteConfig().then(setCfg); }, []);
  if (!cfg) return <p className="text-sm text-neutral-500">Loading…</p>;

  const update = (k, v) => setCfg({ ...cfg, [k]: v });
  const updateAnnouncement = (idx, v) => {
    const list = [...(cfg.announcements || [])];
    list[idx] = v;
    setCfg({ ...cfg, announcements: list });
  };
  const addAnnouncement = () => setCfg({ ...cfg, announcements: [...(cfg.announcements || []), 'New announcement'] });
  const removeAnnouncement = (idx) => setCfg({ ...cfg, announcements: cfg.announcements.filter((_, i) => i !== idx) });

  const save = async () => {
    setSaving(true); setMsg('');
    try { await adminUpdateSiteConfig(cfg); setMsg('Saved!'); setTimeout(() => setMsg(''), 2500); }
    catch { setMsg('Failed to save.'); }
    finally { setSaving(false); }
  };

  const colorFields = [
    { k: 'primaryColor', label: 'Primary (buttons, highlights)' },
    { k: 'secondaryColor', label: 'Secondary (CTAs)' },
    { k: 'accentColor', label: 'Accent (badges)' },
    { k: 'creamColor', label: 'Background cream' },
    { k: 'textColor', label: 'Text & dark surfaces' },
  ];

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h3 className="font-display text-xl mb-4">Brand</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="admin-label">Brand name</label><input className="admin-input" value={cfg.brand} onChange={(e) => update('brand', e.target.value)} /></div>
          <div><label className="admin-label">Email</label><input className="admin-input" value={cfg.email || ''} onChange={(e) => update('email', e.target.value)} /></div>
          <div className="md:col-span-2"><label className="admin-label">Tagline</label><input className="admin-input" value={cfg.tagline || ''} onChange={(e) => update('tagline', e.target.value)} /></div>
          <div className="md:col-span-2"><label className="admin-label">Hero subtext</label><input className="admin-input" value={cfg.heroSubText || ''} onChange={(e) => update('heroSubText', e.target.value)} /></div>
          <div className="md:col-span-2"><label className="admin-label">About text (footer)</label><textarea rows={3} className="admin-input" value={cfg.aboutText || ''} onChange={(e) => update('aboutText', e.target.value)} /></div>
          <div className="md:col-span-2"><label className="admin-label">Instagram URL</label><input className="admin-input" value={cfg.instagram || ''} onChange={(e) => update('instagram', e.target.value)} /></div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="font-display text-xl mb-4 flex items-center gap-2"><Palette size={18}/> Theme Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colorFields.map(f => (
            <div key={f.k}>
              <label className="admin-label">{f.label}</label>
              <div className="flex items-center gap-3">
                <input type="color" value={cfg[f.k]} onChange={(e) => update(f.k, e.target.value)} className="w-12 h-10 rounded-lg border border-neutral-300" />
                <input className="admin-input" value={cfg[f.k]} onChange={(e) => update(f.k, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h3 className="font-display text-xl mb-4">Announcement bar</h3>
        <div className="space-y-2">
          {(cfg.announcements || []).map((a, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input className="admin-input" value={a} onChange={(e) => updateAnnouncement(idx, e.target.value)} />
              <button onClick={() => removeAnnouncement(idx)} className="p-2 text-neutral-500 hover:text-[var(--ahps-primary)]"><Trash2 size={16}/></button>
            </div>
          ))}
          <button onClick={addAnnouncement} className="text-sm font-semibold inline-flex items-center gap-1.5 text-[var(--ahps-primary)]"><Plus size={14}/> Add</button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} className="btn-primary" disabled={saving}><Save size={16}/> {saving ? 'Saving…' : 'Save all changes'}</button>
        {msg && <span className="text-sm font-semibold text-[var(--ahps-primary)]">{msg}</span>}
      </div>
    </div>
  );
}

// ------------- Products tab -------------
function ProductsTab() {
  const productFields = [
    { k: 'name', label: 'Name', full: true },
    { k: 'tag', label: 'Tag (Made to Order / Ready to Ship / Sold Out)' },
    { k: 'category', label: 'Category', type: 'select', options: [
      { v: 'new-arrivals', label: 'New Arrivals' },
      { v: 'ready-themes', label: 'Ready-made themes' },
      { v: 'baby', label: 'Baby' },
      { v: 'maternity', label: 'Maternity' },
    ]},
    { k: 'price', label: 'Price (₹)', type: 'number' },
    { k: 'regularPrice', label: 'Regular Price (₹) — optional', type: 'number' },
    { k: 'save', label: 'Save % (optional, e.g. 30%)' },
    { k: 'sale', label: 'Mark as on Sale', type: 'checkbox', checkboxLabel: 'On sale' },
    { k: 'image', label: 'Image URL', full: true },
    { k: 'hover', label: 'Hover image URL (optional)', full: true },
    { k: 'description', label: 'Description', type: 'textarea', full: true },
    { k: 'order', label: 'Display order', type: 'number' },
  ];
  const blank = { name: '', tag: 'Made to Order', sale: false, price: 0, regularPrice: null, save: '', image: '', hover: '', category: 'new-arrivals', description: '', order: 0 };
  return (
    <CrudGrid
      title="Product"
      loadAll={() => fetchProducts()}
      blank={blank}
      create={adminCreateProduct}
      update={adminUpdateProduct}
      remove={adminDeleteProduct}
      fields={productFields}
      renderCard={(p) => (
        <>
          <div className="aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden mb-3">
            {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
          </div>
          <p className="text-sm font-medium line-clamp-2 min-h-[2.5em]">{p.name}</p>
          <p className="text-xs text-neutral-500 mt-1">₹{p.price} · {p.category}</p>
        </>
      )}
    />
  );
}

// ------------- Themes tab -------------
function ThemesTab() {
  const fields = [
    { k: 'title', label: 'Title', full: true },
    { k: 'image', label: 'Image URL', full: true },
    { k: 'order', label: 'Order', type: 'number' },
  ];
  return (
    <CrudGrid
      title="Theme"
      loadAll={fetchThemes}
      blank={{ title: '', image: '', order: 0 }}
      create={adminCreateTheme}
      update={adminUpdateTheme}
      remove={adminDeleteTheme}
      fields={fields}
      renderCard={(t) => (
        <>
          <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-3"><img src={t.image} alt={t.title} className="w-full h-full object-cover" /></div>
          <p className="text-sm font-medium">{t.title}</p>
        </>
      )}
    />
  );
}

// ------------- Banners tab -------------
function BannersTab() {
  const fields = [
    { k: 'type', label: 'Type', type: 'select', options: [{ v: 'hero', label: 'Hero' }, { v: 'promo', label: 'Promo' }] },
    { k: 'order', label: 'Order', type: 'number' },
    { k: 'desktop', label: 'Desktop image URL (hero)', full: true },
    { k: 'mobile', label: 'Mobile image URL (hero)', full: true },
    { k: 'image', label: 'Image URL (promo)', full: true },
    { k: 'alt', label: 'Alt text', full: true },
    { k: 'tag', label: 'Tag (promo)' },
    { k: 'title', label: 'Title' },
    { k: 'cta', label: 'CTA label' },
  ];
  return (
    <CrudGrid
      title="Banner"
      loadAll={() => fetchBanners()}
      blank={{ type: 'hero', desktop: '', mobile: '', image: '', alt: '', tag: '', title: '', cta: '', order: 0 }}
      create={adminCreateBanner}
      update={adminUpdateBanner}
      remove={adminDeleteBanner}
      fields={fields}
      renderCard={(b) => (
        <>
          <div className="aspect-[16/9] bg-neutral-100 rounded-lg overflow-hidden mb-3">
            {(b.desktop || b.image) && <img src={b.desktop || b.image} alt={b.title || b.alt} className="w-full h-full object-cover" />}
          </div>
          <p className="text-xs uppercase tracking-wider font-semibold text-[var(--ahps-primary)]">{b.type}</p>
          <p className="text-sm font-medium line-clamp-1">{b.title || b.alt || '(no title)'}</p>
        </>
      )}
    />
  );
}

// ------------- Mentor picks tab -------------
function MentorPicksTab() {
  const fields = [
    { k: 'name', label: 'Mentor name', full: true },
    { k: 'image', label: 'Image URL', full: true },
    { k: 'href', label: 'Link (where it opens)' },
    { k: 'order', label: 'Order', type: 'number' },
  ];
  return (
    <CrudGrid
      title="Mentor pick"
      loadAll={fetchMentorPicks}
      blank={{ name: '', image: '', href: '/shop', order: 0 }}
      create={adminCreateMentorPick}
      update={adminUpdateMentorPick}
      remove={adminDeleteMentorPick}
      fields={fields}
      renderCard={(m) => (
        <>
          <div className="aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden mb-3"><img src={m.image} alt={m.name} className="w-full h-full object-cover" /></div>
          <p className="text-sm font-medium">{m.name}</p>
        </>
      )}
    />
  );
}

// ------------- Studio bookings tab -------------
function StudiosTab() {
  const fields = [
    { k: 'heading', label: 'Heading', full: true },
    { k: 'line1', label: 'Top line (e.g. "Book our Studios today")' },
    { k: 'sub', label: 'Sub line' },
    { k: 'cta', label: 'CTA label' },
    { k: 'whatsapp', label: 'WhatsApp number (with country code, e.g. 917358115580)' },
    { k: 'image', label: 'Image URL', full: true },
    { k: 'order', label: 'Order', type: 'number' },
  ];
  return (
    <CrudGrid
      title="Studio booking"
      loadAll={fetchStudioBookings}
      blank={{ line1: '', heading: '', sub: '', cta: 'Book Now', image: '', whatsapp: '', order: 0 }}
      create={adminCreateStudioBooking}
      update={adminUpdateStudioBooking}
      remove={adminDeleteStudioBooking}
      fields={fields}
      renderCard={(s) => (
        <>
          <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden mb-3"><img src={s.image} alt={s.heading} className="w-full h-full object-cover" /></div>
          <p className="text-sm font-medium">{s.heading}</p>
          <p className="text-xs text-neutral-500">{s.line1}</p>
        </>
      )}
    />
  );
}

// ------------- Stores tab -------------
function StoresTab() {
  const fields = [
    { k: 'name', label: 'Store name', full: true },
    { k: 'address', label: 'Address', type: 'textarea', full: true },
    { k: 'phone', label: 'Phone (with country code)' },
    { k: 'extra', label: 'Extra note (optional)' },
    { k: 'hours', label: 'Opening hours', full: true },
    { k: 'image', label: 'Image URL', full: true },
  ];
  return (
    <CrudGrid
      title="Store"
      loadAll={fetchStores}
      blank={{ name: '', image: '', address: '', phone: '', extra: '', hours: '' }}
      create={adminCreateStore}
      update={adminUpdateStore}
      remove={adminDeleteStore}
      fields={fields}
      renderCard={(s) => (
        <>
          <div className="aspect-[16/9] bg-neutral-100 rounded-lg overflow-hidden mb-3"><img src={s.image} alt={s.name} className="w-full h-full object-cover" /></div>
          <p className="text-sm font-medium line-clamp-1">{s.name}</p>
          <p className="text-xs text-neutral-500 line-clamp-1">{s.phone}</p>
        </>
      )}
    />
  );
}

// ------------- Reviews tab -------------
function ReviewsTab() {
  const fields = [
    { k: 'title', label: 'Review title', full: true },
    { k: 'body', label: 'Review body', type: 'textarea', full: true },
    { k: 'author', label: 'Author name' },
    { k: 'date', label: 'Date (MM/DD/YYYY)' },
    { k: 'stars', label: 'Stars (1–5)', type: 'number' },
    { k: 'product', label: 'Product name (which product is this for)', full: true },
  ];
  return (
    <CrudGrid
      title="Review"
      loadAll={fetchReviews}
      blank={{ title: '', body: '', author: '', date: '', stars: 5, product: '' }}
      create={adminCreateReview}
      update={adminUpdateReview}
      remove={adminDeleteReview}
      fields={fields}
      renderCard={(r) => (
        <>
          <div className="flex items-center gap-1 text-[var(--ahps-accent)] mb-2 text-xs">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
          <p className="text-sm font-medium line-clamp-1">{r.title}</p>
          <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{r.body}</p>
          <p className="text-[11px] text-neutral-400 mt-1">— {r.author}</p>
        </>
      )}
    />
  );
}

// ============= Dashboard =============
export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [me, setMe] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    adminMe().then(setMe).catch(() => { auth.clear(); nav('/admin', { replace: true }); });
  }, [nav]);

  const logout = () => { auth.clear(); nav('/admin', { replace: true }); };

  if (!me) return null;

  const tabComponents = [
    SiteAndBrandTab, NavigationTab, ProductsTab, ThemesTab, BannersTab,
    MentorPicksTab, StudiosTab, StoresTab, ReviewsTab,
  ];
  const ActiveTab = tabComponents[tab];

  return (
    <div className="admin-shell">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold" style={{ background: 'var(--ahps-primary)', color: '#fff' }}>A</div>
            <div>
              <p className="font-display text-lg leading-tight">Album House CMS</p>
              <p className="text-[11px] uppercase tracking-wider text-neutral-500">Welcome, {me.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs font-semibold flex items-center gap-1.5 text-neutral-700 hover:text-[var(--ahps-primary)]"><ExternalLink size={14}/> Open store</Link>
            <button onClick={logout} className="text-xs font-semibold flex items-center gap-1.5 text-neutral-700 hover:text-[var(--ahps-primary)]"><LogOut size={14}/> Logout</button>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((t, idx) => (
            <button
              key={t}
              onClick={() => setTab(idx)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === idx ? 'border-[var(--ahps-primary)] text-[var(--ahps-primary)]' : 'border-transparent text-neutral-600 hover:text-[var(--ahps-text)]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        <ActiveTab />
      </main>
    </div>
  );
}
