import { supabase } from './supabase.js'

const list = document.getElementById('animeList')
const searchInput = document.getElementById('search')

const totalEl = document.getElementById('totalVisitor')
const onlineEl = document.getElementById('onlineVisitor')

// ==============================
// 1. TOTAL VISITOR
// ==============================
try {
  await supabase.from('visitors').insert([{}])
} catch (e) {
  console.log('visitor insert error')
}

const { count } = await supabase
  .from('visitors')
  .select('*', { count: 'exact', head: true })

if (totalEl) {
  totalEl.innerText = `👁️ Total Visitors: ${count}`
}

// ==============================
// 2. REALTIME ONLINE (FIX URUTAN)
// ==============================
const channel = supabase.channel('online-users', {
  config: {
    presence: { key: Math.random().toString(36) }
  }
})

// ✅ HARUS DI ATAS
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  const onlineUsers = Object.keys(state).length

  if (onlineEl) {
    onlineEl.innerText = `🟢 Online Now: ${onlineUsers}`
  }
})

// ✅ BARU subscribe
channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({
      online_at: new Date().toISOString()
    })
  }
})

// ==============================
// 3. GET ANIME (AMAN)
// ==============================
let data = []

try {
  const res = await supabase.from('anime').select('*')

  if (res.error) throw res.error

  data = res.data || []
} catch (err) {
  console.error('Fetch anime error:', err.message)
  list.innerHTML = '<h2>Gagal load data</h2>'
}

// ==============================
// 4. RENDER FUNCTION
// ==============================
function render(animeList) {
  list.innerHTML = ''

  if (!animeList || animeList.length === 0) {
    list.innerHTML = '<h2>Tidak ada data</h2>'
    return
  }

  animeList.forEach(anime => {
    const div = document.createElement('div')
    div.className = 'card'

    div.innerHTML = `
      <img src="${anime.cover}" 
           onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
      <h3>${anime.title}</h3>
      <a href="detail.html?id=${anime.id}">Lihat</a>
    `

    list.appendChild(div)
  })
}

// INIT RENDER
render(data)

// ==============================
// 5. SEARCH
// ==============================
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase()

    const filtered = data.filter(a =>
      a.title.toLowerCase().includes(keyword)
    )

    render(filtered)
  })
}