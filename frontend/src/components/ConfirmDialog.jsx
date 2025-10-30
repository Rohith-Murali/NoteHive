export default function ConfirmDialog({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  text="Delete",
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur">
      <div className="rounded-xl p-6 shadow-xl text-center max-w-sm w-full" style={{ background: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--card-border)' }}>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg hover:bg-gray-400"
            style={{ background: 'var(--hover-bg)', color: 'var(--text-color)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white rounded-lg"
            style={{ background: 'var(--danger-color)' }}
          >
            {text}
          </button>
        </div>
      </div>
    </div>
  );
}
