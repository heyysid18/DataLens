import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ListPage = lazy(() => import('./pages/ListPage'));
const DetailsPage = lazy(() => import('./pages/DetailsPage'));
const PhotoPage = lazy(() => import('./pages/PhotoPage'));
const ChartPage = lazy(() => import('./pages/ChartPage'));
const MapPage = lazy(() => import('./pages/MapPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Entry Route */}
              <Route path="/" element={<LoginPage />} />

              {/* Protected Routes Wrapper */}
              <Route element={<ProtectedRoute />}>
                <Route path="/list" element={<ListPage />} />
                <Route path="/details/:id" element={<DetailsPage />} />
                <Route path="/photo" element={<PhotoPage />} />
                <Route path="/chart" element={<ChartPage />} />
                <Route path="/map" element={<MapPage />} />
              </Route>

              {/* Fallback to root */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          {/* Global Toaster Configurations */}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-slate-800 dark:text-white border dark:border-slate-700 shadow-xl',
              duration: 4000
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
