import PostCard from './PostCard'

export default function Home({ currentUser, posts, navigate }) {
  const mine = posts.filter(p => p.user_id === currentUser?.id)
  const stats = {
    total:      mine.length,
    resolved:   mine.filter(p => p.status === 'Completed').length,
    pending:    mine.filter(p => p.status === 'Pending').length,
    inProgress: mine.filter(p => ['In Progress', 'Work Initiated', 'In Review'].includes(p.status)).length,
  }

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 700 }}>
          Welcome back, {currentUser?.name?.split(' ')[0]} 👋
        </h2>
        <p style={{ color: '#64748b', marginTop: 4 }}>Make your city better — one report at a time.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'My Reports',  value: stats.total,      color: '#3b82f6', icon: '📋' },
          { label: 'Resolved',    value: stats.resolved,   color: '#10b981', icon: '✅' },
          { label: 'In Progress', value: stats.inProgress, color: '#8b5cf6', icon: '⚙️' },
          { label: 'Pending',     value: stats.pending,    color: '#f59e0b', icon: '⏳' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px 22px', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        {[
          { icon: '📸', title: 'Report an Issue',  desc: 'Capture a problem with photo & GPS location', page: 'post', color: '#3b82f6' },
          { icon: '👁️', title: 'Community Feed',   desc: 'See all civic issues & government responses',  page: 'feed', color: '#6366f1' },
        ].map((c, i) => (
          <div key={i} className="card" style={{ padding: 28, cursor: 'pointer', transition: 'border-color .2s' }}
            onClick={() => navigate(c.page)}
            onMouseEnter={e => e.currentTarget.style.borderColor = c.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#252836'}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{c.title}</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      {mine.length > 0 && (
        <>
          <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>My Recent Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mine.slice(0, 3).map(p => <PostCard key={p.id} post={p} compact />)}
          </div>
        </>
      )}
    </div>
  )
}
