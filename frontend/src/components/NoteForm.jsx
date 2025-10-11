import { useState, useEffect } from "react";

export default function NoteForm({ onAdd, onUpdate, editingNote }) {
  const [note, setNote] = useState({ title: "", content: "", tags: "" });

  // 📝 Pre-fill form when editing
  useEffect(() => {
    if (editingNote) {
      setNote({
        title: editingNote.title,
        content: editingNote.content,
        tags: editingNote.tags?.join(", ") || "",
        _id: editingNote._id,
      });
    } else {
      setNote({ title: "", content: "", tags: "" });
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.title || !note.content) return;

    // 🔹 Format tags as array
    const formattedNote = {
      ...note,
      tags: note.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (editingNote) onUpdate(formattedNote);
    else onAdd(formattedNote);

    setNote({ title: "", content: "", tags: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4 transition-colors"
    >
      <input
        type="text"
        placeholder="Title"
        className="border dark:border-gray-700 p-2 w-full mb-2 bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        placeholder="Write your note..."
        className="border dark:border-gray-700 p-2 w-full mb-2 bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="border dark:border-gray-700 p-2 w-full mb-2 bg-transparent rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        value={note.tags}
        onChange={(e) => setNote({ ...note, tags: e.target.value })}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition transform hover:scale-105"
      >
        {editingNote ? "Update Note" : "Add Note"}
      </button>
    </form>
  );
}
