import { sb } from './supabase'

export const DB = {
  /* ── Users ─────────────────────────────────────────────────────────── */
  async getUsers() {
    const { data } = await sb.from('users').select('*')
    return data || []
  },

  async createUser(user) {
    return await sb.from('users').insert([user]).select().single()
  },

  async updateUser(id, fields) {
    const { error } = await sb.from('users').update(fields).eq('id', id)
    return error
  },

  async findUser(username, password) {
    const { data, error } = await sb
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()
    return { data, error }
  },

  async usernameExists(username) {
    const { data } = await sb.from('users').select('id').eq('username', username).maybeSingle()
    return !!data
  },

  async aadharExists(aadhar) {
    const { data } = await sb.from('users').select('id').eq('aadhar', aadhar).maybeSingle()
    return !!data
  },

  /* ── Posts ─────────────────────────────────────────────────────────── */
  async getPosts() {
    const { data: posts }    = await sb.from('posts').select('*').order('timestamp', { ascending: false })
    const { data: govRes }   = await sb.from('gov_responses').select('*')
    const { data: comments } = await sb.from('comments').select('*').order('ts', { ascending: true })

    return (posts || []).map(p => ({
      ...p,
      upvotes:     p.upvotes || [],
      govResponse: (govRes || []).find(g => g.post_id === p.id) || null,
      comments:    (comments || []).filter(c => c.post_id === p.id),
    }))
  },

  async createPost(post) {
    const { upvotes, govResponse, comments, ...row } = post
    const { error } = await sb.from('posts').insert([{ ...row, upvotes: upvotes || [] }])
    return error
  },

  async updatePost(id, fields) {
    const { upvotes, govResponse, comments, ...safe } = fields
    if (upvotes !== undefined) safe.upvotes = upvotes
    const { error } = await sb.from('posts').update(safe).eq('id', id)
    return error
  },

  /* ── Gov Responses ─────────────────────────────────────────────────── */
  async upsertGovResponse(postId, data) {
    const { data: existing } = await sb
      .from('gov_responses')
      .select('id')
      .eq('post_id', postId)
      .maybeSingle()

    if (existing) {
      const { error } = await sb
        .from('gov_responses')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('post_id', postId)
      return error
    }

    const { error } = await sb
      .from('gov_responses')
      .insert([{ id: 'gr' + Date.now(), post_id: postId, ...data }])
    return error
  },

  /* ── Comments ──────────────────────────────────────────────────────── */
  async addComment(comment) {
    const { error } = await sb.from('comments').insert([comment])
    return error
  },
}
