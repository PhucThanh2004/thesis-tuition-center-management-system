// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './app/routes/ProtectedRoute';
import { LoginModal } from './app/components/HomePage/LoginModal';
import { Home } from './app/pages/HomePage';
import { AdminHomePage } from './app/pages/admin/AdminHomePage';
import { MainLayout } from './app/pages/admin/MainAdminLayout';
import { StudentPage } from './app/pages/admin/StudentPage';
import { useState } from 'react';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onLoginClick={() => {
                setAuthMode('login');
                setIsLoginModalOpen(true);
              }}
              onRegisterClick={() => {
                setAuthMode('register');
                setIsLoginModalOpen(true);
              }}
            />
          }
        />

        {/* Trang Admin và các trang con của nó sẽ sử dụng MainLayout */}
        <Route path="/admin" element={<MainLayout />}>
          <Route
            path="home"
            element={
              <ProtectedRoute>
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          {/* Trang học sinh */}
          <Route
            path="student"
            element={
              <ProtectedRoute>
                <StudentPage />
              </ProtectedRoute>
            }
          />
          {/* Các trang khác thêm tương tự ở đây nha */}
        </Route>
      </Routes>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        defaultMode={authMode}
      />
    </BrowserRouter>
  );
}

export default App;
