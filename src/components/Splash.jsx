import { useEffect } from 'react'

export default function Splash({ navigate }) {
  useEffect(() => {
    const t = setTimeout(() => navigate('login'), 2600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, #1e3a8a1a, transparent 70%), #0f1117'
    }}>
      <div style={{ textAlign: 'center', animation: 'slideUp .6s ease' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏙️</div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 52, fontWeight: 700,
          background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -2
        }}>UrbanIQ</h1>
        <p style={{ color: '#64748b', fontSize: 18, marginTop: 8 }}>Civic Intelligence Platform</p>
        <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'center' }}>
          {['🛣️','💧','🏥','⚡','♻️'].map((e, i) => (
            <span key={i} style={{ fontSize: 24, animation: `pulse 2s ease ${i * .3}s infinite` }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
