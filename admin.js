import { supabase } from './supabase.js'

const animeList = document.getElementById('animeList')

// ==============================
// LOAD ANIME
// ==============================
async function loadAnime() {
  animeList.innerHTML = 'Loading...'

  const { data, error } = await supabase.from('anime').select('*')

  if (error) {
    animeList.innerHTML = 'Error load data'
    return
  }

  animeList.innerHTML = ''

  data.forEach(anime => {
    const div = document.createElement('div')
    div.className = 'card'

    div.innerHTML = `
      <h3>${anime.title}</h3>
      <p>${anime.description}</p>
      <small>ID: ${anime.id}</small><br><br>

      <button onclick="deleteAnime('${anime.id}')">Hapus</button>
      <button onclick="showEpisodes('${anime.id}')">Lihat Episode</button>

      <div id="ep-${anime.id}"></div>
    `

    animeList.appendChild(div)
  })
}

// ==============================
// ADD ANIME
// ==============================
document.getElementById('addAnime').onclick = async () => {
  const title = document.getElementById('title').value
  const cover = document.getElementById('cover').value
  const desc = document.getElementById('desc').value
  const day = document.getElementById('day').value

  const { error } = await supabase.from('anime').insert([{
    title,
    cover,
    description: desc,
    release_day: day
  }])

  if (error) {
    alert('Gagal tambah anime')
  } else {
    alert('Anime ditambahkan')
    loadAnime()
  }
}

// ==============================
// DELETE ANIME
// ==============================
window.deleteAnime = async (id) => {
  if (!confirm('Hapus anime ini?')) return

  await supabase.from('anime').delete().eq('id', id)
  await supabase.from('episodes').delete().eq('anime_id', id)

  loadAnime()
}

// ==============================
// ADD EPISODE
// ==============================
document.getElementById('addEpisode').onclick = async () => {
  const anime_id = document.getElementById('animeId').value
  const episode_number = parseInt(document.getElementById('episode').value)
  const download_link = document.getElementById('link').value

  const { error } = await supabase.from('episodes').insert([{
    anime_id,
    episode_number,
    download_link
  }])

  if (error) {
    alert('Gagal tambah episode')
  } else {
    alert('Episode ditambahkan')
  }
}

// ==============================
// SHOW EPISODES
// ==============================
window.showEpisodes = async (anime_id) => {
  const container = document.getElementById(`ep-${anime_id}`)

  const { data } = await supabase
    .from('episodes')
    .select('*')
    .eq('anime_id', anime_id)

  container.innerHTML = '<h4>Episode:</h4>'

  data.forEach(ep => {
    const el = document.createElement('div')
    el.innerHTML = `
      Episode ${ep.episode_number}
      <button onclick="deleteEpisode('${ep.id}', '${anime_id}')">Hapus</button>
    `
    container.appendChild(el)
  })
}

// ==============================
// DELETE EPISODE
// ==============================
window.deleteEpisode = async (id, anime_id) => {
  await supabase.from('episodes').delete().eq('id', id)
  showEpisodes(anime_id)
}

// ==============================
// INIT
// ==============================
loadAnime()