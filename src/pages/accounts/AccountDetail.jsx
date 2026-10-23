import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import accountService from "../../features/accounts/accountService";
import { formatCurrency, formatDate } from "../../utils/format";

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-500 font-semibold">{label}</div>
      <div className="mt-1 text-sm text-slate-900">{value ?? "—"}</div>
    </div>
  );
}

function AccountDetail() {
  const { accountNumber } = useParams();
  const nav = useNavigate();
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    accountService
      .get(accountNumber)
      .then(setAccount)
      .catch((err) => setError(err.response?.data?.message || "Failed to load"));
  }, [accountNumber]);

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

  if (!account) return <p className="text-slate-500">Loading…</p>;

  return (
    <div>
      <button onClick={() => nav(-1)} className="flex items-center gap-1 text-sm text-blue-600 mb-4">
        <ArrowLeft size={16} /> Back to accounts
      </button>

      <PageHeader
        title={account.accountNumber}
        subtitle={account.accountHolderName}
        actions={<StatusBadge status={account.status} />}
      />

      <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Field label="Account ID" value={account.id} />
        <Field label="Account Number" value={account.accountNumber} />
        <Field label="Holder Name" value={account.accountHolderName} />
        <Field label="User ID" value={account.userId} />
        <Field label="Email" value={account.email} />
        <Field label="Phone" value={account.phone} />
        <Field label="Type" value={account.accountType} />
        <Field label="Status" value={<StatusBadge status={account.status} />} />
        <Field label="Balance" value={formatCurrency(account.balance)} />
        <Field label="Daily Limit" value={formatCurrency(account.dailyTransactionLimit)} />
        <Field label="Daily Transferred" value={formatCurrency(account.dailyTransferred)} />
        <Field label="Created" value={formatDate(account.createdAt)} />
        <Field label="Updated" value={formatDate(account.updatedAt)} />
      </div>
    </div>
  );
}

export default AccountDetail;