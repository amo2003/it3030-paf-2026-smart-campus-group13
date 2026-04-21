import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage        from "./M4/pages/LoginPage";
import LoginSuccessPage from "./M4/pages/LoginSuccessPage";
import NotificationsPage from "./M4/pages/NotificationsPage";
import AdminUsersPage   from "./M4/pages/AdminUsersPage";
import "./M4/styles/theme.css";

/* Simple auth guard */
const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/login-success" element={<LoginSuccessPage />} />
        <Route path="/profile"       element={<RequireAuth><LoginSuccessPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
        <Route path="/admin"         element={<RequireAuth><AdminUsersPage /></RequireAuth>} />
        <Route path="*"              element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;