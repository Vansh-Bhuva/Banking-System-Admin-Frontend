import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import transactionService from "../../features/transactions/transactionService";
import { formatCurrency, formatDate } from "../../utils/format";

function Field({ label, value, mono }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-500 font-semibold">{label}</div>
      <div className={`mt-1 text-sm ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </div>
    </div>
  );
}

function TransactionDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tx, setTx] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    transactionService
      .get(id)
      .then(setTx)
      .catch((err) => setError(err.response?.data?.message || "Failed to load"));
  }, [id]);

  if (error) {
    return (
      <div>
        <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-blue-600 mb-4">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      </div>
    );
  }

  if (!tx) return <p className="text-slate-500">Loading…</p>;

  return (
    <div>
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-blue-600 mb-4">
        <ArrowLeft size={16} /> Back to transactions
      </button>

      <PageHeader
        title={tx.id}
        subtitle={`${formatCurrency(tx.amount)} · ${tx.type}`}
        actions={<StatusBadge status={tx.status} />}
      />

      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Field label="Transaction ID" value={tx.id} mono />
        <Field label="User ID" value={tx.userId} />
        <Field label="Type" value={tx.type} />
        <Field label="Sender" value={tx.senderAccountNumber} mono />
        <Field label="Receiver" value={tx.receiverAccountNumber} mono />
        <Field label="Amount" value={formatCurrency(tx.amount)} />
        <Field label="Status" value={<StatusBadge status={tx.status} />} />
        <Field label="Reference" value={tx.referenceNumber} mono />
        <Field label="Description" value={tx.description} />
        <Field label="Created" value={formatDate(tx.createdAt)} />
        <Field label="Completed" value={formatDate(tx.completedAt)} />
        <Field label="Failure Reason" value={tx.failureReason} />
      </div>
    </div>
  );
}

export default TransactionDetail;