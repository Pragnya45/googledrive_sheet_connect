import { useSelector } from "react-redux";
import { adminState } from "../Redux/adminSlice";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const authenticated = useSelector(adminState)?.token;
  //const location = useLocation();

  return authenticated ? children : <Navigate to="/select-file" />;
}
