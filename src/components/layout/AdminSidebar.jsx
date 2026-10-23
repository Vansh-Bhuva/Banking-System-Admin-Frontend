import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../features/adminAuth/adminAuthSlice";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  CreditCard,
  ArrowLeftRight,
  UserCheck,
  AlertTriangle,
  Bell,
  ScrollText,
  LogOut,
  X,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/users", icon: Users },
  { name: "KYC Queue", path: "/kyc", icon: ShieldCheck },
  { name: "Accounts", path: "/accounts", icon: CreditCard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Beneficiaries", path: "/beneficiaries", icon: UserCheck },
  { name: "Fraud Alerts", path: "/fraud", icon: AlertTriangle },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Audit Log", path: "/audit", icon: ScrollText },
];

function AdminSidebar({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          w-64 h-screen shrink-0
          bg-slate-900 text-white flex flex-col
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-700">
          <span className="text-xl font-bold">Bank Admin</span>
          <button
            onClick={onClose}
            className="md:hidden text-slate-300 hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="m-2 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;
