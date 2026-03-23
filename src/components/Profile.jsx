import { useState } from 'react'
import { DB } from '../lib/db'

export default function Profile({ currentUser, posts, users, setUsers, showToast, logout }) {
  const mine = posts.filter(p => p.user_id === currentUser?.id)
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '', address: currentUser?.address || '' })
  const [busy, setBusy]       = useState(false)

  async function saveProfile() {
    setBusy(true)
    const err = await DB.updateUser(currentUser.id, form)
    setBusy(false)
    if (err) { showToast('Update failed', 'error'); return }
    setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...form } : u))
    setEditing(false)
    showToast('Profile updated!')
  }

  const fields = [
    { label: 'Full Name',      value: currentUser?.name,    field: 'name' },
    { label: 'Username',       value: '@' + currentUser?.username, field: null },
    { label: 'Aadhaar Number', value: currentUser?.aadhar?.replace(/(\d{4})-(\d{4})-(\d{4})/, 'XXXX-XXXX-$3'), field: null },
    { label: 'Phone',          value: currentUser?.phone    || 'Not added', field: 'phone' },
    { label: 'Address',        value: currentUser?.address  || 'Not added', field: 'address' },
  ]

  return (
    <div className="animate-in" style={{ maxWidth: 620, margin: '0 auto' }}>

      {/* Avatar + stats */}
      <div className="card" style={{ padding: 32, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, margin: '0 auto 14px' }}>
          {currentUser?.name?.charAt(0)}
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 24, fontWeight: 700 }}>{currentUser?.name}</h2>
        <p style={{ color: '#64748b', marginTop: 4 }}>@{currentUser?.username}</p>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 16 }}>
          {[
            { label: 'Reports',      value: mine.length },
            { label: 'Resolved',     value: mine.filter(p => p.status === 'Completed').length },
            { label: 'Upvotes Given',value: posts.reduce((a, p) => a + (p.upvotes?.includes(currentUser?.id) ? 1 : 0), 0) },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#3b82f6' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontWeight: 700, fontSize: 17 }}>Account Details</h3>
          <button className="btn-outline" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>

        {fields.map((d, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e2535' }}>
            <span style={{ fontSize: 13, color: '#64748b' }}>{d.label}</span>
            {editing && d.field
              ? <input className="input" style={{ width: 220, padding: '6px 10px', fontSize: 13 }} value={form[d.field]} onChange={e => setForm(f => ({ ...f, [d.field]: e.target.value }))} />
              : <span style={{ fontSize: 14, fontWeight: 500 }}>{d.value}</span>
            }
          </div>
        ))}

        {editing && (
          <button className="btn-primary" style={{ width: '100%', marginTop: 18 }} onClick={saveProfile} disabled={busy}>
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        )}
      </div>

      <button onClick={logout} style={{ width: '100%', padding: 13, background: '#ef444415', color: '#ef4444', border: '1.5px solid #ef44441a', borderRadius: 12, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
        ↩ Sign Out
      </button>
    </div>
  )
}
