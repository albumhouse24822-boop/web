import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchNavigation, adminCreateNav, adminUpdateNav, adminDeleteNav } from '../../api';

function EditableColumn({ column, onChange, onRemove }) {
  const updateItem = (idx, key, val) => {
    const next = { ...column };
    next.items = column.items.map((it, i) => i === idx ? { ...it, [key]: val } : it);
    onChange(next);
  };
  const addItem = () => onChange({ ...column, items: [...(column.items || []), { label: 'New link', href: '/shop' }] });
  const removeItem = (idx) => onChange({ ...column, items: column.items.filter((_, i) => i !== idx) });

  return (
    <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
      <div className="flex items-center gap-2 mb-3">
        <input className="admin-input !py-1.5 font-semibold text-sm" placeholder="Column title (e.g. 'Popular')" value={column.title} onChange={(e) => onChange({ ...column, title: e.target.value })} />
        <button onClick={onRemove} className="p-1.5 text-neutral-500 hover:text-[var(--ahps-primary)]" title="Delete column"><Trash2 size={14}/></button>
      </div>
      <div className="space-y-2">
        {(column.items || []).map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input className="admin-input !py-1.5 text-sm" placeholder="Label" value={it.label} onChange={(e) => updateItem(idx, 'label', e.target.value)} />
            <input className="admin-input !py-1.5 text-sm" placeholder="/shop?q=..." value={it.href} onChange={(e) => updateItem(idx, 'href', e.target.value)} />
            <button onClick={() => removeItem(idx)} className="p-1.5 text-neutral-500 hover:text-[var(--ahps-primary)]"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
      <button onClick={addItem} className="mt-2 text-xs font-semibold inline-flex items-center gap-1.5 text-[var(--ahps-primary)]"><Plus size={12}/> Add link</button>
    </div>
  );
}

function CategoryEditor({ value, onChange, onSave, onCancel, saving }) {
  const updateColumn = (idx, col) => {
    onChange({ ...value, columns: value.columns.map((c, i) => i === idx ? col : c) });
  };
  const addColumn = () => onChange({ ...value, columns: [...(value.columns || []), { title: 'New section', items: [] }] });
  const removeColumn = (idx) => onChange({ ...value, columns: value.columns.filter((_, i) => i !== idx) });

  return (
    <div className="admin-card">
      <h3 className="font-display text-xl mb-4">{value.id ? 'Edit' : 'New'} top-nav category</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div><label className="admin-label">Label</label><input className="admin-input" value={value.label} onChange={(e) => onChange({ ...value, label: e.target.value })} /></div>
        <div><label className="admin-label">Link (href)</label><input className="admin-input" value={value.href} onChange={(e) => onChange({ ...value, href: e.target.value })} /></div>
        <div><label className="admin-label">Display order</label><input type="number" className="admin-input" value={value.order} onChange={(e) => onChange({ ...value, order: Number(e.target.value) || 0 })} /></div>
        <div>
          <label className="admin-label">Highlight (special color)</label>
          <label className="inline-flex items-center gap-2 mt-2">
            <input type="checkbox" checked={!!value.highlight} onChange={(e) => onChange({ ...value, highlight: e.target.checked })} />
            <span className="text-sm">Mark as highlight (e.g. AI Stylist)</span>
          </label>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display text-lg">Dropdown columns</h4>
          <button onClick={addColumn} className="text-xs font-semibold inline-flex items-center gap-1.5 text-[var(--ahps-primary)]"><Plus size={12}/> Add column</button>
        </div>
        <div className="space-y-3">
          {(value.columns || []).map((c, idx) => (
            <EditableColumn key={idx} column={c} onChange={(c2) => updateColumn(idx, c2)} onRemove={() => removeColumn(idx)} />
          ))}
          {(!value.columns || value.columns.length === 0) && (
            <p className="text-sm text-neutral-500">No dropdown columns. The label will be a simple clickable link.</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={onSave} className="btn-primary" disabled={saving}><Save size={16}/> {saving ? 'Saving…' : 'Save'}</button>
        <button onClick={onCancel} className="text-sm font-semibold">Cancel</button>
      </div>
    </div>
  );
}

export default function NavigationTab() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(null);

  const refresh = async () => setItems(await fetchNavigation());
  useEffect(() => { refresh(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        label: editing.label,
        href: editing.href,
        highlight: !!editing.highlight,
        order: Number(editing.order || 0),
        columns: editing.columns || [],
      };
      if (editing.id) await adminUpdateNav(editing.id, payload);
      else await adminCreateNav(payload);
      setEditing(null);
      await refresh();
    } finally { setSaving(false); }
  };
  const del = async (id) => {
    if (!window.confirm('Delete this category from top nav?')) return;
    await adminDeleteNav(id);
    await refresh();
  };

  const blank = { label: '', href: '/shop', highlight: false, order: items.length + 1, columns: [] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{items.length} top-nav categories. Re-order via the order field.</p>
        <button onClick={() => setEditing(blank)} className="btn-primary"><Plus size={16}/> New category</button>
      </div>

      {editing && (
        <CategoryEditor
          value={editing}
          onChange={setEditing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      <div className="space-y-3">
        {items.map((n, idx) => (
          <div key={n.id} className="admin-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--ahps-soft)] text-[var(--ahps-text)] flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                <div>
                  <p className="font-semibold">{n.label}{n.highlight && <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--ahps-primary)]">Highlight</span>}</p>
                  <p className="text-xs text-neutral-500">{n.href}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(open === n.id ? null : n.id)} className="p-2 text-neutral-500" aria-label="toggle">
                  {open === n.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                <button onClick={() => setEditing(n)} className="text-xs font-semibold flex items-center gap-1 text-[var(--ahps-primary)]"><Edit3 size={12}/> Edit</button>
                <button onClick={() => del(n.id)} className="text-xs font-semibold flex items-center gap-1 text-neutral-500 hover:text-[var(--ahps-primary)]"><Trash2 size={12}/> Delete</button>
              </div>
            </div>
            {open === n.id && n.columns && n.columns.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                {n.columns.map((c) => (
                  <div key={c.title}>
                    <p className="font-semibold text-xs uppercase tracking-wider text-[var(--ahps-primary)] mb-2">{c.title}</p>
                    <ul className="space-y-1 text-sm text-neutral-700">
                      {c.items.map((it) => <li key={it.label}>{it.label} <span className="text-neutral-400 text-xs">→ {it.href}</span></li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
