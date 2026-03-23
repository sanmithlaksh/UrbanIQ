import { SECTOR_ICONS, STATUS_COLOR } from '../lib/constants'

export default function PostDetail({ post: p, currentUser, onUpvote, onComment, commentText, setCommentText, onComplaint, busy }) {
  const liked = currentUser && p.upvotes?.includes(currentUser.id)
  const gr    = p.govResponse

  return (
    <div>
      {/* Main card */}
      <div className="card" style={{ padding: 28, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
              {p.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>@{p.username}</div>
            </div>
          </div>
          <span className="status-badge" style={{ background: `${STATUS_COLOR[p.status]}20`, color: STATUS_COLOR[p.status] }}>
            {p.status}
          </span>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 14 }}>{p.description}</p>

        {p.image && (
          <img src={p.image} alt="issue" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12, marginBottom: 14 }} />
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <span className="sector-pill">{SECTOR_ICONS[p.sector]} {p.sector}</span>
          {p.location_name && <span className="tag">📍 {p.location_name}</span>}
          {p.location      && <span className="tag" style={{ fontSize: 11 }}>🔗 {p.location}</span>}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onUpvote} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
            {liked ? '👍' : '👆'} {p.upvotes?.length || 0} Upvote
          </button>
          {currentUser && !p.complaint && (
            <button onClick={onComplaint} style={{ background: '#ef444415', color: '#ef4444', border: '1.5px solid #ef44441a', borderRadius: 12, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ⚠️ Raise Complaint
            </button>
          )}
          {p.complaint && (
            <span className="tag" style={{ color: '#ef4444', background: '#ef444415', padding: '8px 14px' }}>⚠️ Complaint Raised</span>
          )}
        </div>
      </div>

      {/* Gov response */}
      {gr && (
        <div className="card" style={{ padding: 24, marginBottom: 16, borderLeft: '3px solid #3b82f6' }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16, color: '#3b82f6' }}>🏛️ Government Response</h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{gr.message}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Budget Allocated',  value: gr.budget,        icon: '💰' },
              { label: 'Assigned Company',  value: gr.company,       icon: '🏢' },
              { label: 'Expected Duration', value: `${gr.expected_days} days`, icon: '📅' },
              { label: 'Start Date',        value: gr.start_date ? new Date(gr.start_date).toLocaleDateString('en-IN') : '—', icon: '🗓️' },
            ].map((d, i) => (
              <div key={i} style={{ background: '#0f172a', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{d.icon} {d.label}</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Work Progress</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>{gr.progress}%</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${gr.progress}%` }} /></div>
        </div>
      )}

      {/* Comments */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>💬 Comments ({p.comments?.length || 0})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {(p.comments || []).map(c => (
            <div key={c.id} style={{ background: '#0f1117', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>@{c.username} · {new Date(c.ts).toLocaleDateString('en-IN')}</div>
              <div style={{ fontSize: 14 }}>{c.text}</div>
            </div>
          ))}
          {(!p.comments || p.comments.length === 0) && <p style={{ color: '#64748b', fontSize: 14 }}>No comments yet.</p>}
        </div>
        {currentUser && (
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="input" style={{ flex: 1 }} placeholder="Add a comment…" value={commentText}
              onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && onComment()} />
            <button className="btn-primary" style={{ padding: '10px 18px' }} onClick={onComment} disabled={busy}>
              {busy ? '…' : 'Post'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
