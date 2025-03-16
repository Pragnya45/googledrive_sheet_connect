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
import EditPatientPage from "./pages/EditPatientsPage";
import CreatePatientsPage from "./pages/AddPatientsPage";
import GoogleDrivePage from "./pages/GoogleDrivePage";
import Providers from "./Providers";

function App() {
  return (
    <Providers>
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Patients />} />
              <Route path="edit-patient/:id" element={<EditPatientPage />} />
              <Route path="create-patient" element={<CreatePatientsPage />} />
              <Route path="select-file" element={<GoogleDrivePage />} />
            </Route>
          </Routes>
        </Router>
      </HelmetProvider>
    </Providers>
  );
}

export default App;
