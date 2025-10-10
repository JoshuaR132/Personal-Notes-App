import { useEffect, useState } from "react";
import api from "./api";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

export default function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.get("/notes").then(res => setNotes(res.data));
  }, []);

  const addNote = async (note) => {
    const res = await api.post("/notes", note);
    setNotes([...notes, res.data]);
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter(n => n._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">📝 Personal Notes</h1>
      <NoteForm onAdd={addNote} />
      <NoteList notes={notes} onDelete={deleteNote} />
    </div>
  );
}
