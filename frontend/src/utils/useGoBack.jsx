import { useNavigate, useLocation } from "react-router-dom";

const useGoBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    // Se o usuário acessou diretamente (sem histórico anterior), redireciona para /
    if (window.history.length <= 2 || location.key === "default") {
      navigate("/", { replace: true });
    } else {
      navigate(-1);
    }
  };

  return goBack;
};

export default useGoBack;
