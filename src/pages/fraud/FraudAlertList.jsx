import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ShieldX, AlertTriangle } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import FilterSelect from "../../components/ui/FilterSelect";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import RejectModal from "../../components/ui/RejectModal";
import fraudService from "../../features/fraud/fraudService";
import { formatDate } from "../../utils/format";

const STATUS_OPTIONS = ["OPEN", "DISMISSED", "ACTION_TAKEN"];
const SEVERITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

const severityBadge = (sev) => {
  const colors = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-amber-100 text-amber-800",
    HIGH: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[sev] || "bg-slate-100"}`}>
      {sev || "—"}
    </span>
  );
};

function FraudAlertList() {
  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("OPEN"); // default filter
  const [severity, setSeverity] = useState("");
  const [actionModal, setActionModal] = useState(null); // { type: 'dismiss'|'action', alert }

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fraudService.list({ status, severity, page, size: 20 });
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, [status, severity, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [status, severity]);

  const runAction = async (notes) => {
    if (!actionModal) return;
    try {
      if (actionModal.type === "dismiss") {
        await fraudService.dismiss(actionModal.alert.id, notes);
        setSuccess("Alert dismissed");
      } else {
        await fraudService.markAction(actionModal.alert.id, notes);
        setSuccess("Alert marked as ACTION_TAKEN");
      }
      setActionModal(null);
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
      setActionModal(null);
    }
  };

  const columns = [
    {
      key: "createdAt",
      label: "Detected",
      render: (a) => formatDate(a.createdAt),
    },
    {
      key: "transactionId",
      label: "Tx ID",
      render: (a) => (
        <span className="font-mono text-xs">
          {a.transactionId ? a.transactionId.slice(0, 8) + "…" : "—"}
        </span>
      ),
    },
    {
      key: "accountNumber",
      label: "Account",
      render: (a) => <span className="font-mono text-xs">{a.accountNumber}</span>,
    },
    { key: "rule", label: "Rule" },
    {
      key: "severity",
      label: "Severity",
      render: (a) => severityBadge(a.severity),
    },
    {
      key: "status",
      label: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: "reviewedBy",
      label: "Reviewed By",
      render: (a) => a.reviewedBy || "—",
    },
    {
      key: "notes",
      label: "Notes",
      render: (a) => a.notes || "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (a) =>
        a.status === "OPEN" ? (
          <div className="flex gap-3">
            <button
              onClick={() => setActionModal({ type: "dismiss", alert: a })}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm"
              title="Dismiss"
            >
              <CheckCircle2 size={14} /> Dismiss
            </button>
            <button
              onClick={() => setActionModal({ type: "action", alert: a })}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
              title="Mark action taken"
            >
              <ShieldX size={14} /> Action
            </button>
          </div>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        ),
    },
  ];

  const openCount = data.content.filter((a) => a.status === "OPEN").length;

  return (
    <div>
      <PageHeader
        title="Fraud Alerts"
        subtitle={
          status === "OPEN"
            ? `${openCount} open alert${openCount === 1 ? "" : "s"} on this page`
            : "Review and act on suspicious activity"
        }
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              placeholder="All statuses"
            />
            <FilterSelect
              value={severity}
              onChange={setSeverity}
              options={SEVERITY_OPTIONS}
              placeholder="All severities"
            />
          </div>
        }
      />

      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <DataTable
        columns={columns}
        rows={data.content}
        loading={loading}
        empty="No fraud alerts found"
      />
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />

      <RejectModal
        open={!!actionModal}
        title={
          actionModal?.type === "dismiss"
            ? "Dismiss alert"
            : "Mark action taken"
        }
        label={
          actionModal?.type === "dismiss"
            ? "Dismissal notes (optional)"
            : "Action taken notes (e.g., account frozen)"
        }
        onConfirm={runAction}
        onCancel={() => setActionModal(null)}
      />
    </div>
  );
}

export default FraudAlertList;