export default function ConfirmationModal({ message, onConfirm, onCancel, passwordInput, output, result }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>

        {passwordInput && (
        <div className="mb-4">
          {passwordInput}
        </div>
        )}

        {output && <p className="text-blue-600 mb-4">{output}</p>}
        {result && <p className="text-red-500 mb-4">{result}</p>}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
