import { useEffect, useState } from "react";
import api from "./api";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // 🌓 Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // 📝 Fetch notes
  useEffect(() => {
    api.get("/notes").then((res) => setNotes(res.data));
  }, []);

  // ➕ Add Note
  const addNote = async (note) => {
    const res = await api.post("/notes", note);
    setNotes([...notes, res.data]);
  };

  // ✏️ Update Note
  const updateNote = async (note) => {
    const res = await api.put(`/notes/${note._id}`, note);
    setNotes(notes.map((n) => (n._id === note._id ? res.data : n)));
    setEditingNote(null);
  };

  // ❌ Delete Note
  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter((n) => n._id !== id));
  };

  // 🔍 Filtered Notes
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  // 🌗 Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-all duration-300 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center w-full">
          📝 Personal Notes
        </h1>

        {/* 🌙 Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 right-8 px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:scale-105 transition-transform"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* 🔍 Search bar */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search notes..."
          className="border p-2 rounded w-1/2 dark:bg-gray-800 dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✏️ Note Form */}
      <NoteForm
        onAdd={addNote}
        onUpdate={updateNote}
        editingNote={editingNote}
      />

      {/* 📋 Note List */}
      <NoteList
        notes={filteredNotes}
        onDelete={deleteNote}
        onEdit={setEditingNote}
      />
    </div>
  );
}
