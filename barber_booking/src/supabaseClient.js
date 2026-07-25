import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'
const supabaseKey = 'UCBBZCj2I9lOvz9e'

export const supabase = createClient(supabaseUrl, supabaseKey)