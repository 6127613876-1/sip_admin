import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
<Route path="/admin-login" element={<AdminLoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />


