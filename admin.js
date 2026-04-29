import { supabase } from './supabase.js'

// ==============================
// AUTH PROTECTION (FINAL)
// ==============================
const loading = document.getElementById('loading')
const app = document.getElementById('app')

const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  location.href = '/login.html'
} else {
  loading.style.display = 'none'
  app.style.display = 'flex'
}

// ==============================
// LOGOUT
// ==============================
window.logout = async () => {
  await supabase.auth.signOut()
  location.href = '/login.html'
}

// ==============================
// UPLOAD FILE
// ==============================
async function uploadFile(file) {
  const fileName = Date.now() + '-' + file.name

  const { error } = await supabase.storage
    .from('covers')
    .upload(fileName, file)

  if (error) {
    alert('Upload gagal')
    return null
  }

  const { data } = supabase
    .storage
    .from('covers')
    .getPublicUrl(fileName)

  return data.publicUrl
}

// ==============================
// ADD ANIME
// ==============================
document.getElementById('addAnime').onclick = async () => {
  const title = document.getElementById('title').value
  const desc = document.getElementById('desc').value
  const day = document.getElementById('day').value

  let cover = document.getElementById('coverUrl').value
  const file = document.getElementById('coverFile').files[0]

  if (file) {
    const uploaded = await uploadFile(file)
    if (uploaded) cover = uploaded
  }

  const { error } = await supabase.from('anime').insert([{
    title,
    description: desc,
    release_day: day,
    cover
  }])

  if (error) {
    alert('Gagal tambah anime')
  } else {
    alert('Anime berhasil ditambahkan')
    loadAnime()
  }
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
    alert('Episode berhasil ditambahkan')
  }
}

// ==============================
// LOAD ANIME
// ==============================
async function loadAnime() {
  const { data, error } = await supabase.from('anime').select('*')

  const container = document.getElementById('animeList')
  container.innerHTML = ''

  if (error) {
    container.innerHTML = 'Gagal load data'
    return
  }

  data.forEach(a => {
    const div = document.createElement('div')
    div.className = 'card'

    div.innerHTML = `
      <h3>${a.title}</h3>
      <img src="${a.cover}" width="120">
      <p>${a.description || ''}</p>
      <small>ID: ${a.id}</small><br><br>

      <button onclick="deleteAnime('${a.id}')">Hapus</button>
      <button onclick="showEpisodes('${a.id}')">Episode</button>

      <div id="ep-${a.id}"></div>
    `

    container.appendChild(div)
  })
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
// SHOW EPISODES
// ==============================
window.showEpisodes = async (anime_id) => {
  const container = document.getElementById(`ep-${anime_id}`)

  const { data } = await supabase
    .from('episodes')
    .select('*')
    .eq('anime_id', anime_id)

  container.innerHTML = '<h4>Episodes:</h4>'

  data.forEach(ep => {
    container.innerHTML += `
      Episode ${ep.episode_number}
      <button onclick="deleteEpisode('${ep.id}', '${anime_id}')">X</button><br>
    `
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