import { useLocation, Navigate, Outlet } from "react-router-dom";
import api from "@src/config/axios";
import { useAuth } from "@src/context/AuthProvider";
import Loading from "@src/pages/Loading";

export default function ProtectedRoute() {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  let isLoading = false;
  if (!auth.isAuth && localStorage.getItem("token") !== null) {
    isLoading = true;
    api
      .get("/auth")
      .then((res) => {
        if (res.status !== 200) {
          localStorage.removeItem("token");
          setAuth({
            isAuth: false,
            token: "",
            data: undefined,
            user: undefined,
          });
          isLoading = false;
          return;
        }
        setAuth({
          isAuth: true,
          token: res.data.token,
          data: res.data.data,
          user: res.data.user,
        });
        isLoading = false;
      })
      .catch((err) => {
        setAuth({
          isAuth: false,
          token: "",
          data: undefined,
          user: undefined,
        });
        isLoading = false;
        localStorage.removeItem("token");
      });
  }
  if (isLoading) {
    return <Loading/>;
  }
  return auth?.isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
