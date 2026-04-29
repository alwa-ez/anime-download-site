import { supabase } from './supabase.js'

// ==============================
// AUTH PROTECTION (FIX)
// ==============================
const loading = document.getElementById('loading')
const app = document.getElementById('app')

const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  window.location.href = '/login.html'
} else {
  loading.style.display = 'none'
  app.style.display = 'flex'
}