import { supabase } from './supabase.js'

const list = document.getElementById('animeList')

// VISITOR TRACK
await supabase.from('visitors').insert([{}])

// GET ANIME
const { data } = await supabase.from('anime').select('*')

data.forEach(anime => {
  const div = document.createElement('div')
  div.className = 'card'

  div.innerHTML = `
    <img src="${anime.cover}">
    <h3>${anime.title}</h3>
    <a href="detail.html?id=${anime.id}">Lihat</a>
  `

  list.appendChild(div)
})