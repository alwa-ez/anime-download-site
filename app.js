import { supabase } from './supabase.js'

const list = document.getElementById('animeList')
const searchInput = document.getElementById('search')

// visitor UI
const totalEl = document.getElementById('totalVisitor')
const onlineEl = document.getElementById('onlineVisitor')

// ==============================
// 1. TOTAL VISITOR (DATABASE)
// ==============================
try {
  await supabase.from('visitors').insert([{}])
} catch (e) {
  console.error('Insert visitor error:', e.message)
}

// ambil total
const { count } = await supabase
  .from('visitors')
  .select('*', { count: 'exact', head: true })

if (totalEl) {
  totalEl.innerText = `👁️ Total Visitors: ${count}`
}

// ==============================
// 2. REALTIME ONLINE VISITOR
// ==============================
const channel = supabase.channel('online-users', {
  config: {
    presence: {
      key: Math.random().toString(36)
    }
  }
})

// saat connect
channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({
      online_at: new Date().toISOString()
    })
  }
})

// listen perubahan
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  const onlineUsers = Object.keys(state).length

  if (onlineEl) {
    onlineEl.innerText = `🟢 Online Now: ${onlineUsers}`
  }
})

// ==============================
// 3. GET ANIME
// ==============================
const { data, error } = await supabase.from('anime').select('*')

if (error) {
  list.innerHTML = '<h2>Error load data</h2>'
}

// ==============================
// 4. RENDER FUNCTION
// ==============================
function render(animeList) {
  list.innerHTML = ''

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

// init
if (data) render(data)

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