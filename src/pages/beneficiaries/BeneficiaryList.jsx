import { useState } from "react";
import { Zap, Ban, Search } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import beneficiaryService from "../../features/beneficiaries/beneficiaryService";
import { formatDate } from "../../utils/format";

function BeneficiaryList() {
  const [userId, setUserId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null); // { action, beneficiary }
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    if (!userId.trim()) {
      setError("Enter a user ID");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await beneficiaryService.list(userId.trim());
      setRows(res);
      setLoaded(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load beneficiaries");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const runConfirmed = async () => {
    if (!confirm) return;
    try {
      if (confirm.action === "activate") {
        await beneficiaryService.activate(confirm.beneficiary.id);
      } else {
        await beneficiaryService.block(confirm.beneficiary.id);
      }
      setConfirm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
      setConfirm(null);
    }
  };

  const columns = [
    { key: "beneficiaryName", label: "Name" },
    {
      key: "accountNumber",
      label: "Account",
      render: (b) => <span className="font-mono text-xs">{b.accountNumber}</span>,
    },
    { key: "ifsc", label: "IFSC", render: (b) => b.ifsc || "—" },
    { key: "nickname", label: "Nickname", render: (b) => b.nickname || "—" },
    {
      key: "status",
      label: "Status",
      render: (b) => <StatusBadge status={b.status} />,
    },
    {
      key: "coolingEndsAt",
      label: "Cooling Ends",
      render: (b) =>
        b.status === "PENDING_COOLING" ? formatDate(b.coolingEndsAt) : "—",
    },
    {
      key: "createdAt",
      label: "Added",
      render: (b) => formatDate(b.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (b) => (
        <div className="flex gap-3">
          {b.status !== "ACTIVE" && (
            <button
              onClick={() => setConfirm({ action: "activate", beneficiary: b })}
              className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
              title="Force activate"
            >
              <Zap size={14} /> Activate
            </button>
          )}
          {b.status !== "BLOCKED" && (
            <button
              onClick={() => setConfirm({ action: "block", beneficiary: b })}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
              title="Block"
            >
              <Ban size={14} /> Block
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Beneficiaries"
        subtitle="Lookup and manage beneficiaries per user"
      />

      <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="number"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <button
          onClick={load}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Load
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {loaded ? (
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          empty="No beneficiaries for this user"
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center text-slate-500 text-sm">
          Enter a user ID and click Load
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title={confirm?.action === "activate" ? "Force activate?" : "Block beneficiary?"}
        message={
          confirm
            ? `${confirm.action === "activate" ? "Activate" : "Block"} ${confirm.beneficiary.beneficiaryName} (${confirm.beneficiary.accountNumber})?`
            : ""
        }
        confirmText={confirm?.action === "activate" ? "Activate" : "Block"}
        danger={confirm?.action === "block"}
        onConfirm={runConfirmed}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

export default BeneficiaryList;