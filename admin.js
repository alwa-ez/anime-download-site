import { supabase, supabaseUrl } from './supabase.js'

// AUTH CHECK
const { data: { user } } = await supabase.auth.getUser()
if (!user) location.href = '/login.html'

window.logout = async () => {
  await supabase.auth.signOut()
  location.href = '/login.html'
}

// ADD ANIME
addAnime.onclick = async () => {
  const title = document.getElementById('title').value
  const cover = document.getElementById('coverUrl').value

  await supabase.from('anime').insert([{ title, cover }])
  load()
}

// LOAD
async function load() {
  const { data } = await supabase.from('anime').select('*')
  animeList.innerHTML = ''

  data.forEach(a => {
    animeList.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <button onclick="del('${a.id}')">Hapus</button>
      </div>
    `
  })
}

window.del = async (id) => {
  await supabase.from('anime').delete().eq('id', id)
  load()
}

load()