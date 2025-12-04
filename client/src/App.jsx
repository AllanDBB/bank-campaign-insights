import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./tabs/Table";
import Dashboard from "./tabs/dashboard/Dashboard";
import UsedFilters from "./tabs/UsedFilters";
import Prediction from "./pages/Prediction/Prediction";
import UserManagement from "./pages/UserManagement/UserManagement";
import { FilterProvider } from "./context/FilterContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <FilterProvider>
      <div style={{ display: "flex", height: '100vh', width: '100vw', overflow: 'hidden'}}>
        <Sidebar />
        <div style={{ flex: 1, padding: 0, backgroundColor: '#060606', overflow: 'auto'}}>
          <Routes>
            <Route path="table" element={<ProtectedRoute requiredPermission="viewTable"><Table/></ProtectedRoute>}/>
            <Route path="dashboard" element={<ProtectedRoute requiredPermission="viewDashboard"><Dashboard/></ProtectedRoute>}/>
            <Route path="usedFilters" element={<ProtectedRoute requiredPermission="viewFilters"><UsedFilters/></ProtectedRoute>}/>
            <Route path="prediction" element={<ProtectedRoute requiredPermission="viewPrediction"><Prediction/></ProtectedRoute>}/>
            <Route path="users" element={<ProtectedRoute requiredPermission="manageUsers"><UserManagement/></ProtectedRoute>}/>
          </Routes>
        </div>
      </div>
    </FilterProvider>
  );
}

export default App
