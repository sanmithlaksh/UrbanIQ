import { SECTOR_ICONS, STATUS_COLOR } from '../lib/constants'

export default function PostCard({ post: p, onUpvote, currentUser, compact }) {
  const age   = Math.floor((Date.now() - p.timestamp) / 86400000)
  const liked = currentUser && p.upvotes?.includes(currentUser.id)

  return (
    <div
      className="card"
      style={{ padding: 20, transition: 'border-color .2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f630'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#252836'}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
            {p.name?.charAt(0) || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>@{p.username} · {age === 0 ? 'today' : `${age}d ago`}</div>
          </div>
        </div>
        <span className="status-badge" style={{ background: `${STATUS_COLOR[p.status]}20`, color: STATUS_COLOR[p.status] }}>
          {p.status}
        </span>
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 10 }}>{p.description}</p>

      {p.image && (
        <img src={p.image} alt="issue" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: compact ? 0 : 10 }}>
        <span className="sector-pill">{SECTOR_ICONS[p.sector]} {p.sector}</span>
        {p.location_name && <span className="tag">📍 {p.location_name}</span>}
        {p.complaint && <span className="tag" style={{ color: '#ef4444', background: '#ef444415' }}>⚠️ Complaint</span>}
      </div>

      {!compact && p.govResponse && (
        <div style={{ marginTop: 10, padding: '12px 14px', background: '#0f172a', borderRadius: 10, borderLeft: '3px solid #3b82f6' }}>
          <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, marginBottom: 6 }}>🏛️ Government Response</div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${p.govResponse.progress}%` }} /></div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{p.govResponse.progress}% complete</div>
        </div>
      )}

      {!compact && (
        <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e2535' }}>
          <button onClick={onUpvote} style={{ background: 'none', border: 'none', color: liked ? '#3b82f6' : '#64748b', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            {liked ? '👍' : '👆'} {p.upvotes?.length || 0} upvotes
          </button>
          <span style={{ color: '#64748b', fontSize: 13 }}>💬 {p.comments?.length || 0} comments</span>
        </div>
      )}
    </div>
  )
}
