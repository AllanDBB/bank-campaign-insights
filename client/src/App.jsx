import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./tabs/Table";
import Dashboard from "./tabs/Dashboard";
import UsedFilters from "./tabs/UsedFilters";
import AdvancedAnalytics from "./tabs/AdvancedAnalytics";

function App() {
  return (
    <div style={{ display: "flex", height: '100vh', width: '100vw', overflow: 'hidden'}}>
      <Sidebar />
      <div style={{ flex: 1, padding: 0, backgroundColor: '#060606', overflow: 'auto'}}>
        <Routes>
          <Route path="table" element={<Table/>}/>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="usedFilters" element={<UsedFilters/>}/>
          <Route path="advanced" element={<AdvancedAnalytics/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App
