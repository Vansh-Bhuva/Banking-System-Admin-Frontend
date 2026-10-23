import { useCallback, useEffect, useState } from "react";
import { Lock, Unlock, ShieldCheck, ShieldOff } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import SearchBar from "../../components/ui/SearchBar";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import userService from "../../features/users/userService";
import { formatDate } from "../../utils/format";

function UserList() {
  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState(null); // { action: 'block'|'unblock', user }
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await userService.list({ search, page, size: 20 });
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setPage(0), 300);
    return () => clearTimeout(t);
  }, [search]);

  const runConfirmed = async () => {
    if (!confirm) return;
    const { action, user } = confirm;
    try {
      if (action === "block") await userService.block(user.id);
      else await userService.unblock(user.id);
      setConfirm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
      setConfirm(null);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "kycStatus",
      label: "KYC",
      render: (u) => <StatusBadge status={u.kycStatus} />,
    },
    {
      key: "blocked",
      label: "Status",
      render: (u) => (
        <StatusBadge status={u.blocked ? "BLOCKED" : "ACTIVE"} />
      ),
    },
    {
      key: "kycVerifiedAt",
      label: "KYC Verified",
      render: (u) => (u.kycVerifiedAt ? formatDate(u.kycVerifiedAt) : "—"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (u) =>
        u.role === "ADMIN" ? (
          <span className="text-slate-400 text-xs">—</span>
        ) : u.blocked ? (
          <button
            onClick={() => setConfirm({ action: "unblock", user: u })}
            className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
          >
            <Unlock size={14} /> Unblock
          </button>
        ) : (
          <button
            onClick={() => setConfirm({ action: "block", user: u })}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
          >
            <Lock size={14} /> Block
          </button>
        ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="All registered customers and admins"
        actions={<SearchBar value={search} onChange={setSearch} placeholder="Search name or email" />}
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <DataTable columns={columns} rows={data.content} loading={loading} empty="No users found" />
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />

      <ConfirmModal
        open={!!confirm}
        title={confirm?.action === "block" ? "Block user?" : "Unblock user?"}
        message={
          confirm
            ? `Are you sure you want to ${confirm.action} ${confirm.user.name} (${confirm.user.email})?`
            : ""
        }
        confirmText={confirm?.action === "block" ? "Block" : "Unblock"}
        danger={confirm?.action === "block"}
        onConfirm={runConfirmed}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

export default UserList;