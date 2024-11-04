import { createClient } from '@/utils/supabase/server';
import NoteGrid from '@/components/note-grid';
export default async function Page() {
  const supabase = await createClient();

  const { data: notes, error } = await supabase.from('notes').select('*');

  if (error) {
    console.error('Error fetching notes:', error);
    return <div>Error loading notes</div>;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('notes:', notes);

  return (
    <div>
      <NoteGrid notes={notes} uid={user?.id} />
    </div>
  );
}
