export default function GovLayout({ children, logout }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#0a0f1e', borderBottom: '1px solid #1e2a40', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>🏛️</span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: '#fff' }}>UrbanIQ</span>
          <span style={{ fontSize: 12, background: '#1e3a5f', color: '#60a5fa', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
            GOVERNMENT PORTAL
          </span>
        </div>
        <button className="nav-btn" onClick={logout} style={{ color: '#ef4444' }}>↩ Logout</button>
      </header>
      <main style={{ flex: 1, padding: '28px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  )
}
