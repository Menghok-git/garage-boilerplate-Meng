'use client'

import { useMemo } from 'react'
import { where } from 'firebase/firestore'
import { useCollection } from '@/hooks/useFirestore'
import { useAuth } from '@/hooks/useAuth'
import { getNotesCollection } from '@/lib/firebase/firestore'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'

export function NotesList() {
  const { user } = useAuth()
  const notesCollection = useMemo(() => getNotesCollection(), [])
  const { data: notes, loading, error } = useCollection(notesCollection, where('uid', '==', user?.uid ?? ''))

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <pre className="text-xs bg-zinc-100 p-2 rounded mb-4">
        {JSON.stringify({ uid: user?.uid, emailVerified: user?.emailVerified }, null, 2)}
      </pre>
      {error && <div className="text-sm text-red-500">Error: {error.message}</div>}
      {!error && notes.length === 0 && <EmptyState title="No notes yet" />}
      {!error && notes.length > 0 && (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border p-4">
              <h3 className="font-medium">{note.title}</h3>
              <p className="text-sm text-zinc-500">{note.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}