import { useEffect, useState } from "react";
import api from "./api";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🌗 Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // 📝 Fetch notes (on mount)
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError("Could not load notes. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // ➕ Add Note
  const addNote = async (note) => {
    try {
      const res = await api.post("/notes", note);
      setNotes([...notes, res.data]);
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note. Please try again.");
    }
  };

  // ✏️ Update Note
  const updateNote = async (note) => {
    try {
      const res = await api.put(`/notes/${note._id}`, note);
      setNotes(notes.map((n) => (n._id === note._id ? res.data : n)));
      setEditingNote(null);
    } catch (err) {
      console.error("Error updating note:", err);
      alert("Failed to update note.");
    }
  };

  // ❌ Delete Note
  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
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

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // 🧭 Render
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-all duration-300 p-8">
      {/* Header */}
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

        {/* 🚪 Logout */}
        <button
          onClick={logout}
          className="absolute top-6 right-36 px-3 py-2 bg-red-500 text-white rounded text-sm hover:scale-105 transition-transform"
        >
          Logout
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

      {/* 📦 Loading or Error */}
      {loading && <p className="text-center">Loading notes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* ✏️ Note Form */}
      {!loading && (
        <NoteForm
          onAdd={addNote}
          onUpdate={updateNote}
          editingNote={editingNote}
        />
      )}

      {/* 📋 Note List */}
      {!loading && filteredNotes.length > 0 ? (
        <NoteList
          notes={filteredNotes}
          onDelete={deleteNote}
          onEdit={setEditingNote}
        />
      ) : (
        !loading && (
          <p className="text-center text-gray-500 mt-6">No notes yet.</p>
        )
      )}
    </div>
  );
}
