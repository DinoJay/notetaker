'use client';
import { createClient } from '@/utils/supabase/client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useState } from 'react';
import DialogVaul from './dialog-vaul';
import { Input } from './ui/input';

const NoteCard = ({ note }: { note: any }) => {
  return (
    <Card>
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

const NoteForm = ({
  onSubmit,
}: {
  onSubmit: (title: string, text: string) => Promise<void>;
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(title, text);
      }}
    >
      <Input
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        name="title"
        placeholder="Title"
      />
      <Input
        onChange={(e) => setText(e.target.value)}
        type="text"
        name="text"
        placeholder="Text"
      />
      <Button type="submit">Create</Button>
    </form>
  );
};

const NoteGrid = ({ notes, uid }: { notes: any[]; uid: string }) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const [dialogOpen, setDialogOpen] = useState(false);
  const supabase = createClient();

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
      const { data, error } = await supabase
        .from('notes')
        .insert([{ title, text, user_id: uid }])
        .select()
        .single();

      if (error) throw error;

      // Refresh the page to show the new note
      setDialogOpen(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div
      ref={parent}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <NewNoteCard
        onClick={() => {
          setDialogOpen(true);
        }}
      />
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
      <DialogVaul
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Create New Note"
        description="Add a new note to your collection"
      >
        <NoteForm
          onSubmit={async (title, text) =>
            handleCreateNote({ title, text, uid })
          }
        />
      </DialogVaul>{' '}
    </div>
  );
};

export default NoteGrid;
