"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAutoAnimate } from "@formkit/auto-animate/react"


const NoteCard = ({ note }: { note: any }) => {
  return <Card>
    <CardHeader>
      <CardTitle >{note.title}</CardTitle>
    </CardHeader>
    <CardContent className="line-clamp-4">
    {note.text}

    </CardContent>

  </Card>
}

const NoteGrid = ({ notes }: { notes: any[] }) => {
    const [parent, enableAnimations] = useAutoAnimate(/* optional config */)

  return <div ref={parent} 
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{
    notes.map((note) => <NoteCard key={note.id} note={note} />)}
    </div>
}

export default NoteGrid
