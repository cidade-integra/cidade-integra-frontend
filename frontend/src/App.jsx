import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
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