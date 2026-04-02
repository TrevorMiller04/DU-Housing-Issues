export default function Step4IssueType({ room, onSelect }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's the issue?</h2>
        <p className="text-gray-500 mt-1">Select the issue type in {room.label}.</p>
      </div>
      <div className="flex flex-col gap-2">
        {room.issueTypes.map((type) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 font-medium text-gray-900 transition-colors"
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  )
}
