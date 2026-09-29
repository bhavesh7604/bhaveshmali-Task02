export default function StatusBadge({ acknowledged, pendingLabel = 'Not submitted' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
        acknowledged
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-amber-50 text-amber-600'
      }`}
    >
      {acknowledged ? '✓ Acknowledged' : pendingLabel}
    </span>
  )
}
