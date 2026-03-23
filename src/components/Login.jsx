import { useState } from 'react'
import { sb } from '../lib/supabase'
import { GOV_CREDS } from '../lib/constants'

export default function Login({ navigate, showToast, setCurrentUser, setIsGov }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [busy, setBusy] = useState(false)

  async function handleLogin() {
    if (!form.username || !form.password) { showToast('Fill all fields', 'error'); return }
    setBusy(true)

    // Government login
    if (form.username === GOV_CREDS.username && form.password === GOV_CREDS.password) {
      setIsGov(true)
      setCurrentUser({ id: 'gov', name: 'Government Admin', username: 'gov_admin' })
      navigate('gov')
      showToast('Welcome, Government Admin 🏛️')
      setBusy(false)
      return
    }

    // Citizen login
    const { data, error } = await sb
      .from('users').select('*')
      .eq('username', form.username)
      .eq('password', form.password)
      .single()

    setBusy(false)
    if (error || !data) { showToast('Invalid credentials', 'error'); return }
    setCurrentUser(data)
    navigate('home')
    showToast(`Welcome back, ${data.name.split(' ')[0]}! 👋`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f1117' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(145deg, #0f172a, #1e1b4b)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 60, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -80, width: 360, height: 360,
          borderRadius: '50%', background: 'radial-gradient(circle, #3b82f618, transparent 70%)'
        }}/>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 44,
          fontWeight: 700, color: '#fff', lineHeight: 1.1
        }}>
          Fix Your City.<br/><span style={{ color: '#3b82f6' }}>Together.</span>
        </h1>
        <p style={{ color: '#94a3b8', marginTop: 18, fontSize: 17, lineHeight: 1.7, maxWidth: 380 }}>
          UrbanIQ connects citizens with local government to resolve civic issues faster and more transparently.
        </p>
        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 380 }}>
          {['Report Issues','Track Progress','Gov Responses','Community Voice'].map((f, i) => (
            <div key={i} style={{
              background: '#ffffff08', border: '1px solid #ffffff0e',
              borderRadius: 12, padding: '14px 16px', fontSize: 14, color: '#cbd5e1', fontWeight: 500
            }}>✦ {f}</div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 460, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 50 }}>
        <div style={{ animation: 'slideUp .5s ease' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏙️</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Sign In</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 30 }}>Username &amp; password</p>

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Username</label>
          <input
            className="input" style={{ marginTop: 6, marginBottom: 18 }}
            placeholder="your_username" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Password</label>
          <input
            className="input" type="password" style={{ marginTop: 6, marginBottom: 28 }}
            placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          <button className="btn-primary" style={{ width: '100%', padding: 14 }} onClick={handleLogin} disabled={busy}>
            {busy ? <><span className="spinner"/> Signing in…</> : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: 14 }}>
            No account?{' '}
            <span style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('register')}>
              Create one
            </span>
          </p>

          <div style={{ marginTop: 26, padding: '14px 18px', background: '#1a1d27', borderRadius: 12, border: '1px solid #252836' }}>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 6 }}>🔐 GOVERNMENT LOGIN</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>
              Username: <code style={{ color: '#3b82f6' }}>gov_admin</code>&nbsp;|&nbsp;
              Password: <code style={{ color: '#3b82f6' }}>urban2025</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
