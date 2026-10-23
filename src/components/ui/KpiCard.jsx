function KpiCard({ label, value, subtitle, icon: Icon, color = "blue", onClick }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-50 text-slate-600",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow p-4 ${
        onClick ? "cursor-pointer hover:shadow-md transition" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase font-semibold text-slate-500 tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold mt-2 truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

export default KpiCard;