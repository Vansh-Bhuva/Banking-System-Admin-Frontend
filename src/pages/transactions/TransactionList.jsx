import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import FilterSelect from "../../components/ui/FilterSelect";
import DateRange from "../../components/ui/DateRange";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import RejectModal from "../../components/ui/RejectModal";
import transactionService from "../../features/transactions/transactionService";
import { formatCurrency, formatDate, truncate } from "../../utils/format";

const STATUS_OPTIONS = [
  "PROCESSING", "COMPLETED", "FAILED", "FLAGGED", "REVERSED",
];

function TransactionList() {
  const nav = useNavigate();
  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState({
    accountNumber: "",
    status: "",
    minAmount: "",
    maxAmount: "",
    from: "",
    to: "",
  });
  const [reverseTx, setReverseTx] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { ...filters, page, size: 20 };
      // convert datetime-local -> ISO
      if (params.from) params.from = new Date(params.from).toISOString();
      if (params.to) params.to = new Date(params.to).toISOString();
      const res = await transactionService.list(params);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(0);
  };

  const runReverse = async (reason) => {
    try {
      await transactionService.reverse(reverseTx.id, reason);
      setSuccess(`Transaction ${reverseTx.id.slice(0, 8)}… reversed`);
      setReverseTx(null);
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reverse failed");
      setReverseTx(null);
    }
  };

  const columns = [
    {
      key: "id",
      label: "Tx ID",
      render: (t) => (
        <button
          onClick={() => nav(`/transactions/${t.id}`)}
          className="font-mono text-blue-600 hover:underline text-xs"
        >
          {t.id.slice(0, 8)}…
        </button>
      ),
    },
    {
      key: "senderAccountNumber",
      label: "From",
      render: (t) => <span className="font-mono text-xs">{t.senderAccountNumber}</span>,
    },
    {
      key: "receiverAccountNumber",
      label: "To",
      render: (t) => <span className="font-mono text-xs">{t.receiverAccountNumber}</span>,
    },
    {
      key: "amount",
      label: "Amount",
      render: (t) => formatCurrency(t.amount),
    },
    { key: "type", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: "description",
      label: "Description",
      render: (t) => truncate(t.description, 20),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (t) => formatDate(t.createdAt),
    },
    {
      key: "actions",
      label: "Actions",
      render: (t) => (
        <div className="flex gap-3">
          <button
            onClick={() => nav(`/transactions/${t.id}`)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            title="View"
          >
            <Eye size={14} />
          </button>
          {t.status === "COMPLETED" && (
            <button
              onClick={() => setReverseTx(t)}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
              title="Reverse"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="All money movements"
      />

      {/* Filter row */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <SearchBar
            value={filters.accountNumber}
            onChange={(v) => setFilter("accountNumber", v)}
            placeholder="Account number"
          />
          <FilterSelect
            value={filters.status}
            onChange={(v) => setFilter("status", v)}
            options={STATUS_OPTIONS}
            placeholder="All statuses"
          />
          <input
            type="number"
            placeholder="Min amount"
            value={filters.minAmount}
            onChange={(e) => setFilter("minAmount", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max amount"
            value={filters.maxAmount}
            onChange={(e) => setFilter("maxAmount", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <DateRange
            from={filters.from}
            to={filters.to}
            onFromChange={(v) => setFilter("from", v)}
            onToChange={(v) => setFilter("to", v)}
          />
          <button
            onClick={() =>
              setFilters({
                accountNumber: "",
                status: "",
                minAmount: "",
                maxAmount: "",
                from: "",
                to: "",
              })
            }
            className="text-sm text-slate-600 hover:text-slate-900 border rounded-lg px-3 py-2 bg-slate-50"
          >
            Clear filters
          </button>
        </div>
      </div>

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
        empty="No transactions found"
      />
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />

      <RejectModal
        open={!!reverseTx}
        title={
          reverseTx
            ? `Reverse transaction ${reverseTx.id.slice(0, 8)}…?`
            : "Reverse transaction"
        }
        label="Reversal reason"
        onConfirm={runReverse}
        onCancel={() => setReverseTx(null)}
      />
    </div>
  );
}

export default TransactionList;