import { useSelector } from "react-redux";
import { adminState } from "../Redux/adminSlice";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const authenticated = useSelector(adminState)?.token;

  return authenticated ? children : <Navigate to="/select-file" />;
}
