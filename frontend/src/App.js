import LoginPage from "./M4/pages/LoginPage";
import LoginSuccessPage from "./M4/pages/LoginSuccessPage";
import ProtectedAdminPage from "./M4/components/ProtectedAdminPage";

function App() {
  const path = window.location.pathname;

  if (path === "/login-success") {
    return <LoginSuccessPage />;
  }

  if (path === "/admin") {
    return <ProtectedAdminPage />;
  }

  return <LoginPage />;
}

export default App;