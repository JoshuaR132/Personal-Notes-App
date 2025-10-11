export default function NoteList({ notes, onDelete, onEdit }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div
          key={note._id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow transition-transform hover:scale-105"
        >
          <h2 className="font-bold text-xl mb-2">{note.title}</h2>
          <p className="text-gray-700 dark:text-gray-300">{note.content}</p>

          {note.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {note.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
              onClick={() => onEdit(note)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              onClick={() => onDelete(note._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
