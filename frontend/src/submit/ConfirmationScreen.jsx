export default function ConfirmationScreen({ issue, onReset }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="text-6xl">✅</div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Request Submitted</h2>
        <p className="text-gray-500 mt-2">
          Your maintenance request for <strong>{issue.room_label}</strong> ({issue.floor_label}) has
          been submitted. The housing manager has been notified.
        </p>
      </div>
      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-left text-sm space-y-1">
        <p><span className="font-medium">Issue:</span> {issue.issue_type}</p>
        <p><span className="font-medium">Location:</span> {issue.floor_label} · {issue.room_label}</p>
        <p><span className="font-medium">Submitted by:</span> {issue.submitter_name}</p>
      </div>
      <button
        onClick={onReset}
        className="w-full py-3 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 rounded-xl text-base font-medium transition-colors"
      >
        Submit another request
      </button>
    </div>
  )
}
