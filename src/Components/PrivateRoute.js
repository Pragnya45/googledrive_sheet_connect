import { useSelector } from "react-redux";
import { adminState } from "../Redux/adminSlice";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const authenticated = useSelector(adminState)?.token;
  const { fileId } = useSelector(adminState);

  return authenticated && fileId ? children : <Navigate to="/select-file" />;
}
