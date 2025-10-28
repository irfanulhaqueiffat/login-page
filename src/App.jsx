
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegisterPage from './components/registration';
import { getCookie } from './utils/cookies';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const accessToken = getCookie('accessToken');
  const loginExpiration = getCookie('loginExpiration');

  if (!accessToken || !loginExpiration || new Date().getTime() > parseInt(loginExpiration)) {
    // Redirect to login if not authenticated or session expired
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
