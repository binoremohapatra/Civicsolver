import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner'; // ✅ Import directly from the library
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* ✅ Add richColors and position for better visibility */}
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;