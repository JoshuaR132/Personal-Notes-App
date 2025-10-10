import { useState } from "react";

export default function NoteForm({ onAdd }) {
  const [note, setNote] = useState({ title: "", content: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.title || !note.content) return;
    onAdd(note);
    setNote({ title: "", content: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-2"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        placeholder="Write your note..."
        className="border p-2 w-full mb-2"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Note
      </button>
    </form>
  );
}
