import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://eyrlxcfasxdciiovtjdv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cmx4Y2Zhc3hkY2lpb3Z0amR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Njg2MzUsImV4cCI6MjA5MzA0NDYzNX0.L7unxkUMAhZkyg5poNAfRWTbJ_UVpMDZ_oxwrCvihe0'

export const supabase = createClient(supabaseUrl, supabaseKey)