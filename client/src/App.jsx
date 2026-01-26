import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Cart from './pages/Cart';
import DocumentRequest from './pages/DocumentRequest';
import AdminDashboard from './pages/AdminDashboard';
import Support from './pages/Support';
import DigitalId from './pages/DigitalId';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/login', '/verify-email'].includes(location.pathname);

  if (hideLayout) {
    return children;
  }

  return (
    <>
      <Navbar />
      <main className="container-padding pb-12 max-w-7xl mx-auto">
        {children}
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          zIndex: 99999,
          top: 60, // Push it down a bit so it's not covered by the very top edge if blocked
        }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Navigate to="/login" replace />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<Navigate to="/login" replace />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/request-document" element={<DocumentRequest />} />
              <Route path="/support" element={<Support />} />
              <Route path="/digital-id" element={<DigitalId />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
