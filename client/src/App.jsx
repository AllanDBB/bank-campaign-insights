import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./tabs/Table";
import Dashboard from "./tabs/dashboard/Dashboard";
import UsedFilters from "./tabs/UsedFilters";
import Prediction from "./pages/Prediction/Prediction";
import UserManagement from "./pages/UserManagement/UserManagement";
import { FilterProvider } from "./context/FilterContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAccessControl } from "./hooks/useAccessControl";

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

function App() {
  return (
    <FilterProvider>
      <div style={{ display: "flex", height: '100vh', width: '100vw', overflow: 'hidden'}}>
        <Sidebar />
        <div style={{ flex: 1, padding: 0, backgroundColor: '#060606', overflow: 'auto'}}>
          <AppRoutes />
        </div>
      </div>
    </FilterProvider>
  );
}

export default App
