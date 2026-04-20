import React from "react";
import AdminUsersPage from "../pages/AdminUsersPage";
import AccessDenied from "../pages/AccessDenied";

function ProtectedAdminPage() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserRole = currentUser?.role;

  return currentUserRole === "ADMIN"
    ? <AdminUsersPage />
    : <AccessDenied />;
}

export default ProtectedAdminPage;