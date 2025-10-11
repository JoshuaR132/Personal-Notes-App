import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Notes from "./pages/Notes";
import Login from "./pages/Login";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/notes" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/notes" /> : <Login />}
        />
        <Route
          path="/notes"
          element={token ? <Notes /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
