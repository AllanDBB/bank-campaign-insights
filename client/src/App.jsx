import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Table from "./tabs/Table";
import Dashboard from "./tabs/dashboard/Dashboard";
import UsedFilters from "./tabs/UsedFilters";
import Prediction from "./pages/Prediction/Prediction";
import { FilterProvider } from "./context/FilterContext";

function App() {
  return (
    <FilterProvider>
      <div style={{ display: "flex", height: '100vh', width: '100vw', overflow: 'hidden'}}>
        <Sidebar />
        <div style={{ flex: 1, padding: 0, backgroundColor: '#060606', overflow: 'auto'}}>
          <Routes>
            <Route path="table" element={<Table/>}/>
            <Route path="dashboard" element={<Dashboard/>}/>
            <Route path="usedFilters" element={<UsedFilters/>}/>
            <Route path="prediction" element={<Prediction/>}/>
          </Routes>
        </div>
      </div>
    </FilterProvider>
  );
}

export default App
