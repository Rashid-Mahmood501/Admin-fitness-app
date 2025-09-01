interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  description: string;
  deleteButton?: string;
}

export default function DeleteModal({
  onCancel,
  onConfirm,
  description,
  deleteButton = "Yes, Delete",
}: Props) {
  return (
    <div className=" bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg text-red-600 font-semibold mb-2">
          Are you sure?
        </h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 border-gray-800 text-black"
            onClick={onCancel}
          >
            No
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={onConfirm}
          >
            {deleteButton}
          </button>
        </div>
      </div>
    </div>
  );
}
