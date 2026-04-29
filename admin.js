import { supabase } from './supabase.js'

// ==============================
// AUTH CHECK
// ==============================
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  location.href = '/login.html'
}

// logout
window.logout = async () => {
  await supabase.auth.signOut()
  location.href = '/login.html'
}

// ==============================
// UPLOAD FILE FUNCTION
// ==============================
async function uploadFile(file) {
  const fileName = Date.now() + '-' + file.name

  const { data, error } = await supabase.storage
    .from('covers')
    .upload(fileName, file)

  if (error) {
    alert('Upload gagal')
    return null
  }

  return `${supabaseUrl}/storage/v1/object/public/covers/${fileName}`
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

  // kalau upload file
  if (file) {
    const fileName = Date.now() + '-' + file.name

    const { error } = await supabase.storage
      .from('covers')
      .upload(fileName, file)

    if (!error) {
      cover = `${supabase.storageUrl}/object/public/covers/${fileName}`
    }
  }

  await supabase.from('anime').insert([{
    title,
    description: desc,
    release_day: day,
    cover
  }])

  alert('Anime ditambahkan')
  loadAnime()
}

// ==============================
// LOAD ANIME
// ==============================
async function loadAnime() {
  const { data } = await supabase.from('anime').select('*')

  const container = document.getElementById('animeList')
  container.innerHTML = ''

  data.forEach(a => {
    const div = document.createElement('div')
    div.className = 'card'

    div.innerHTML = `
      <h3>${a.title}</h3>
      <img src="${a.cover}" width="100">
      <p>${a.description}</p>

      <button onclick="deleteAnime('${a.id}')">Hapus</button>
    `

    container.appendChild(div)
  })
}

// ==============================
// DELETE
// ==============================
window.deleteAnime = async (id) => {
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

  await supabase.from('episodes').insert([{
    anime_id,
    episode_number,
    download_link
  }])

  alert('Episode ditambahkan')
}

// ==============================
// INIT
// ==============================
loadAnime()