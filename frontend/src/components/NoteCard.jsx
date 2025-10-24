export default function NoteCard({ note, onOpen }) {
  return (
    <div
      onClick={() => onOpen(note)}
      className="cursor-pointer bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold mb-2">{note.title}</h3>

      {note.type === "text" ? (
        <p className="text-gray-700 text-sm whitespace-pre-line">
          Note
        </p>
      ) : (
        <p className="text-gray-700 text-sm whitespace-pre-line">
          Tasks
        </p>
      )}
    </div>
  );
}
