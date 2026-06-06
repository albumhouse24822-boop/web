import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminMe, auth, fetchSiteConfig, adminUpdateSiteConfig, fetchProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, fetchThemes, adminCreateTheme, adminUpdateTheme, adminDeleteTheme, fetchBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from '../api';
import { LogOut, Save, Plus, Trash2, Edit3, ExternalLink, Image as ImageIcon, Palette } from 'lucide-react';

const TABS = ['Site & Brand', 'Products', 'Themes', 'Banners'];

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
    setSaving(true);
    setMsg('');
    try {
      await adminUpdateSiteConfig(cfg);
      setMsg('Saved!');
      setTimeout(() => setMsg(''), 2500);
    } catch (e) {
      setMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
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

function EmptyForm() {
  return null;
}

function ProductsTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await fetchProducts());
  useEffect(() => { load(); }, []);

  const blank = { name: '', tag: 'Made to Order', sale: false, price: 0, regularPrice: null, save: '', image: '', hover: '', category: 'new-arrivals', description: '', order: 0 };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editing };
      if (payload.regularPrice === '' || payload.regularPrice === null) payload.regularPrice = null;
      else payload.regularPrice = Number(payload.regularPrice);
      payload.price = Number(payload.price);
      payload.order = Number(payload.order || 0);
      if (editing.id) await adminUpdateProduct(editing.id, payload);
      else await adminCreateProduct(payload);
      setEditing(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await adminDeleteProduct(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{items.length} products</p>
        <button onClick={() => setEditing(blank)} className="btn-primary"><Plus size={16}/> New product</button>
      </div>

      {editing && (
        <div className="admin-card">
          <h3 className="font-display text-xl mb-4">{editing.id ? 'Edit' : 'New'} product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="admin-label">Name</label><input className="admin-input" value={editing.name} onChange={(e) => setEditing({...editing, name: e.target.value})} /></div>
            <div><label className="admin-label">Tag (Made to Order / Ready to Ship / Sold Out)</label><input className="admin-input" value={editing.tag || ''} onChange={(e) => setEditing({...editing, tag: e.target.value})} /></div>
            <div><label className="admin-label">Category</label>
              <select className="admin-input" value={editing.category} onChange={(e) => setEditing({...editing, category: e.target.value})}>
                <option value="new-arrivals">New Arrivals</option>
                <option value="ready-themes">Ready-made themes</option>
                <option value="baby">Baby</option>
                <option value="maternity">Maternity</option>
              </select>
            </div>
            <div><label className="admin-label">Price (₹)</label><input type="number" className="admin-input" value={editing.price} onChange={(e) => setEditing({...editing, price: e.target.value})} /></div>
            <div><label className="admin-label">Regular Price (₹) — optional</label><input type="number" className="admin-input" value={editing.regularPrice || ''} onChange={(e) => setEditing({...editing, regularPrice: e.target.value})} /></div>
            <div><label className="admin-label">Save % (optional)</label><input className="admin-input" value={editing.save || ''} onChange={(e) => setEditing({...editing, save: e.target.value})} /></div>
            <div>
              <label className="admin-label inline-flex items-center gap-2"><input type="checkbox" checked={!!editing.sale} onChange={(e) => setEditing({...editing, sale: e.target.checked})} /> On Sale</label>
            </div>
            <div className="md:col-span-2"><label className="admin-label">Image URL</label><input className="admin-input" value={editing.image} onChange={(e) => setEditing({...editing, image: e.target.value})} /></div>
            <div className="md:col-span-2"><label className="admin-label">Hover image URL (optional)</label><input className="admin-input" value={editing.hover || ''} onChange={(e) => setEditing({...editing, hover: e.target.value})} /></div>
            <div className="md:col-span-2"><label className="admin-label">Description</label><textarea rows={3} className="admin-input" value={editing.description || ''} onChange={(e) => setEditing({...editing, description: e.target.value})} /></div>
            <div><label className="admin-label">Display order</label><input type="number" className="admin-input" value={editing.order || 0} onChange={(e) => setEditing({...editing, order: e.target.value})} /></div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={save} className="btn-primary" disabled={saving}><Save size={16}/> {saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEditing(null)} className="text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p.id} className="admin-card !p-3">
            <div className="aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden mb-3">
              {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
            </div>
            <p className="text-sm font-medium line-clamp-2 min-h-[2.5em]">{p.name}</p>
            <p className="text-xs text-neutral-500 mt-1">₹{p.price} · {p.category}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => setEditing(p)} className="text-xs font-semibold flex items-center gap-1 text-[var(--ahps-primary)]"><Edit3 size={12}/> Edit</button>
              <button onClick={() => del(p.id)} className="text-xs font-semibold flex items-center gap-1 text-neutral-500 hover:text-[var(--ahps-primary)]"><Trash2 size={12}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemesTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => setItems(await fetchThemes());
  useEffect(() => { load(); }, []);

  const blank = { title: '', image: '', order: 0 };
  const save = async () => {
    const payload = { ...editing, order: Number(editing.order || 0) };
    if (editing.id) await adminUpdateTheme(editing.id, payload);
    else await adminCreateTheme(payload);
    setEditing(null);
    await load();
  };
  const del = async (id) => {
    if (!window.confirm('Delete this theme?')) return;
    await adminDeleteTheme(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{items.length} themes</p>
        <button onClick={() => setEditing(blank)} className="btn-primary"><Plus size={16}/> New theme</button>
      </div>

      {editing && (
        <div className="admin-card">
          <h3 className="font-display text-xl mb-4">{editing.id ? 'Edit' : 'New'} theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="admin-label">Title</label><input className="admin-input" value={editing.title} onChange={(e) => setEditing({...editing, title: e.target.value})} /></div>
            <div className="md:col-span-2"><label className="admin-label">Image URL</label><input className="admin-input" value={editing.image} onChange={(e) => setEditing({...editing, image: e.target.value})} /></div>
            <div><label className="admin-label">Order</label><input type="number" className="admin-input" value={editing.order || 0} onChange={(e) => setEditing({...editing, order: e.target.value})} /></div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={save} className="btn-primary"><Save size={16}/> Save</button>
            <button onClick={() => setEditing(null)} className="text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((t) => (
          <div key={t.id} className="admin-card !p-3">
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-3"><img src={t.image} alt={t.title} className="w-full h-full object-cover" /></div>
            <p className="text-sm font-medium">{t.title}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => setEditing(t)} className="text-xs font-semibold flex items-center gap-1 text-[var(--ahps-primary)]"><Edit3 size={12}/> Edit</button>
              <button onClick={() => del(t.id)} className="text-xs font-semibold flex items-center gap-1 text-neutral-500 hover:text-[var(--ahps-primary)]"><Trash2 size={12}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannersTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => setItems(await fetchBanners());
  useEffect(() => { load(); }, []);

  const blank = { type: 'hero', desktop: '', mobile: '', image: '', alt: '', tag: '', title: '', cta: '', order: 0 };
  const save = async () => {
    const payload = { ...editing, order: Number(editing.order || 0) };
    if (editing.id) await adminUpdateBanner(editing.id, payload);
    else await adminCreateBanner(payload);
    setEditing(null);
    await load();
  };
  const del = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    await adminDeleteBanner(id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{items.length} banners</p>
        <button onClick={() => setEditing(blank)} className="btn-primary"><Plus size={16}/> New banner</button>
      </div>

      {editing && (
        <div className="admin-card">
          <h3 className="font-display text-xl mb-4">{editing.id ? 'Edit' : 'New'} banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="admin-label">Type</label>
              <select className="admin-input" value={editing.type} onChange={(e) => setEditing({...editing, type: e.target.value})}>
                <option value="hero">Hero</option>
                <option value="promo">Promo</option>
              </select>
            </div>
            <div><label className="admin-label">Order</label><input type="number" className="admin-input" value={editing.order || 0} onChange={(e) => setEditing({...editing, order: e.target.value})} /></div>
            {editing.type === 'hero' ? (
              <>
                <div className="md:col-span-2"><label className="admin-label">Desktop image URL</label><input className="admin-input" value={editing.desktop || ''} onChange={(e) => setEditing({...editing, desktop: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="admin-label">Mobile image URL</label><input className="admin-input" value={editing.mobile || ''} onChange={(e) => setEditing({...editing, mobile: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="admin-label">Alt text</label><input className="admin-input" value={editing.alt || ''} onChange={(e) => setEditing({...editing, alt: e.target.value})} /></div>
              </>
            ) : (
              <>
                <div className="md:col-span-2"><label className="admin-label">Image URL</label><input className="admin-input" value={editing.image || ''} onChange={(e) => setEditing({...editing, image: e.target.value})} /></div>
                <div><label className="admin-label">Tag</label><input className="admin-input" value={editing.tag || ''} onChange={(e) => setEditing({...editing, tag: e.target.value})} /></div>
                <div><label className="admin-label">CTA label</label><input className="admin-input" value={editing.cta || ''} onChange={(e) => setEditing({...editing, cta: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="admin-label">Title</label><input className="admin-input" value={editing.title || ''} onChange={(e) => setEditing({...editing, title: e.target.value})} /></div>
              </>
            )}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={save} className="btn-primary"><Save size={16}/> Save</button>
            <button onClick={() => setEditing(null)} className="text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((b) => (
          <div key={b.id} className="admin-card !p-3">
            <div className="aspect-[16/9] bg-neutral-100 rounded-lg overflow-hidden mb-3">
              {(b.desktop || b.image) && <img src={b.desktop || b.image} alt={b.title || b.alt} className="w-full h-full object-cover" />}
            </div>
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--ahps-primary)]">{b.type}</p>
            <p className="text-sm font-medium line-clamp-1">{b.title || b.alt || '(no title)'}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => setEditing(b)} className="text-xs font-semibold flex items-center gap-1 text-[var(--ahps-primary)]"><Edit3 size={12}/> Edit</button>
              <button onClick={() => del(b.id)} className="text-xs font-semibold flex items-center gap-1 text-neutral-500 hover:text-[var(--ahps-primary)]"><Trash2 size={12}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [me, setMe] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    adminMe().then(setMe).catch(() => {
      auth.clear();
      nav('/admin', { replace: true });
    });
  }, [nav]);

  const logout = () => { auth.clear(); nav('/admin', { replace: true }); };

  if (!me) return null;

  return (
    <div className="admin-shell">
      <header className="bg-white border-b border-neutral-200">
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
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8 flex items-center gap-1">
          {TABS.map((t, idx) => (
            <button
              key={t}
              onClick={() => setTab(idx)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === idx ? 'border-[var(--ahps-primary)] text-[var(--ahps-primary)]' : 'border-transparent text-neutral-600 hover:text-[var(--ahps-text)]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        {tab === 0 && <SiteAndBrandTab />}
        {tab === 1 && <ProductsTab />}
        {tab === 2 && <ThemesTab />}
        {tab === 3 && <BannersTab />}
      </main>
    </div>
  );
}
