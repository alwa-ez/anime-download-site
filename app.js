const searchInput = document.getElementById('search')

searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase()

  const filtered = data.filter(a =>
    a.title.toLowerCase().includes(keyword)
  )

  list.innerHTML = ''

  filtered.forEach(anime => {
    const div = document.createElement('div')
    div.className = 'card'

    div.innerHTML = `
      <img src="${anime.cover}">
      <h3>${anime.title}</h3>
      <a href="detail.html?id=${anime.id}">Lihat</a>
    `

    list.appendChild(div)
  })
})

const { count } = await supabase
  .from('visitors')
  .select('*', { count: 'exact', head: true })

document.getElementById('visitor').innerText = `Visitors: ${count}`