import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./tabs/Table";
import Dashboard from "./tabs/Dashboard";
import UsedFilters from "./tabs/UsedFilters";

function App() {
  return (
    <div style={{ display: "flex", height: '100vh', width: '100vw'}}>
      <Sidebar />
      <div style={{ flex: 1, padding: 0, backgroundColor: '#060606'}}>
        <Routes>
          <Route path="table" element={<Table/>}/>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="usedFilters" element={<UsedFilters/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App
