import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Interview from "./pages/Interview";
import Dashboard from "./pages/Dashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Admin from "./pages/Admin";
import Jobs from "./pages/Jobs";
import Demo from "./pages/Demo";
import LanguageSelect from "./pages/LanguageSelect";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/language" element={<LanguageSelect />} />
      </Routes>
    </BrowserRouter>
  );
}
