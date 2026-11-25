import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import AdminLayout from "../components/layout/AdminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import UserList from "../pages/users/UserList";
import KycQueue from "../pages/kyc/KycQueue";
import AccountRequests from "../pages/accountRequests/AccountRequests";
import AccountList from "../pages/accounts/AccountList";
import AccountDetail from "../pages/accounts/AccountDetail";
import TransactionList from "../pages/transactions/TransactionList";
import TransactionDetail from "../pages/transactions/TransactionDetail";
import BeneficiaryList from "../pages/beneficiaries/BeneficiaryList";
import FraudAlertList from "../pages/fraud/FraudAlertList";
import NotificationBroadcast from "../pages/notifications/NotificationBroadcast";
import AuditLog from "../pages/audit/AuditLog";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/kyc" element={<KycQueue />} />
            <Route path="/account-requests" element={<AccountRequests />} />
            <Route path="/accounts" element={<AccountList />} />
            <Route path="/accounts/:accountNumber" element={<AccountDetail />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/beneficiaries" element={<BeneficiaryList />} />
            <Route path="/fraud" element={<FraudAlertList />} />
            <Route path="/notifications" element={<NotificationBroadcast />} />
            <Route path="/audit" element={<AuditLog />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;