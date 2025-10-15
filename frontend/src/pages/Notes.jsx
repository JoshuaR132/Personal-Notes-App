import { useEffect, useState, useCallback } from "react";
import api from "../api";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return [darkMode, toggle];
}

export default function Notes() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, toggleDarkMode] = useDarkMode();

  const handleApi = useCallback(async (apiCall, onSuccess, errorMsg) => {
    try {
      const res = await apiCall();
      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError(errorMsg || "Something went wrong.");
      toast.error(errorMsg || "Something went wrong.");
    }
  }, []);

  useEffect(() => {
    handleApi(
      () => api.get("/notes"),
      (data) => setNotes(data),
      "Failed to load notes."
    ).finally(() => setLoading(false));
  }, [handleApi]);

  const addNote = async (note) => {
    handleApi(
      () => api.post("/notes", note),
      (newNote) => {
        setNotes([...notes, newNote]);
        toast.success("Note added!");
      },
      "Failed to add note."
    );
  };

  const updateNote = async (note) => {
    handleApi(
      () => api.put(`/notes/${note._id}`, note),
      (updatedNote) => {
        setNotes(notes.map((n) => (n._id === updatedNote._id ? updatedNote : n)));
        setEditingNote(null);
        toast.success("Note updated!");
      },
      "Failed to update note."
    );
  };

  const deleteNote = async (id) => {
    handleApi(
      () => api.delete(`/notes/${id}`),
      () => {
        setNotes(notes.filter((n) => n._id !== id));
        toast.success("Note deleted!");
      },
      "Failed to delete note."
    );
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-all duration-300 p-8">
      <Toaster position="top-right" />

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

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search notes..."
          className="border p-2 rounded w-full md:w-1/2 dark:bg-gray-800 dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Loading notes...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <NoteForm onAdd={addNote} onUpdate={updateNote} editingNote={editingNote} />

          {filteredNotes.length > 0 ? (
            <NoteList notes={filteredNotes} onDelete={deleteNote} onEdit={setEditingNote} />
          ) : (
            <p className="text-center text-gray-500 mt-6">No notes yet.</p>
          )}
        </>
      )}
    </div>
  );
}
