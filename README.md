# 🎬 Anime Download Web App (Supabase + Vercel)

Website katalog & download anime berbasis **HTML, CSS, dan Vanilla JavaScript** dengan backend menggunakan **Supabase (Database, Auth, Storage, Realtime)**.

Project ini dibuat sebagai pembelajaran fullstack modern tanpa framework.

---

## 🚀 Fitur Utama

### 🌐 User Side

* 📚 List anime (grid layout)
* 🔍 Search anime
* 📄 Detail anime + episode list
* ⬇️ Download link per episode
* 📅 Jadwal rilis anime
* 👁️ Total visitor counter
* 🟢 Real-time online visitor (Supabase Realtime)

---

### 🧑‍💻 Admin Panel

* 🔐 Login (Supabase Auth)
* 🚫 Protected route (tidak bisa akses tanpa login)
* ➕ Tambah anime
* ➕ Tambah episode
* 🗑️ Hapus anime + episode
* 🖼️ Upload cover:

  * via URL
  * via file (Supabase Storage)
* 📦 Data langsung tersimpan di database

---

## 🧱 Tech Stack

* **Frontend**: HTML, CSS, Vanilla JS
* **Backend (BaaS)**: Supabase

  * Database (PostgreSQL)
  * Authentication
  * Storage (image upload)
  * Realtime (presence)
* **Deploy**: Vercel

---

## 📁 Struktur Project

```
anime-site/
│
├── index.html
├── detail.html
├── schedule.html
├── admin.html
├── login.html
│
├── style.css
├── app.js
├── admin.js
├── login.js
├── supabase.js
```

---

## ⚙️ Setup Supabase

### 1. Buat Project

* https://supabase.com

---

### 2. Database Schema

```sql
create table anime (
  id uuid primary key default uuid_generate_v4(),
  title text,
  cover text,
  description text,
  release_day text
);

create table episodes (
  id uuid primary key default uuid_generate_v4(),
  anime_id uuid references anime(id),
  episode_number int,
  download_link text
);

create table visitors (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp default now()
);
```

---

### 3. Disable RLS (untuk development)

```sql
alter table anime disable row level security;
alter table episodes disable row level security;
alter table visitors disable row level security;
```

---

### 4. Auth Setup

* Enable Email login
* Create admin user

---

### 5. Storage Setup

* Create bucket: `covers`
* Set public

Policy:

```sql
create policy "public read"
on storage.objects for select
using (true);

create policy "auth upload"
on storage.objects for insert
with check (auth.role() = 'authenticated');
```

---

## 🔌 Supabase Config

Edit file:

```js
// supabase.js
export const supabaseUrl = 'https://YOUR_PROJECT.supabase.co'
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY'
```

---

## ▶️ Cara Menjalankan

### Local

Buka langsung:

```
index.html
```

---

### Deploy (Vercel)

```bash
npm install -g vercel
vercel
```

---

### Auto Deploy (Recommended)

1. Push ke GitHub
2. Connect repo ke Vercel
3. Auto deploy setiap push

---

## 🔐 Akses Admin

```
/login.html
```

Setelah login:

```
/admin.html
```

---

## ⚠️ Catatan Penting

* Gunakan **konten legal / milik sendiri**
* Jangan upload konten berhak cipta tanpa izin
* RLS sebaiknya diaktifkan di production

---

## 🧠 Konsep Penting

### Real-time Visitor

Menggunakan:

* Supabase Realtime Presence

### Total Visitor

Menggunakan:

* Insert row ke table `visitors`

---

## 📌 Status Project

✅ Fullstack dasar selesai
✅ Auth + Admin panel
✅ Storage upload
✅ Realtime visitor
✅ UI modern

---

## 🚀 Next Improvement (Planned)

* 🎬 Banner anime homepage
* 🔥 Latest update section
* 🏷️ Genre & filter
* 📊 Dashboard analytics (chart)
* ⚡ Pagination
* ⭐ Popular anime system
* 🎨 UI ala Samehadaku

---

## 👨‍💻 Author

Dibuat untuk pembelajaran fullstack modern menggunakan Supabase.

---

## 📄 License

Free to use for learning purposes.
