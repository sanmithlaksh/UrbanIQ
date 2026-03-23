import { useState, useRef } from 'react'
import { DB } from '../lib/db'
import { SECTORS, SECTOR_ICONS } from '../lib/constants'

export default function ReportPost({ currentUser, refreshPosts, showToast, navigate }) {
  const [form, setForm]         = useState({ description: '', sector: '', image: null })
  const [location, setLocation] = useState(null)
  const [locName, setLocName]   = useState('')
  const [locating, setLocating] = useState(false)
  const [busy, setBusy]         = useState(false)
  const fileRef = useRef()

  function getLocation() {
    setLocating(true)
    navigator.geolocation?.getCurrentPosition(
      pos => {
        setLocation(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`)
        setLocName('Current Location (GPS)')
        setLocating(false)
      },
      () => {
        setLocation('12.9716° N, 77.5946° E')
        setLocName('Bengaluru, Karnataka (default)')
        setLocating(false)
      }
    )
  }

  function handleImage(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { showToast('Images only', 'error'); return }
    const reader = new FileReader()
    reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }))
    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    if (!form.description.trim()) { showToast('Add a description', 'error'); return }
    if (!form.sector)              { showToast('Select a sector', 'error'); return }
    if (!form.image)               { showToast('Upload a photo of the issue', 'error'); return }
    if (!location)                 { showToast('Get your location first', 'error'); return }

    setBusy(true)
    const post = {
      id: 'p' + Date.now(),
      user_id: currentUser.id, username: currentUser.username, name: currentUser.name,
      description: form.description, sector: form.sector, image: form.image,
      location, location_name: locName, timestamp: Date.now(),
      status: 'Pending', upvotes: [], complaint: false,
    }
    const err = await DB.createPost(post)
    setBusy(false)
    if (err) { showToast('Submit failed: ' + err.message, 'error'); return }
    await refreshPosts()
    showToast('Report submitted! Government will review soon 🙏')
    navigate('feed')
  }

  return (
    <div className="animate-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Report an Issue</h2>
      <p style={{ color: '#64748b', marginBottom: 26 }}>Document civic problems with photo evidence</p>

      <div className="card" style={{ padding: 28 }}>

        {/* Image upload */}
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: 8 }}>📸 Photo Evidence *</label>
          {form.image ? (
            <div style={{ position: 'relative' }}>
              <img src={form.image} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12 }} />
              <button onClick={() => setForm(f => ({ ...f, image: null }))}
                style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, fontSize: 14, cursor: 'pointer' }}>
                ×
              </button>
            </div>
          ) : (
            <div onClick={() => fileRef.current?.click()}
              style={{ border: '2px dashed #252836', borderRadius: 12, padding: 40, textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#252836'}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
              <p style={{ color: '#64748b', fontSize: 14 }}>Click to upload photo of the issue</p>
              <p style={{ color: '#475569', fontSize: 12, marginTop: 4 }}>Images only</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
        </div>

        {/* Description */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: 6 }}>📝 Description *</label>
          <textarea className="input" rows={4} style={{ resize: 'vertical' }}
            placeholder="Describe the civic issue in detail…"
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        {/* Sector */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: 6 }}>🏷️ Sector *</label>
          <select className="input" value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
            <option value="">Select Sector</option>
            {SECTORS.map(s => <option key={s} value={s}>{SECTOR_ICONS[s]} {s}</option>)}
          </select>
        </div>

        {/* Location */}
        <div style={{ marginBottom: 26 }}>
          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, display: 'block', marginBottom: 6 }}>📍 Location (Auto-detected) *</label>
          {location ? (
            <div style={{ background: '#0f172a', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#10b981' }}>
              ✓ {locName} <span style={{ color: '#64748b', marginLeft: 6 }}>{location}</span>
            </div>
          ) : (
            <button className="btn-outline" onClick={getLocation} disabled={locating} style={{ width: '100%' }}>
              {locating ? '📡 Detecting location…' : '📍 Get My Location'}
            </button>
          )}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: 14, fontSize: 16 }} onClick={handleSubmit} disabled={busy}>
          {busy ? <><span className="spinner" /> Submitting…</> : '🚀 Submit Report'}
        </button>
      </div>
    </div>
  )
}
