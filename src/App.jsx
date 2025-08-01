import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import  AdminLoginPage  from './pages/AdminLoginPage';
import  {AdminDashboard}  from './pages/AdminDashboard';
import  ProtectedRoute  from './components/ProtectedRoute';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
