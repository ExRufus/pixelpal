import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_APIKEY
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase;