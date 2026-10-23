import { useState } from "react";
import { X } from "lucide-react";

function RejectModal({ open, title = "Reject", label = "Reason", onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  if (!open) return null;

  const submit = () => {
    if (!reason.trim()) {
      setErr("Reason is required");
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    setErr("");
  };

  const close = () => {
    setReason("");
    setErr("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={close} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <label className="text-sm font-medium">{label}</label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErr("");
            }}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter reason…"
          />
          {err && <p className="text-red-600 text-xs">{err}</p>}
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t bg-slate-50">
          <button
            onClick={close}
            className="px-4 py-2 text-sm border rounded hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 text-sm rounded text-white bg-red-600 hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectModal;