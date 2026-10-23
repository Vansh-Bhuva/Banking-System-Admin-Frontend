import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import auditService from "../../features/audit/auditService";
import { formatDate, truncate } from "../../utils/format";

const TABS = [
  { key: "auth", label: "Users & KYC" },
  { key: "account", label: "Accounts" },
  { key: "transaction", label: "Transactions" },
];

const KNOWN_ACTIONS = {
  auth: ["APPROVE_KYC", "REJECT_KYC", "BLOCK_USER", "UNBLOCK_USER"],
  account: ["FREEZE_ACCOUNT", "UNFREEZE_ACCOUNT", "MARK_DORMANT"],
  transaction: ["REVERSE_TXN", "ACTIVATE_BENEFICIARY", "BLOCK_BENEFICIARY"],
};

function AuditLog() {
  const [tab, setTab] = useState("auth");
  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [action, setAction] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await auditService.fetch(tab, {
        action: action.trim(),
        page,
        size: 20,
      });
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load audit log");
      setData({ content: [], totalPages: 0, page: 0 });
    } finally {
      setLoading(false);
    }
  }, [tab, action, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setAction("");
    setPage(0);
  }, [tab]);

  useEffect(() => {
    setPage(0);
  }, [tab, action]);

  const columns = [
    { key: "id", label: "ID", render: (a) => <span className="font-mono text-xs">{a.id?.slice(0, 8)}…</span> },
    {
      key: "createdAt",
      label: "When",
      render: (a) => formatDate(a.createdAt),
    },
    { key: "actorUserId", label: "Actor" },
    { key: "actorEmail", label: "Email" },
    {
      key: "action",
      label: "Action",
      render: (a) => <StatusBadge status={a.action} />,
    },
    { key: "targetType", label: "Target Type" },
    {
      key: "targetId",
      label: "Target ID",
      render: (a) => (
        <span className="font-mono text-xs">
          {a.targetId ? truncate(a.targetId, 16) : "—"}
        </span>
      ),
    },
    {
      key: "beforeState",
      label: "Before",
      render: (a) => (
        <span className="text-xs text-slate-600">{truncate(a.beforeState, 30)}</span>
      ),
    },
    {
      key: "afterState",
      label: "After",
      render: (a) => (
        <span className="text-xs text-slate-600">{truncate(a.afterState, 30)}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="Trail of every admin action"
        actions={
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">All actions</option>
            {KNOWN_ACTIONS[tab].map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        }
      />

      <div className="flex gap-1 mb-4 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={data.content}
        loading={loading}
        empty="No audit entries"
      />
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
    </div>
  );
}

export default AuditLog;