import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  ArrowLeftRight,
  AlertTriangle,
  ShieldAlert,
  Wallet,
  TrendingUp,
  IndianRupee,
  RotateCcw,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import KpiCard from "../../components/ui/KpiCard";
import StatusBadge from "../../components/ui/StatusBadge";
import DataTable from "../../components/ui/DataTable";
import statsService from "../../features/stats/statsService";
import fraudService from "../../features/fraud/fraudService";
import transactionService from "../../features/transactions/transactionService";
import { formatCurrency, formatDate } from "../../utils/format";

function AdminDashboard() {
  const nav = useNavigate();
  const [stats, setStats] = useState(null);
  const [openAlerts, setOpenAlerts] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, alerts, tx] = await Promise.all([
        statsService.fetchAll(),
        fraudService.list({ status: "OPEN", page: 0, size: 5 }),
        transactionService.list({ page: 0, size: 5 }),
      ]);
      setStats(s);
      setOpenAlerts(alerts.content || []);
      setRecentTx(tx.content || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="text-slate-500">Loading dashboard…</p>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
    );
  }

  const alertColumns = [
    {
      key: "rule",
      label: "Rule",
      render: (a) => <span className="font-medium">{a.rule}</span>,
    },
    {
      key: "accountNumber",
      label: "Account",
      render: (a) => <span className="font-mono text-xs">{a.accountNumber}</span>,
    },
    {
      key: "severity",
      label: "Severity",
      render: (a) => <StatusBadge status={a.severity} />,
    },
    {
      key: "createdAt",
      label: "Detected",
      render: (a) => formatDate(a.createdAt),
    },
  ];

  const txColumns = [
    {
      key: "id",
      label: "Tx",
      render: (t) => (
        <span className="font-mono text-xs">{t.id?.slice(0, 8)}…</span>
      ),
    },
    {
      key: "senderAccountNumber",
      label: "From",
      render: (t) => (
        <span className="font-mono text-xs">{t.senderAccountNumber}</span>
      ),
    },
    {
      key: "receiverAccountNumber",
      label: "To",
      render: (t) => (
        <span className="font-mono text-xs">{t.receiverAccountNumber}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (t) => formatCurrency(t.amount),
    },
    {
      key: "status",
      label: "Status",
      render: (t) => <StatusBadge status={t.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Banking system overview"
        actions={
          <button
            onClick={load}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        }
      />

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Total Users"
          value={stats.users.totalUsers}
          subtitle={`${stats.users.pendingKyc} pending KYC`}
          icon={Users}
          color="blue"
          onClick={() => nav("/users")}
        />
        <KpiCard
          label="Total Accounts"
          value={stats.accounts.totalAccounts}
          subtitle={`${stats.accounts.activeAccounts} active`}
          icon={CreditCard}
          color="green"
          onClick={() => nav("/accounts")}
        />
        <KpiCard
          label="Total Deposits"
          value={formatCurrency(stats.accounts.totalDeposits)}
          subtitle="Across all accounts"
          icon={Wallet}
          color="slate"
        />
        <KpiCard
          label="Open Fraud Alerts"
          value={stats.fraud.openAlerts}
          subtitle={`${stats.fraud.totalAlerts} total`}
          icon={AlertTriangle}
          color="red"
          onClick={() => nav("/fraud")}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Today's Transactions"
          value={stats.transactions.todayTransactions}
          subtitle={`${formatCurrency(stats.transactions.todayVolume)} volume`}
          icon={TrendingUp}
          color="blue"
          onClick={() => nav("/transactions")}
        />
        <KpiCard
          label="Completed"
          value={stats.transactions.completedTransactions}
          subtitle={`${stats.transactions.totalTransactions} total`}
          icon={ArrowLeftRight}
          color="green"
        />
        <KpiCard
          label="Reversed"
          value={stats.transactions.reversedTransactions}
          subtitle="Admin reversals"
          icon={RotateCcw}
          color="amber"
        />
        <KpiCard
          label="Blocked Users"
          value={stats.users.blockedUsers}
          subtitle={`${stats.users.fullKyc} full KYC`}
          icon={ShieldAlert}
          color="red"
          onClick={() => nav("/users")}
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-700">
              Open Fraud Alerts
            </h2>
            <button
              onClick={() => nav("/fraud")}
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
          <DataTable
            columns={alertColumns}
            rows={openAlerts}
            empty="No open alerts"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-700">
              Recent Transactions
            </h2>
            <button
              onClick={() => nav("/transactions")}
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
          <DataTable
            columns={txColumns}
            rows={recentTx}
            empty="No transactions yet"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;