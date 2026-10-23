function DataTable({ columns, rows, loading, empty = "No data" }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!rows?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-slate-500">
        {empty}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-t-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="text-left px-4 py-3 font-semibold whitespace-nowrap"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="hover:bg-slate-50">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                  {c.render ? c.render(row) : row[c.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;