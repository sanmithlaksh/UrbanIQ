import { useState } from 'react'
import { DB } from '../lib/db'
import { SECTORS, SECTOR_ICONS } from '../lib/constants'
import PostCard   from './PostCard'
import PostDetail from './PostDetail'

export default function Feed({ posts, currentUser, refreshPosts, showToast }) {
  const [statusFilter, setStatusFilter] = useState('All')
  const [sectorFilter, setSectorFilter] = useState('All')
  const [selected, setSelected]         = useState(null)
  const [commentText, setCommentText]   = useState('')
  const [busy, setBusy]                 = useState(false)

  const filtered = posts
    .filter(p => statusFilter === 'All' || p.status === statusFilter)
    .filter(p => sectorFilter === 'All' || p.sector === sectorFilter)
    .sort((a, b) => b.timestamp - a.timestamp)

  const fresh = selected ? posts.find(p => p.id === selected.id) || selected : null

  async function upvote(id) {
    if (!currentUser) return
    const post   = posts.find(p => p.id === id)
    const upvotes = post.upvotes.includes(currentUser.id)
      ? post.upvotes.filter(x => x !== currentUser.id)
      : [...post.upvotes, currentUser.id]
    await DB.updatePost(id, { upvotes })
    await refreshPosts()
  }

  async function addComment() {
    if (!commentText.trim() || !currentUser || !fresh) return
    setBusy(true)
    const comment = {
      id: 'c' + Date.now(), post_id: fresh.id,
      user_id: currentUser.id, username: currentUser.username,
      text: commentText.trim(), ts: Date.now(),
    }
    const err = await DB.addComment(comment)
    setBusy(false)
    if (err) { showToast('Failed to post comment', 'error'); return }
    await refreshPosts()
    setCommentText('')
    showToast('Comment posted!')
  }

  async function raiseComplaint(id) {
    await DB.updatePost(id, { complaint: true })
    await refreshPosts()
    showToast('Complaint raised — Government notified ⚠️')
  }

  if (fresh) return (
    <div className="animate-in">
      <button className="btn-outline" style={{ marginBottom: 20 }} onClick={() => setSelected(null)}>← Back to Feed</button>
      <PostDetail
        post={fresh} currentUser={currentUser}
        onUpvote={() => upvote(fresh.id)}
        onComment={addComment}
        commentText={commentText} setCommentText={setCommentText}
        onComplaint={() => raiseComplaint(fresh.id)}
        busy={busy}
      />
    </div>
  )

  return (
    <div className="animate-in">
      <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 18 }}>Community Feed</h2>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {['All', 'Pending', 'In Review', 'Work Initiated', 'In Progress', 'Completed', 'Rejected'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', background: statusFilter === s ? '#3b82f6' : '#1a1d27', color: statusFilter === s ? '#fff' : '#94a3b8' }}>{s}</button>
        ))}
      </div>

      {/* Sector filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
        <button onClick={() => setSectorFilter('All')} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, border: 'none', cursor: 'pointer', background: sectorFilter === 'All' ? '#6366f1' : '#1a1d27', color: sectorFilter === 'All' ? '#fff' : '#94a3b8' }}>All Sectors</button>
        {SECTORS.map(s => (
          <button key={s} onClick={() => setSectorFilter(s)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, border: 'none', cursor: 'pointer', background: sectorFilter === s ? '#6366f1' : '#1a1d27', color: sectorFilter === s ? '#fff' : '#94a3b8' }}>
            {SECTOR_ICONS[s]} {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>No posts found.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
            <PostCard post={p} onUpvote={e => { e.stopPropagation(); upvote(p.id) }} currentUser={currentUser} />
          </div>
        ))}
      </div>
    </div>
  )
}
