import { useCallback, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import RejectModal from "../../components/ui/RejectModal";
import kycService from "../../features/kyc/kycService";
import { formatDate } from "../../utils/format";

function KycQueue() {
  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [approveUser, setApproveUser] = useState(null);
  const [rejectUser, setRejectUser] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await kycService.pending({ page, size: 20 });
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load KYC queue");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const runApprove = async () => {
    try {
      await kycService.approve(approveUser.id);
      setSuccess(`KYC approved for ${approveUser.name}`);
      setApproveUser(null);
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Approve failed");
      setApproveUser(null);
    }
  };

  const runReject = async (reason) => {
    try {
      await kycService.reject(rejectUser.id, reason);
      setSuccess(`KYC rejected for ${rejectUser.name}`);
      setRejectUser(null);
      load();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reject failed");
      setRejectUser(null);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "kycStatus",
      label: "KYC",
      render: (u) => <StatusBadge status={u.kycStatus} />,
    },
    { key: "ytdCredits", label: "YTD Credits" },
    {
      key: "actions",
      label: "Actions",
      render: (u) => (
        <div className="flex gap-2">
          <button
            onClick={() => setApproveUser(u)}
            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
          >
            <Check size={14} /> Approve
          </button>
          <button
            onClick={() => setRejectUser(u)}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
          >
            <X size={14} /> Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="KYC Queue"
        subtitle="Users awaiting KYC verification"
      />

      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={data.content}
        loading={loading}
        empty="No pending KYC requests"
      />
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />

      <ConfirmModal
        open={!!approveUser}
        title="Approve KYC?"
        message={
          approveUser
            ? `Approve KYC for ${approveUser.name} (${approveUser.email})? This grants FULL_KYC status.`
            : ""
        }
        confirmText="Approve"
        onConfirm={runApprove}
        onCancel={() => setApproveUser(null)}
      />

      <RejectModal
        open={!!rejectUser}
        title={rejectUser ? `Reject KYC — ${rejectUser.name}` : "Reject KYC"}
        label="Rejection reason"
        onConfirm={runReject}
        onCancel={() => setRejectUser(null)}
      />
    </div>
  );
}

export default KycQueue;