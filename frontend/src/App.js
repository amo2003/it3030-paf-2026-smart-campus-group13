import LoginPage from "./M4/pages/LoginPage";
import LoginSuccessPage from "./M4/pages/LoginSuccessPage";
import ProtectedAdminPage from "./M4/components/ProtectedAdminPage";
import NotificationsPage from "./M4/pages/NotificationsPage";
import NotificationBell from "./M4/components/NotificationBell";

function App() {
  const path = window.location.pathname;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (path === "/login-success") {
    return (
      <div style={{ padding: "20px" }}>
        {currentUser && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <NotificationBell />
          </div>
        )}
        <LoginSuccessPage />
      </div>
    );
  }

  if (path === "/admin") {
    return (
      <div style={{ padding: "20px" }}>
        {currentUser && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <NotificationBell />
          </div>
        )}
        <ProtectedAdminPage />
      </div>
    );
  }

  if (path === "/notifications") {
    return (
      <div style={{ padding: "20px" }}>
        {currentUser && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <NotificationBell />
          </div>
        )}
        <NotificationsPage />
      </div>
    );
  }

  return <LoginPage />;
}

export default App;