import { supabase } from './supabase.js'

document.getElementById('loginBtn').onclick = async () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert('Login gagal')
  } else {
    location.href = '/admin.html'
  }
}