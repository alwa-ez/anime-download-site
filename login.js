import { supabase } from './supabase.js'

loginBtn.onclick = async () => {
  const email = email.value
  const password = password.value

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (!error) location.href = '/admin.html'
}