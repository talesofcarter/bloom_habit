import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";

function App() {
  const isAuthenticated = true;

  return (
    <main>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
