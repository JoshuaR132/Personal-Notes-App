import { useEffect, useState } from "react";
import api from "./api";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    api.get("/notes").then(res => setNotes(res.data));
  }, []);

  const addNote = async (note) => {
    const res = await api.post("/notes", note);
    setNotes([...notes, res.data]);
  };

  const updateNote = async (note) => {
    const res = await api.put(`/notes/${note._id}`, note);
    setNotes(notes.map(n => (n._id === note._id ? res.data : n)));
    setEditingNote(null);
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter(n => n._id !== id));
  };

  const [search, setSearch] = useState("");

const filteredNotes = notes.filter(note =>
  note.title.toLowerCase().includes(search.toLowerCase()) ||
  note.content.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900 dark:text-white transition-all">
      <h1 className="text-3xl font-bold mb-4 text-center">📝 Personal Notes</h1>
      <NoteForm 
        onAdd={addNote} 
        onUpdate={updateNote} 
        editingNote={editingNote}
      />
      <NoteList 
        notes={notes} 
        onDelete={deleteNote} 
        onEdit={setEditingNote}
      />

          <div className="mb-4 text-center">
      <input
        type="text"
        placeholder="Search notes..."
        className="border p-2 rounded w-1/2 dark:bg-gray-800 dark:border-gray-700"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
    </div>
  );
}
