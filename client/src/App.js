import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home            from "./pages/Home";
import SignIn          from "./pages/SignIn";
import SignUp          from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard  from "./pages/AdminDashboard";

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "admin") return <Navigate to="/library" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/signin"  element={<SignIn />} />
        <Route path="/signup"  element={<SignUp />} />
        <Route path="/library" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}