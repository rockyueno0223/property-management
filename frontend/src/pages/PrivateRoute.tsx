import { useAppContext } from "@/context/AppContext";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { user } = useAppContext();

  return user ? <Outlet/> : <Navigate to='/signin' />
}
