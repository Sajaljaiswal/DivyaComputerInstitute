import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lyyzrqevbbtmtjdlhdbn.supabase.co"

const supabaseKey = "sb_publishable__fhwJiQcAs3iLaBDwGjVrg_IOv9kUkl"

export const supabase = createClient(supabaseUrl, supabaseKey)
