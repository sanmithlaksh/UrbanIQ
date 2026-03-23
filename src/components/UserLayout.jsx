export default function UserLayout({ children, page, navigate, currentUser, logout }) {
  const navItems = [
    { id: 'home',            label: 'Home',        icon: '🏠' },
    { id: 'feed',            label: 'Feed',         icon: '📋' },
    { id: 'post',            label: '+ Report',     primary: true },
    { id: 'accomplishments', label: 'Achievements', icon: '🏆' },
    { id: 'profile',         label: 'Profile',      icon: '👤' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#0f1117', borderBottom: '1px solid #1e2535', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏙️</span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, color: '#fff' }}>UrbanIQ</span>
        </div>
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {navItems.map(n => n.primary
            ? <button key={n.id} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13, borderRadius: 10 }} onClick={() => navigate(n.id)}>{n.label}</button>
            : <button key={n.id} className={`nav-btn ${page === n.id ? 'active' : ''}`} onClick={() => navigate(n.id)}>{n.icon} {n.label}</button>
          )}
        </nav>
        <button className="nav-btn" onClick={logout} style={{ color: '#ef4444' }}>↩ Logout</button>
      </header>
      <main style={{ flex: 1, padding: '28px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  )
}
