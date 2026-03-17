import React, { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Icon } from '../components/Icons';

const emptyForm = { occasion: 'BIRTHDAY', subject: '', body: '', festivalName: '' };

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);

  const load = () => api.get('/templates').then(r => setTemplates(r.data));
  useEffect(() => { load(); }, []);

  const openEdit = (t) => {
    setForm({ occasion: t.occasion, subject: t.subject, body: t.body, festivalName: t.festivalName || '' });
    setSelected(t);
    setShowModal(true);
  };

  const openAdd = () => { setForm(emptyForm); setSelected(null); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selected) await api.put(`/templates/${selected.id}`, form);
      else await api.post('/templates', form);
      toast.success('Template saved');
      setShowModal(false);
      load();
    } catch { toast.error('Save failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    await api.delete(`/templates/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Email Templates</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={14} color="white" /> New Template
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {templates.map(t => (
          <div key={t.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span className={`badge badge-${t.occasion?.toLowerCase()}`}>{t.occasion}{t.festivalName ? ` — ${t.festivalName}` : ''}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-outline" style={{ padding: '3px 10px' }} onClick={() => openEdit(t)}>Edit</button>
                <button className="btn btn-danger" style={{ padding: '3px 10px' }} onClick={() => handleDelete(t.id)}>Del</button>
              </div>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{t.subject}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Placeholders: <code>{'{CustomerName}'}</code> <code>{'{Offer}'}</code>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected ? 'Edit Template' : 'New Template'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <Icon name="close" size={16} color="currentColor" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Occasion</label>
                  <select value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}>
                    <option value="BIRTHDAY">Birthday</option>
                    <option value="ANNIVERSARY">Anniversary</option>
                    <option value="FESTIVAL">Festival</option>
                  </select>
                </div>
                {form.occasion === 'FESTIVAL' && (
                  <div className="form-group">
                    <label>Festival Name</label>
                    <input placeholder="e.g. Diwali, Ramadan" value={form.festivalName} onChange={e => setForm({ ...form, festivalName: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Body (HTML)</label>
                <textarea rows={10} required value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} style={{ fontFamily: 'monospace', fontSize: 13 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ marginBottom: 6 }}>Preview</label>
                <div style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 14, background: '#fafafa', minHeight: 60 }}
                  dangerouslySetInnerHTML={{ __html: form.body.replace('{CustomerName}', 'Priya').replace('{Offer}', '10% OFF') }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
