import { supabase } from './supabase.js'

const list = document.getElementById('animeList')
const totalEl = document.getElementById('totalVisitor')
const onlineEl = document.getElementById('onlineVisitor')

// ================= TOTAL VISITOR =================
await supabase.from('visitors').insert([{}])

const { count } = await supabase
  .from('visitors')
  .select('*', { count: 'exact', head: true })

totalEl.innerText = `👁️ ${count} total visitors`

// ================= REALTIME =================
const channel = supabase.channel('online-users', {
  config: { presence: { key: Math.random().toString(36) } }
})

channel.on('presence', { event: 'sync' }, () => {
  const online = Object.keys(channel.presenceState()).length
  onlineEl.innerText = `🟢 ${online} online`
})

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({})
  }
})

// ================= LOAD ANIME =================
const { data } = await supabase.from('anime').select('*')

function render(data) {
  list.innerHTML = ''
  data.forEach(a => {
    const div = document.createElement('div')
    div.className = 'card'

    div.innerHTML = `
      <img src="${a.cover}">
      <div class="card-content">
        <h3>${a.title}</h3>
        <a href="detail.html?id=${a.id}">Detail</a>
      </div>
    `

    list.appendChild(div)
  })
}

render(data)

// ================= SEARCH =================
document.getElementById('search').addEventListener('input', (e) => {
  const val = e.target.value.toLowerCase()
  render(data.filter(a => a.title.toLowerCase().includes(val)))
})