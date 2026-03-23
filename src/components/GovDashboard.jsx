import { useState } from 'react'
import { DB } from '../lib/db'
import { SECTOR_ICONS, STATUS_COLOR } from '../lib/constants'

export default function GovDashboard({ posts, refreshPosts, showToast }) {
  const [selected, setSelected]   = useState(null)
  const [filterStatus, setFilter] = useState('All')
  const [resp, setResp]           = useState({ message: '', budget: '', company: '', expected_days: 7, progress: 0, status: 'In Review' })
  const [busy, setBusy]           = useState(false)

  const filtered = posts
    .filter(p => filterStatus === 'All' || p.status === filterStatus)
    .sort((a, b) => b.timestamp - a.timestamp)

  const stats = {
    total:      posts.length,
    pending:    posts.filter(p => p.status === 'Pending').length,
    inProgress: posts.filter(p => p.status === 'In Progress').length,
    completed:  posts.filter(p => p.status === 'Completed').length,
    complaints: posts.filter(p => p.complaint).length,
  }

  const fresh = selected ? posts.find(p => p.id === selected.id) || selected : null

  function openPost(p) {
    setSelected(p)
    setResp(p.govResponse
      ? { ...p.govResponse, status: p.status }
      : { message: '', budget: '', company: '', expected_days: 7, progress: 0, status: p.status }
    )
  }

  async function submitResponse() {
    if (!resp.message.trim()) { showToast('Add a response message', 'error'); return }
    setBusy(true)
    const grData = {
      message: resp.message, budget: resp.budget, company: resp.company,
      expected_days: Number(resp.expected_days), progress: Number(resp.progress),
      start_date: selected.govResponse?.start_date || Date.now(),
    }
    const [e1, e2] = await Promise.all([
      DB.upsertGovResponse(selected.id, grData),
      DB.updatePost(selected.id, { status: resp.status }),
    ])
    setBusy(false)
    if (e1 || e2) { showToast('Save failed', 'error'); return }
    await refreshPosts()
    showToast('Response saved ✓')
    setSelected(null)
  }

  /* ── Detail view ──────────────────────────────────────────────────────── */
  if (fresh) return (
    <div className="animate-in">
      <button className="btn-outline" style={{ marginBottom: 20 }} onClick={() => setSelected(null)}>← Back to Dashboard</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Left: complaint info */}
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 700, fontSize: 17 }}>Complaint Details</h3>
              <span className="status-badge" style={{ background: `${STATUS_COLOR[fresh.status]}20`, color: STATUS_COLOR[fresh.status] }}>{fresh.status}</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>{fresh.description}</p>
            {fresh.image && <img src={fresh.image} alt="issue" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }} />}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div><span style={{ color: '#64748b' }}>Sector: </span><span className="sector-pill" style={{ marginLeft: 4 }}>{SECTOR_ICONS[fresh.sector]} {fresh.sector}</span></div>
              <div><span style={{ color: '#64748b' }}>Location: </span>{fresh.location_name} — {fresh.location}</div>
              <div><span style={{ color: '#64748b' }}>Reported by: </span>{fresh.name} (@{fresh.username})</div>
              <div><span style={{ color: '#64748b' }}>Date: </span>{new Date(fresh.timestamp).toLocaleDateString('en-IN')}</div>
              <div><span style={{ color: '#64748b' }}>Upvotes: </span>{fresh.upvotes?.length || 0}</div>
              {fresh.complaint && <div style={{ color: '#ef4444', fontWeight: 600 }}>⚠️ Complaint raised by citizen</div>}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 12 }}>💬 Public Comments ({fresh.comments?.length || 0})</h4>
            {(fresh.comments || []).map(c => (
              <div key={c.id} style={{ background: '#0f1117', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>@{c.username}: </span>{c.text}
              </div>
            ))}
            {!fresh.comments?.length && <p style={{ color: '#64748b', fontSize: 13 }}>No comments.</p>}
          </div>
        </div>

        {/* Right: response form */}
        <div className="card" style={{ padding: 24, borderLeft: '3px solid #3b82f6', height: 'fit-content' }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: '#3b82f6', marginBottom: 18 }}>🏛️ Government Response</h3>

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Update Status</label>
          <select className="input" style={{ marginTop: 6, marginBottom: 16 }} value={resp.status} onChange={e => setResp(r => ({ ...r, status: e.target.value }))}>
            {Object.keys(STATUS_COLOR).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Response Message *</label>
          <textarea className="input" rows={3} style={{ marginTop: 6, marginBottom: 16, resize: 'vertical' }}
            placeholder="Describe government action taken…"
            value={resp.message} onChange={e => setResp(r => ({ ...r, message: e.target.value }))} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Budget Allocated</label>
              <input className="input" style={{ marginTop: 6 }} placeholder="₹0,00,000" value={resp.budget} onChange={e => setResp(r => ({ ...r, budget: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Expected Days</label>
              <input className="input" type="number" style={{ marginTop: 6 }} value={resp.expected_days} onChange={e => setResp(r => ({ ...r, expected_days: e.target.value }))} />
            </div>
          </div>

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Assigned Company / Dept.</label>
          <input className="input" style={{ marginTop: 6, marginBottom: 16 }} placeholder="BBMP / PMC / Corp name" value={resp.company} onChange={e => setResp(r => ({ ...r, company: e.target.value }))} />

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
            Work Progress: <strong style={{ color: '#3b82f6' }}>{resp.progress}%</strong>
          </label>
          <input type="range" min={0} max={100} step={5} style={{ width: '100%', marginTop: 6, marginBottom: 6, accentColor: '#3b82f6' }}
            value={resp.progress} onChange={e => setResp(r => ({ ...r, progress: Number(e.target.value) }))} />
          <div className="progress-bar" style={{ marginBottom: 20 }}>
            <div className="progress-fill" style={{ width: `${resp.progress}%` }} />
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={submitResponse} disabled={busy}>
            {busy ? <><span className="spinner" /> Saving…</> : '📤 Submit Response'}
          </button>
        </div>
      </div>
    </div>
  )

  /* ── List view ────────────────────────────────────────────────────────── */
  return (
    <div className="animate-in">
      <div style={{ marginBottom: 26 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700 }}>Government Dashboard</h2>
        <p style={{ color: '#64748b', marginTop: 4 }}>Citizen complaints — live from Supabase</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 26 }}>
        {[
          { label: 'Total',       value: stats.total,      color: '#3b82f6', icon: '📋' },
          { label: 'Pending',     value: stats.pending,    color: '#f59e0b', icon: '⏳' },
          { label: 'In Progress', value: stats.inProgress, color: '#8b5cf6', icon: '⚙️' },
          { label: 'Completed',   value: stats.completed,  color: '#10b981', icon: '✅' },
          { label: 'Complaints',  value: stats.complaints, color: '#ef4444', icon: '⚠️' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '18px 16px', borderTop: `3px solid ${s.color}`, textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['All', 'Pending', 'In Review', 'Work Initiated', 'In Progress', 'Completed', 'Rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', background: filterStatus === s ? '#3b82f6' : '#1a1d27', color: filterStatus === s ? '#fff' : '#94a3b8' }}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0f172a' }}>
              {['Complaint', 'Sector', 'Reporter', 'Date', 'Upvotes', 'Status', 'Complaint?', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e2535' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #1a1d27', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1a1d27'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 16px', fontSize: 13, maxWidth: 220 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div></td>
                <td style={{ padding: '12px 16px' }}><span className="tag" style={{ fontSize: 11 }}>{SECTOR_ICONS[p.sector]} {p.sector}</span></td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>@{p.username}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{new Date(p.timestamp).toLocaleDateString('en-IN')}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>👍 {p.upvotes?.length || 0}</td>
                <td style={{ padding: '12px 16px' }}><span className="status-badge" style={{ background: `${STATUS_COLOR[p.status]}20`, color: STATUS_COLOR[p.status], fontSize: 11 }}>{p.status}</span></td>
                <td style={{ padding: '12px 16px' }}>{p.complaint ? <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 600 }}>⚠️ Yes</span> : <span style={{ color: '#64748b', fontSize: 12 }}>—</span>}</td>
                <td style={{ padding: '12px 16px' }}><button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 8 }} onClick={() => openPost(p)}>Review →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: 32 }}>No complaints found.</p>}
      </div>
    </div>
  )
}
