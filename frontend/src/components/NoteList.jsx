export default function NoteList({ notes, onDelete }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div key={note._id} className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-xl mb-2">{note.title}</h2>
          <p className="text-gray-700">{note.content}</p>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            onClick={() => onDelete(note._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
