import { useState } from 'react'
import { sb } from '../lib/supabase'

export default function Register({ navigate, showToast, setCurrentUser }) {
  const [form, setForm] = useState({ name: '', aadhar: '', username: '', password: '', confirm: '' })
  const [step, setStep] = useState(1)
  const [busy, setBusy] = useState(false)

  async function handleNext() {
    if (!form.name || !form.aadhar) { showToast('Fill all fields', 'error'); return }
    if (!/^\d{4}-\d{4}-\d{4}$/.test(form.aadhar)) { showToast('Aadhaar format: XXXX-XXXX-XXXX', 'error'); return }
    const { data } = await sb.from('users').select('id').eq('aadhar', form.aadhar).maybeSingle()
    if (data) { showToast('Aadhaar already registered', 'error'); return }
    setStep(2)
  }

  async function handleRegister() {
    if (!form.username || !form.password) { showToast('Fill all fields', 'error'); return }
    if (form.password !== form.confirm)   { showToast("Passwords don't match", 'error'); return }
    if (form.password.length < 6)         { showToast('Password min 6 characters', 'error'); return }
    setBusy(true)
    const { data: ex } = await sb.from('users').select('id').eq('username', form.username).maybeSingle()
    if (ex) { showToast('Username already taken', 'error'); setBusy(false); return }
    const newUser = {
      id: 'u' + Date.now(),
      name: form.name, aadhar: form.aadhar,
      username: form.username, password: form.password,
    }
    const { data, error } = await sb.from('users').insert([newUser]).select().single()
    setBusy(false)
    if (error) { showToast('Registration failed: ' + error.message, 'error'); return }
    setCurrentUser(data)
    navigate('home')
    showToast('Account created! Welcome 🎉')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117', padding: 20 }}>
      <div className="card" style={{ width: '100%', maxWidth: 440, padding: 40, animation: 'slideUp .4s ease' }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🏙️</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Create Account</h2>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 22 }}>
          Step {step} of 2 — {step === 1 ? 'Identity Verification' : 'Account Setup'}
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? '#3b82f6' : '#252836', transition: 'background .3s' }}/>
          ))}
        </div>

        {step === 1 && <>
          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Full Name</label>
          <input className="input" style={{ marginTop: 6, marginBottom: 18 }} placeholder="Priya Sharma"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Aadhaar Number</label>
          <input className="input" style={{ marginTop: 6, marginBottom: 28 }} placeholder="XXXX-XXXX-XXXX"
            value={form.aadhar} onChange={e => setForm({ ...form, aadhar: e.target.value })} maxLength={14}/>

          <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={handleNext}>Continue →</button>
        </>}

        {step === 2 && <>
          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Username</label>
          <input className="input" style={{ marginTop: 6, marginBottom: 18 }} placeholder="priya_sharma"
            value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}/>

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Password</label>
          <input className="input" type="password" style={{ marginTop: 6, marginBottom: 18 }} placeholder="Min 6 characters"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>

          <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Confirm Password</label>
          <input className="input" type="password" style={{ marginTop: 6, marginBottom: 28 }} placeholder="••••••••"
            value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}/>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1, padding: 13 }} onClick={handleRegister} disabled={busy}>
              {busy ? <><span className="spinner"/> Creating…</> : 'Create Account'}
            </button>
          </div>
        </>}

        <p style={{ textAlign: 'center', marginTop: 22, color: '#64748b', fontSize: 14 }}>
          Have an account?{' '}
          <span style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('login')}>Sign in</span>
        </p>
      </div>
    </div>
  )
}
