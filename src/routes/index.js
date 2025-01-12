import { Routes, Route } from "react-router-dom";
import SingIn from "../pages/SingIn";
import SingUp from "../pages/SingUp";
import Dashboard from "../pages/Dashboard";
import Private from "./Private";
import Profile from "../pages/Profile";
import Customers from "../pages/Customers";
import New from "../pages/New";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SingIn />} />
      <Route path="/register" element={<SingUp />} />
      <Route
        path="/dashboard"
        element={
          <Private>
            <Dashboard />
            <Private />
          </Private>
        }
      />
      <Route
        path="/profile"
        element={
          <Private>
            <Profile />
          </Private>
        }
      />
      <Route
        path="/new"
        element={
          <Private>
            <New />
          </Private>
        }
      />
      <Route
        path="/new/:id"
        element={
          <Private>
            <New />
          </Private>
        }
      />
      <Route
        path="/customers"
        element={
          <Private>
            <Customers />
          </Private>
        }
      />
    </Routes>
  );
}
export default AppRoutes;
