import { SECTORS, SECTOR_ICONS } from '../lib/constants'
import PostCard from './PostCard'

export default function Accomplishments({ posts }) {
  const completed  = posts.filter(p => p.status === 'Completed')
  const inProgress = posts.filter(p => p.status === 'In Progress' && p.govResponse)
  const sectorStats = SECTORS.map(s => ({
    sector: s,
    total:     posts.filter(p => p.sector === s).length,
    completed: posts.filter(p => p.sector === s && p.status === 'Completed').length,
  })).filter(s => s.total > 0)

  return (
    <div className="animate-in">
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>🏆 Government Accomplishments</h2>
      <p style={{ color: '#64748b', marginBottom: 26 }}>Live civic data from Supabase</p>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Issues', value: posts.length,       color: '#3b82f6' },
          { label: 'Resolved',     value: completed.length,   color: '#10b981' },
          { label: 'In Progress',  value: inProgress.length,  color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 22, textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sector breakdown */}
      {sectorStats.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 26 }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 16 }}>By Sector</h3>
          {sectorStats.map(s => (
            <div key={s.sector} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{SECTOR_ICONS[s.sector]} {s.sector}</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>{s.completed}/{s.total}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: s.total ? `${(s.completed / s.total) * 100}%` : '0%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In progress */}
      {inProgress.length > 0 && (
        <>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>⚙️ Work In Progress</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {inProgress.map(p => (
              <div key={p.id} className="card" style={{ padding: 20 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{p.description}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span className="sector-pill">{SECTOR_ICONS[p.sector]} {p.sector}</span>
                  {p.location_name && <span className="tag">📍 {p.location_name}</span>}
                </div>
                {p.govResponse && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#64748b' }}>{p.govResponse.company}</span>
                      <span style={{ fontWeight: 700, color: '#3b82f6' }}>{p.govResponse.progress}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${p.govResponse.progress}%` }} /></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Resolved */}
      {completed.length > 0 && (
        <>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>✅ Resolved Issues</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {completed.map(p => <PostCard key={p.id} post={p} compact />)}
          </div>
        </>
      )}
    </div>
  )
}
