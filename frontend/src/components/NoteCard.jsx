export default function NoteCard({ note, onOpen }) {
  return (
    <div
      onClick={() => onOpen(note)}
      className="cursor-pointer border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
      <p className="text-gray-700 text-sm whitespace-pre-line">
        {note.type ? (note.type === "text" ? "Note" : "Task") : "NoteBook"}
      </p>
    </div>
  );
}
