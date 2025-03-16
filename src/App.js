import logo from "./logo.svg";
import "./App.css";
import AddPatientsPage from "./pages/AddPatientsPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Patients from "./pages/Patients";
import Layout from "./Components/Layout";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Patients />} />
            {/* <Route path="/patient" element={<Patients />} /> */}
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
