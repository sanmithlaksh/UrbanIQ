# 🏙️ UrbanIQ — Civic Intelligence Platform

![Demo](images/First look.jpeg)
A social civic app where citizens can report local problems, and government officials can review, respond, and track resolution progress — all backed by Supabase.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
Your credentials are already pre-filled in `.env`. If you need to change them:
```
VITE_SUPABASE_URL=https://lpyvlbwkmjcgemrvzlzm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run the SQL schema in Supabase SQL Editor
```sql
create table users (
  id text primary key, name text, aadhar text unique,
  username text unique, password text, phone text, address text
);
create table posts (
  id text primary key, user_id text, username text, name text,
  description text, sector text, image text, location text,
  location_name text, timestamp bigint, status text default 'Pending',
  upvotes text[] default '{}', complaint boolean default false
);
create table gov_responses (
  id text primary key, post_id text references posts(id) on delete cascade,
  message text, budget text, company text, expected_days int,
  progress int default 0, start_date bigint, updated_at timestamptz
);
create table comments (
  id text primary key, post_id text references posts(id) on delete cascade,
  user_id text, username text, text text, ts bigint
);

-- RLS (open policies — lock down in production)
alter table users enable row level security;
alter table posts enable row level security;
alter table gov_responses enable row level security;
alter table comments enable row level security;
create policy "all" on users for all using (true) with check (true);
create policy "all" on posts for all using (true) with check (true);
create policy "all" on gov_responses for all using (true) with check (true);
create policy "all" on comments for all using (true) with check (true);
```

### 4. Start dev server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 👤 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Government Admin | `gov_admin` | `urban2025` |
| Demo Citizen | Register yourself via the app | — |

---

## 📁 Project Structure

```
urbaniq/
├── index.html
├── vite.config.js
├── package.json
├── .env                          ← Supabase credentials
└── src/
    ├── main.jsx                  ← React entry
    ├── App.jsx                   ← Router + state
    ├── index.css                 ← Global styles
    ├── lib/
    │   ├── supabase.js           ← Supabase client
    │   ├── db.js                 ← All DB helpers
    │   └── constants.js          ← Sectors, colors, gov creds
    └── components/
        ├── Splash.jsx
        ├── Toast.jsx
        ├── Login.jsx
        ├── Register.jsx
        ├── UserLayout.jsx
        ├── GovLayout.jsx
        ├── PostCard.jsx
        ├── PostDetail.jsx
        ├── Home.jsx
        ├── Feed.jsx
        ├── ReportPost.jsx
        ├── Accomplishments.jsx
        ├── Profile.jsx
        └── GovDashboard.jsx
```

---

## ✨ Features

- **Citizen side**: Sign up with Aadhaar, report civic issues with photo + auto GPS, upvote posts, comment, raise complaints
- **Government side**: Dashboard with stats, review complaints, set status, allocate budget, assign company, update progress bar
- **Community Feed**: Filter by status & sector, view gov responses with progress tracking
- **Achievements page**: Resolved issues, in-progress work, sector breakdown
