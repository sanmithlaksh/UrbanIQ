export default function Toast({ toast }) {
  const bg = toast.type === 'success' ? '#10b981'
           : toast.type === 'error'   ? '#ef4444'
           : '#3b82f6'
  return (
    <div className="toast" style={{ background: bg }}>
      {toast.type === 'success' ? '✓ ' : '✕ '}{toast.msg}
    </div>
  )
}
