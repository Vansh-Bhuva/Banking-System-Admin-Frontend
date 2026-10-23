const colorMap = {
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-green-100 text-green-800",
  FULL_KYC: "bg-green-100 text-green-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  BLOCKED: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800",
  FROZEN: "bg-red-100 text-red-800",
  DORMANT: "bg-amber-100 text-amber-800",
  PENDING: "bg-amber-100 text-amber-800",
  PENDING_COOLING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  OTP_EKYC: "bg-blue-100 text-blue-800",
  OPEN: "bg-amber-100 text-amber-800",
  DISMISSED: "bg-slate-100 text-slate-600",
  ACTION_TAKEN: "bg-red-100 text-red-800",
};

function StatusBadge({ status }) {
  if (!status) return <span className="text-slate-400">—</span>;
  const cls = colorMap[status] || "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default StatusBadge;