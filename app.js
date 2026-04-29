import { supabase } from './supabase.js'

const list = document.getElementById('animeList')
const searchInput = document.getElementById('search')
const visitorEl = document.getElementById('visitor')

// ==============================
// VISITOR TRACK
// ==============================
try {
  await supabase.from('visitors').insert([{}])
} catch (e) {
  console.error('Visitor error:', e.message)
}

// ==============================
// GET DATA
// ==============================
const { data, error } = await supabase.from('anime').select('*')

if (error) {
  console.error(error.message)
  list.innerHTML = '<h2>Gagal load data</h2>'
}

if (!data || data.length === 0) {
  list.innerHTML = '<h2>Data kosong</h2>'
}

// ==============================
// FUNCTION RENDER
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

// ==============================
// INIT RENDER
// ==============================
if (data) render(data)

// ==============================
// SEARCH
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

// ==============================
// VISITOR COUNT
// ==============================
if (visitorEl) {
  const { count } = await supabase
    .from('visitors')
    .select('*', { count: 'exact', head: true })

  visitorEl.innerText = `Visitors: ${count}`
}