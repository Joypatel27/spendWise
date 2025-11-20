

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Budgets from "./pages/Budgets";
import Accounts from "./pages/Accounts";
import Settings from "./pages/Settings";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router basename="/spendwise">
      <Routes>
        {/* The Layout component is now the parent of all your pages */}
           {/* --- PUBLIC ROUTES (No Layout) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={   <PrivateRoute>
              <Layout />
            </PrivateRoute>}>
          
          {/* Redirect from the base path to the dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Your pages will be rendered inside the Layout's <Outlet /> */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="reports" element={<Reports  />} />
          <Route path="budget" element={<Budgets />} />
          <Route path="settings" element={<Settings />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />



        </Route>
      </Routes>
    </Router>
  );
}

export default App;
