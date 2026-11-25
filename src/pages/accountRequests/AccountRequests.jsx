import { useCallback, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import RejectModal from "../../components/ui/RejectModal";
import accountRequestService from "../../features/accountRequests/accountRequestService";
import { formatDate } from "../../utils/format";

const TABS = ["PENDING", "APPROVED", "REJECTED"];

function AccountRequests() {
    const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState("PENDING");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [approveReq, setApproveReq] = useState(null);
    const [rejectReq, setRejectReq] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await accountRequestService.list({ status, page, size: 20 });
            setData(res);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load account requests");
        } finally {
            setLoading(false);
        }
    }, [status, page]);

    useEffect(() => {
        load();
    }, [load]);

    const flash = (msg) => {
        setSuccess(msg);
        setTimeout(() => setSuccess(""), 3000);
    };

    const runApprove = async () => {
        try {
            await accountRequestService.approve(approveReq.id);
            flash(`Approved ${approveReq.name}. Login details were emailed.`);
            setApproveReq(null);
            load();
        } catch (err) {
            setError(err.response?.data?.message || "Approve failed");
            setApproveReq(null);
        }
    };

    const runReject = async (reason) => {
        try {
            await accountRequestService.reject(rejectReq.id, reason);
            flash(`Rejected ${rejectReq.name}`);
            setRejectReq(null);
            load();
        } catch (err) {
            setError(err.response?.data?.message || "Reject failed");
            setRejectReq(null);
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "dateOfBirth", label: "DOB" },
        { key: "aadhaarMasked", label: "Aadhaar" },
        { key: "panMasked", label: "PAN" },
        {
            key: "status",
            label: "Status",
            render: (r) => <StatusBadge status={r.status} />,
        },
        {
            key: "submittedAt",
            label: "Submitted",
            render: (r) => formatDate(r.submittedAt),
        },
        {
            key: "actions",
            label: "Actions",
            render: (r) =>
                r.status === "PENDING" ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setApproveReq(r)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                        >
                            <Check size={14} /> Approve
                        </button>
                        <button
                            onClick={() => setRejectReq(r)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                        >
                            <X size={14} /> Reject
                        </button>
                    </div>
                ) : (
                    <span className="text-slate-400 text-sm">{r.rejectionReason || "—"}</span>
                ),
        },
    ];

    return (
        <div>
            <PageHeader
                title="Account Requests"
                subtitle="New customers waiting for bank approval (email already verified)"
            />

            <div className="flex gap-2 mb-4">
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => {
                            setStatus(t);
                            setPage(0);
                        }}
                        className={`px-4 py-2 text-sm rounded border ${status === t
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {success && (
                <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm">{success}</div>
            )}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <DataTable
                columns={columns}
                rows={data.content}
                loading={loading}
                empty={`No ${status.toLowerCase()} requests`}
            />
            <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />

            <ConfirmModal
                open={!!approveReq}
                title="Approve account request?"
                message={
                    approveReq
                        ? `Approve ${approveReq.name} (${approveReq.email})? A customer login will be created and a temporary password will be emailed.`
                        : ""
                }
                confirmText="Approve"
                onConfirm={runApprove}
                onCancel={() => setApproveReq(null)}
            />

            <RejectModal
                open={!!rejectReq}
                title={rejectReq ? `Reject request — ${rejectReq.name}` : "Reject request"}
                label="Rejection reason (emailed to the applicant)"
                onConfirm={runReject}
                onCancel={() => setRejectReq(null)}
            />
        </div>
    );
}

export default AccountRequests;