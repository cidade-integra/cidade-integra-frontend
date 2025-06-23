import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Faq from "./pages/Faq";
import { useKeyboardNavigation } from "./hooks/useAccessibility";


function App() {

  useKeyboardNavigation();

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
