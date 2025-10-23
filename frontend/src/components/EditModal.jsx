import { Modal } from "react-bootstrap";

export default function EditModal({
  show,
  title,
  value,
  onChange,
  onSave,
  onClose,
  onEnter,
}) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdropClassName="backdrop-blur"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title || "Edit"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          className="w-full border rounded-lg px-3 py-2"
          autoFocus
        />
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  );
}
