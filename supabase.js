import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://eyrlxcfasxdciiovtjdv.supabase.co'
const supabaseKey = 'sb_publishable_qTaKyqdvHYQrpqUOm01w2A_0ZH06p66'

export const supabase = createClient(supabaseUrl, supabaseKey)