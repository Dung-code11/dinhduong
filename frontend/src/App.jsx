import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import RegisterExpert from "./pages/RegisterExpert";
import FoodTable from "./pages/FoodTable";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registerexpert" element={<RegisterExpert />} />
          <Route path="/foodtable" element={<FoodTable />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
