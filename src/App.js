import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import { ToastContainer, toast } from "react-toastify";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer autoClose={3000} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
