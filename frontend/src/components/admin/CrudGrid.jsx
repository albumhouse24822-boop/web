import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Edit3 } from 'lucide-react';

// Generic CRUD list+edit grid used by simple entities
export default function CrudGrid({
  title,
  loadAll,
  blank,
  create,
  update,
  remove,
  fields,
  renderCard,
}) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const refresh = React.useCallback(async () => setItems(await loadAll()), [loadAll]);
  useEffect(() => { refresh(); }, [refresh]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...editing };
      fields.forEach((f) => {
        if (f.type === 'number') payload[f.k] = Number(payload[f.k] || 0);
        if (f.type === 'checkbox') payload[f.k] = Boolean(payload[f.k]);
      });
      if (editing.id) await update(editing.id, payload);
      else await create(payload);
      setEditing(null);
      await refresh();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${title.toLowerCase()}?`)) return;
    await remove(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{items.length} {title.toLowerCase()}</p>
        <button onClick={() => setEditing({ ...blank })} className="btn-primary"><Plus size={16}/> New {title}</button>
      </div>

      {editing && (
        <div className="admin-card">
          <h3 className="font-display text-xl mb-4">{editing.id ? 'Edit' : 'New'} {title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.k} className={f.full ? 'md:col-span-2' : ''}>
                <label className="admin-label">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea rows={f.rows || 3} className="admin-input" value={editing[f.k] || ''} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} />
                ) : f.type === 'select' ? (
                  <select className="admin-input" value={editing[f.k] || ''} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })}>
                    {f.options.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
                  </select>
                ) : f.type === 'checkbox' ? (
                  <label className="inline-flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={!!editing[f.k]} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.checked })} />
                    <span className="text-sm">{f.checkboxLabel || 'Enabled'}</span>
                  </label>
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    className="admin-input"
                    value={editing[f.k] === undefined || editing[f.k] === null ? '' : editing[f.k]}
                    onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={handleSave} className="btn-primary" disabled={saving}><Save size={16}/> {saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEditing(null)} className="text-sm font-semibold">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.id} className="admin-card !p-3">
            {renderCard(it)}
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => setEditing(it)} className="text-xs font-semibold flex items-center gap-1 text-[var(--ahps-primary)]"><Edit3 size={12}/> Edit</button>
              <button onClick={() => handleDelete(it.id)} className="text-xs font-semibold flex items-center gap-1 text-neutral-500 hover:text-[var(--ahps-primary)]"><Trash2 size={12}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
