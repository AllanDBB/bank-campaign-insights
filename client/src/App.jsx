import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./tabs/Table";
import Dashboard from "./tabs/dashboard/Dashboard";
import UsedFilters from "./tabs/UsedFilters";
import Prediction from "./pages/Prediction/Prediction";
import UserManagement from "./pages/UserManagement/UserManagement";
import { FilterProvider } from "./context/FilterContext";
import { ToastProvider, useToastContext } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAccessControl } from "./hooks/useAccessControl";
import ToastContainer from "./components/toast/ToastContainer";

function AppRoutes() {
  const access = useAccessControl();

  return (
    <Routes>
      <Route path="table" element={<ProtectedRoute requiredPermission="viewTable"><Table/></ProtectedRoute>}/>
      <Route path="dashboard" element={<ProtectedRoute requiredPermission="viewDashboard"><Dashboard/></ProtectedRoute>}/>
      <Route path="usedFilters" element={<ProtectedRoute requiredPermission="manageFilters"><UsedFilters/></ProtectedRoute>}/>
      <Route path="prediction" element={<ProtectedRoute requiredPermission="viewProspects"><Prediction/></ProtectedRoute>}/>
      {access.isManager && (
        <Route path="users" element={<UserManagement/>}/>
      )}
    </Routes>
  );
}

function AppContent() {
  const { toasts, removeToast } = useToastContext();

  return (
    <>
      <div style={{ display: "flex", height: '100vh', width: '100vw', overflow: 'hidden'}}>
        <Sidebar />
        <div style={{ flex: 1, padding: 0, backgroundColor: '#060606', overflow: 'auto'}}>
          <AppRoutes />
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <FilterProvider>
        <AppContent />
      </FilterProvider>
    </ToastProvider>
  );
}

export default App
