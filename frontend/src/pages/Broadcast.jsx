import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Icon } from '../components/Icons';

const festivalTemplates = [
  { name: 'Diwali', subject: 'Happy Diwali, {CustomerName}! Special Offer from Sarah Jewellers' },
  { name: 'Ramadan', subject: 'Ramadan Mubarak, {CustomerName}! Exclusive Jewellery Collection' },
  { name: 'Eid', subject: 'Eid Mubarak, {CustomerName}! Celebrate with Sarah Jewellers' },
  { name: 'Christmas', subject: 'Merry Christmas, {CustomerName}! Festive Jewellery Offers' },
  { name: 'New Year', subject: 'Happy New Year, {CustomerName}! New Collection at Sarah Jewellers' },
];

export default function Broadcast() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [customerCount, setCustomerCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    api.get('/customers').then(r => setCustomerCount(r.data.length));
  }, []);

  const applyTemplate = async (festival) => {
    const res = await api.get('/templates');
    const t = res.data.find(x => x.occasion === 'FESTIVAL' && x.festivalName === festival.name);
    if (t) {
      setSubject(t.subject);
      setBody(t.body);
    } else {
      setSubject(festival.subject);
      setBody(`<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #f0c040;border-radius:10px;">
  <h2 style="color:#c8a415;text-align:center;">${festival.name} Greetings, {CustomerName}!</h2>
  <p>Wishing you and your family a joyful ${festival.name}!</p>
  <p>Celebrate this special occasion with our exclusive jewellery collection. Enjoy <strong>{Offer}</strong> this festive season.</p>
  <br/>
  <p style="color:#888;">With warm wishes,<br/>The Sarah Jewellers Team</p>
</div>`);
    }
    toast.success(`${festival.name} template loaded`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/emails/upload-image', fd);
    const url = `http://localhost:8080${res.data.url}`;
    setImageUrl(url);
    setBody(prev => prev + `<br/><img src="${url}" alt="festival" style="max-width:100%;border-radius:8px;" />`);
    toast.success('Image added');
  };

  const handleSend = async () => {
    if (!subject || !body) { toast.error('Subject and body are required'); return; }
    if (!window.confirm(`Send this email to all ${customerCount} customers?`)) return;
    setSending(true);
    try {
      await api.post('/emails/broadcast', { subject, body });
      toast.success(`Broadcast sent to ${customerCount} customers`);
      setSubject(''); setBody(''); setImageUrl('');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Broadcast failed');
    }
    setSending(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Festival Broadcast</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Send to all {customerCount} customers</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>Quick Festival Templates</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {festivalTemplates.map(f => (
                <button key={f.name} className="btn btn-outline" style={{ padding: '6px 14px' }} onClick={() => applyTemplate(f)}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="form-group">
              <label>Subject *</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject..." />
            </div>
            <div className="form-group">
              <label>Body (HTML) *</label>
              <textarea rows={12} value={body} onChange={e => setBody(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 13 }} placeholder="Write your email HTML here..." />
            </div>
            <div className="form-group">
              <label>Attach Image / GIF</label>
              <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <Icon name="upload" size={14} color="currentColor" />
                Upload Image
                <input type="file" accept="image/*,.gif" hidden onChange={handleImageUpload} />
              </label>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: 12, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onClick={handleSend}
              disabled={sending}
            >
              <Icon name="broadcast" size={16} color="white" />
              {sending ? 'Sending...' : `Send to All ${customerCount} Customers`}
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>Live Preview</h3>
          {body ? (
            <div
              style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 16, background: '#fafafa' }}
              dangerouslySetInnerHTML={{ __html: body.replace(/{CustomerName}/g, 'Priya').replace(/{Offer}/g, '15% OFF') }}
            />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 40, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--cream-dark)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon name="mail" size={20} color="var(--text-muted)" />
              </div>
              Select a template or write your email to see a preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
