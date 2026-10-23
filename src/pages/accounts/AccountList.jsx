import { useCallback, useEffect, useState } from "react";
import { Snowflake, Lock, Unlock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import FilterSelect from "../../components/ui/FilterSelect";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import accountService from "../../features/accounts/accountService";
import { formatCurrency, formatDate, truncate } from "../../utils/format";

const STATUS_OPTIONS = ["ACTIVE", "FROZEN", "DORMANT", "BLOCKED", "CLOSED"];

function AccountList() {
  const nav = useNavigate();
  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState(null); // { action, account }
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await accountService.list({ search, status, page, size: 20 });
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setPage(0), 300);
    return () => clearTimeout(t);
  }, [search, status]);

  const runConfirmed = async () => {
    if (!confirm) return;
    try {
      if (confirm.action === "freeze") await accountService.freeze(confirm.account.accountNumber);
      else if (confirm.action === "unfreeze") await accountService.unfreeze(confirm.account.accountNumber);
      else if (confirm.action === "dormant") await accountService.markDormant(confirm.account.accountNumber);
      setConfirm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
      setConfirm(null);
    }
  };

  const columns = [
    {
      key: "accountNumber",
      label: "Account",
      render: (a) => (
        <button
          onClick={() => nav(`/accounts/${a.accountNumber}`)}
          className="font-mono text-blue-600 hover:underline"
        >
          {a.accountNumber}
        </button>
      ),
    },
    { key: "accountHolderName", label: "Holder" },
    { key: "email", label: "Email", render: (a) => truncate(a.email, 24) },
    { key: "accountType", label: "Type" },
    {
      key: "balance",
      label: "Balance",
      render: (a) => formatCurrency(a.balance),
    },
    {
      key: "dailyTransactionLimit",
      label: "Daily Limit",
      render: (a) => formatCurrency(a.dailyTransactionLimit),
    },
    {
      key: "status",
      label: "Status",
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: "createdAt",
      label: "Opened",
      render: (a) => formatDate(a.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (a) => (
        <div className="flex gap-3">
          <button
            onClick={() => nav(`/accounts/${a.accountNumber}`)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            title="View"
          >
            <Eye size={14} />
          </button>
          {a.status === "ACTIVE" && (
            <button
              onClick={() => setConfirm({ action: "freeze", account: a })}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
              title="Freeze"
            >
              <Lock size={14} />
            </button>
          )}
          {a.status === "FROZEN" && (
            <button
              onClick={() => setConfirm({ action: "unfreeze", account: a })}
              className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
              title="Unfreeze"
            >
              <Unlock size={14} />
            </button>
          )}
          {(a.status === "ACTIVE" || a.status === "FROZEN") && (
            <button
              onClick={() => setConfirm({ action: "dormant", account: a })}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm"
              title="Mark Dormant"
            >
              <Snowflake size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const confirmTitle = {
    freeze: "Freeze account?",
    unfreeze: "Unfreeze account?",
    dormant: "Mark account dormant?",
  }[confirm?.action];

  const confirmMessage = confirm
    ? `Account ${confirm.account.accountNumber} (${confirm.account.accountHolderName}) — ${confirm.action}.`
    : "";

  return (
    <div>
      <PageHeader
        title="Accounts"
        subtitle="All bank accounts"
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            <SearchBar value={search} onChange={setSearch} placeholder="Search account or holder" />
            <FilterSelect
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              placeholder="All statuses"
            />
          </div>
        }
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <DataTable
        columns={columns}
        rows={data.content}
        loading={loading}
        empty="No accounts found"
      />
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />

      <ConfirmModal
        open={!!confirm}
        title={confirmTitle}
        message={confirmMessage}
        confirmText={confirm?.action === "unfreeze" ? "Unfreeze" : confirm?.action === "dormant" ? "Mark Dormant" : "Freeze"}
        danger={confirm?.action !== "unfreeze"}
        onConfirm={runConfirmed}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

export default AccountList;