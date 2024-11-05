'use client';
import { createClient } from '@/utils/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRef, useState } from 'react';
import DialogVaul from './dialog-vaul';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

const NoteCard = ({ note, onClick }: { note: any; onClick: () => void }) => {
  return (
    <Card onClick={onClick}>
      <CardHeader>
        <CardTitle className="line-clamp-1">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="line-clamp-4">{note.text}</CardContent>
    </Card>
  );
};

const NewNoteCard = ({ onClick }: { onClick: () => void }) => (
  <Card className="bg-white text-black" onClick={onClick}>
    <CardHeader>
      <CardTitle>New Note</CardTitle>
    </CardHeader>
    <CardContent>Write your note...</CardContent>
  </Card>
);

const NewNoteForm = ({
  onSubmit,
}: {
  onSubmit: (title: string, text: string) => void;
  note?: { title: string; text: string };
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  return (
    <form
      className="flex-1 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(title, text);
      }}
    >
      <Input
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        type="text"
        name="title"
        placeholder="Title"
      />

      <Textarea
        value={text}
        className="flex-1"
        onChange={(e) => setText(e.target.value)}
        name="text"
        placeholder="Text"
      />
      <Button
        type="submit"
        disabled={text === ''}
        className={cn(text === '' && 'opacity-50')}
      >
        Create
      </Button>
    </form>
  );
};

const UpdateNoteForm = ({
  onChange,
  note,
}: {
  onChange: (note: { title: string; text: string; id: string }) => void;
  note?: { title: string | undefined; text: string | undefined; id: string };
}) => {
  return (
    <form
      className="flex-1 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Input
        onChange={(e) => {
          onChange({
            title: e.target.value,
            text: note?.text || '',
            id: note?.id || '',
          });
        }}
        value={note?.title || ''}
        type="text"
        name="title"
        placeholder="Title"
      />

      <Textarea
        value={note?.text || ''}
        className="flex-1"
        onChange={(e) =>
          onChange({
            title: note?.title || '',
            text: e.target.value,
            id: note?.id || '',
          })
        }
        name="text"
        placeholder="Text"
      />
    </form>
  );
};
const NEW_NOTE_ID = 'new';

const CREATE_TYPE = 'create';
const EDIT_TYPE = 'edit';

const NoteGrid = ({
  notes: initialNotes,
  uid,
}: {
  notes: any[];
  uid: string;
}) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState(initialNotes);
  const supabase = createClient();

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const handleCreateNote = async ({
    title,
    text,
    uid,
  }: {
    title: string;
    text: string;
    uid: string;
  }) => {
    try {
      const { error, data } = await supabase
        .from('notes')
        .insert([{ title, text, user_id: uid }])
        .select()
        .single();

      if (error) throw error;
      setNotes([...notes, { id: data.id, title, text, user_id: uid }]);
      setSelectedNoteId(null);
      // Refresh the page to show the new note
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleUpdateNote = async ({
    title,
    text,
    id,
  }: {
    title: string;
    text: string;
    id: string;
  }) => {
    try {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Update local state immediately
      setNotes(
        notes.map((note) => (note.id === id ? { ...note, title, text } : note))
      );

      // Debounce the API call
      timeoutRef.current = setTimeout(async () => {
        const { error } = await supabase
          .from('notes')
          .update({ title, text })
          .eq('id', id);

        if (error) throw error;
      }, 1000);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  console.log('selectedNote', selectedNote);

  return (
    <div
      ref={parent}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <NewNoteCard
        onClick={() => {
          setSelectedNoteId(NEW_NOTE_ID);
        }}
      />
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => setSelectedNoteId(note.id)}
        />
      ))}

      <DialogVaul
        open={selectedNoteId !== null}
        onOpenChange={() => setSelectedNoteId(null)}
        title={
          selectedNoteId === NEW_NOTE_ID ? 'Create New Note' : (
            selectedNote?.title
          )
        }
        description={
          selectedNoteId === NEW_NOTE_ID ?
            'Add a new note to your collection'
          : 'Edit your note'
        }
      >
        {selectedNoteId === NEW_NOTE_ID ?
          <NewNoteForm
            key={selectedNoteId}
            note={selectedNote}
            onSubmit={(title, text) => {
              handleCreateNote({ title, text, uid });
            }}
          />
        : <UpdateNoteForm
            onChange={(n) => {
              handleUpdateNote(n);
            }}
            note={selectedNote}
          />
        }
      </DialogVaul>
    </div>
  );
};

export default NoteGrid;
