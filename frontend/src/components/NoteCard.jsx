export default function NoteCard({ note, onOpen }) {
  return (
    <div
      onClick={() => onOpen(note)}
      className="cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold mb-2">{note.title}</h3>

      {note.type === "text" ? (
        <p className="text-gray-700 text-sm whitespace-pre-line">
          {note.content?.slice(0, 120)}
          {note.content?.length > 120 && "..."}
        </p>
      ) : (
        <ul className="space-y-1">
          {note.tasks?.slice(0, 4).map((t, i) => (
            <li
              key={i}
              className={`text-sm ${
                t.completed ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              • {t.text}
            </li>
          ))}
          {note.tasks?.length > 4 && (
            <li className="text-gray-400 text-xs">+ more...</li>
          )}
        </ul>
      )}
    </div>
  );
}
