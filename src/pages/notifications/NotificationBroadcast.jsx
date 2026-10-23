import { useCallback, useEffect, useState } from "react";
import { Send } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import notificationService from "../../features/notifications/notificationService";
import { formatDate, truncate } from "../../utils/format";

function NotificationBroadcast() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [userIds, setUserIds] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [data, setData] = useState({ content: [], totalPages: 0, page: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [userFilter, setUserFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.history({
        userId: userFilter,
        page,
        size: 20,
      });
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [userFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [userFilter]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Title and message are required");
      return;
    }

    const ids = userIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n));

    if (ids.length === 0) {
      setError("Provide at least one recipient user ID");
      return;
    }

    setSending(true);
    try {
      const res = await notificationService.broadcast({
        title: title.trim(),
        message: message.trim(),
        userIds: ids,
      });
      setSuccess(`Broadcast sent to ${res.sent} user(s)`);
      setTitle("");
      setMessage("");
      setUserIds("");
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Broadcast failed");
    } finally {
      setSending(false);
    }
  };

  const columns = [
    { key: "userId", label: "User ID" },
    { key: "subject", label: "Subject", render: (n) => n.subject || "—" },
    {
      key: "message",
      label: "Message",
      render: (n) => truncate(n.message, 40),
    },
    { key: "type", label: "Type", render: (n) => n.type || "—" },
    {
      key: "createdAt",
      label: "Sent",
      render: (n) => formatDate(n.createdAt),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Broadcast messages and view delivery history"
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

      {/* Broadcast form */}
      <form
        onSubmit={submit}
        className="bg-white rounded-lg shadow p-4 mb-6 space-y-3"
      >
        <h2 className="font-semibold text-sm uppercase text-slate-600">
          New Broadcast
        </h2>

        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            placeholder="e.g. Scheduled maintenance"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            placeholder="Message body…"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Recipient User IDs (comma-separated)
          </label>
          <input
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            placeholder="1,2,3"
          />
        </div>

        <button
          disabled={sending}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Send size={16} />
          {sending ? "Sending…" : "Broadcast"}
        </button>
      </form>

      {/* History */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-col sm:flex-row">
        <h2 className="font-semibold text-sm uppercase text-slate-600">
          Delivery History
        </h2>
        <input
          type="number"
          placeholder="Filter by user ID"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm sm:w-56"
        />
      </div>

      <DataTable
        columns={columns}
        rows={data.content}
        loading={loading}
        empty="No notifications yet"
      />
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
    </div>
  );
}

export default NotificationBroadcast;