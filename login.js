import { supabase } from './supabase.js'

const btn = document.getElementById('loginBtn')
const errorMsg = document.getElementById('errorMsg')

// AUTO REDIRECT kalau sudah login
const { data: { session } } = await supabase.auth.getSession()
if (session) {
  location.href = '/admin.html'
}

// LOGIN
btn.onclick = async () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  errorMsg.innerText = ''

  if (!email || !password) {
    errorMsg.innerText = 'Email dan password wajib diisi'
    return
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    errorMsg.innerText = 'Login gagal: ' + error.message
  } else {
    location.href = '/admin.html'
  }
}