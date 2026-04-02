export default function Step1Name({ name, onChange, onNext }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What's your name?</h2>
        <p className="text-gray-500 mt-1">So we can follow up with you if needed.</p>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder="First and last name"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
        autoComplete="name"
      />
      <button
        onClick={onNext}
        disabled={!name.trim()}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-lg font-medium transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
