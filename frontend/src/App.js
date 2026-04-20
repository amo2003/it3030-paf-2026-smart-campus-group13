import NotificationsPage from "./M4/pages/NotificationsPage";
import NotificationBell from "./M4/components/NotificationBell";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <NotificationBell />
      </div>

      <NotificationsPage />
    </div>
  );
}

export default App;