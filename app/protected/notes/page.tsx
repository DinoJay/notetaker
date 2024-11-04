import { createClient } from '@/utils/supabase/server'
import NoteGrid from './note-grid'
const supabaseUrl = 'https://fhvjbmdwsdfclrkdxwls.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
export default async function Page() {
  const supabase = await createClient()
  
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')

  if (error) {
    console.error('Error fetching notes:', error)
return <div>Error loading notes</div>
  }

  console.log('notes:', notes)

  return <div><NoteGrid notes={notes} /></div>
}