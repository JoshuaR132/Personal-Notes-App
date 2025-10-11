import { useEffect, useState } from "react";
import api from "../api";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🌗 Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // 📝 Fetch notes
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

  // ➕ Add note
  const addNote = async (note) => {
    try {
      const res = await api.post("/notes", note);
      setNotes([...notes, res.data]);
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note.");
    }
  };

  // ✏️ Update note
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

  // ❌ Delete note
  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete note.");
    }
  };

  // 🔍 Filtered notes
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  // 🌗 Toggle dark mode
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
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-all duration-300 p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-3xl font-bold text-center flex-1">📝 Personal Notes</h1>

        <div className="flex gap-4 absolute right-0">
          <button
            onClick={toggleDarkMode}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:scale-105 transition-transform"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={logout}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:scale-105 transition-transform"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search notes..."
          className="border p-2 rounded w-full md:w-1/2 dark:bg-gray-800 dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading / error */}
      {loading && <p className="text-center">Loading notes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Form */}
      {!loading && (
        <NoteForm onAdd={addNote} onUpdate={updateNote} editingNote={editingNote} />
      )}

      {/* List */}
      {!loading && filteredNotes.length > 0 ? (
        <NoteList notes={filteredNotes} onDelete={deleteNote} onEdit={setEditingNote} />
      ) : (
        !loading && <p className="text-center text-gray-500 mt-6">No notes yet.</p>
      )}
    </div>
  );
}
