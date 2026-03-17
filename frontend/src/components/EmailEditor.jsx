import React, { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Icon } from './Icons';

export default function EmailEditor({ draft, onClose, onSaved }) {
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [imageUrl, setImageUrl] = useState(draft.imagePath || '');
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('edit'); // 'edit' | 'preview'

  const handleSave = async () => {
    try {
      await api.put(`/emails/drafts/${draft.id}`, { subject, body });
      toast.success('Draft saved');
      onSaved();
    } catch { toast.error('Save failed'); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/emails/upload-image', fd);
      const url = `http://localhost:8080${res.data.url}`;
      setImageUrl(url);
      setBody(prev => prev + `<br/><img src="${url}" alt="promo" style="max-width:100%;border-radius:8px;margin-top:12px;" />`);
      toast.success('Image added to email');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Email — {draft.customer?.name}</h3>
          <button className="close-btn" onClick={onClose}>
            <Icon name="close" size={16} color="currentColor" />
          </button>
        </div>

        <div className="form-group">
          <label>Subject Line</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject..." />
        </div>

        <div style={{ display: 'flex', gap: 0, marginBottom: 12, border: '1.5px solid var(--border)', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
          {['edit', 'preview'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '7px 20px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: tab === t ? 'var(--maroon)' : 'white',
                color: tab === t ? 'white' : 'var(--text-muted)',
                fontFamily: 'Inter', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
              {t === 'edit'
                ? <><Icon name="edit" size={13} color={tab === t ? 'white' : 'var(--text-muted)'} /> Edit HTML</>
                : <><Icon name="eye" size={13} color={tab === t ? 'white' : 'var(--text-muted)'} /> Preview</>
              }
            </button>
          ))}
        </div>

        {tab === 'edit' ? (
          <div className="form-group">
            <textarea rows={12} value={body} onChange={e => setBody(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }} />
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 20, background: '#fafafa', minHeight: 200, marginBottom: 16 }}
            dangerouslySetInnerHTML={{ __html: body }} />
        )}

        <div className="form-group">
          <label>Attach Image / GIF</label>
          <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            {uploading
              ? <><Icon name="clock" size={14} color="currentColor" /> Uploading...</>
              : <><Icon name="upload" size={14} color="currentColor" /> Upload Image / GIF</>
            }
            <input type="file" accept="image/*,.gif" hidden onChange={handleImageUpload} disabled={uploading} />
          </label>
          {imageUrl && (
            <img src={imageUrl} alt="preview" style={{ display: 'block', marginTop: 10, maxHeight: 100, borderRadius: 8, border: '1px solid var(--border)' }} />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Icon name="check" size={14} color="white" /> Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
