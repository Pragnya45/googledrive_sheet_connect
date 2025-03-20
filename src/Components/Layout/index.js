import { useState } from "react";
import { Outlet } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
//
import Header from "./Header";
import Sidebar from "./Sidebar";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  height: "100vh",
  width: "100%",
  overflowY: "hidden",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  overflow: "auto",
  minHeight: "100vh",
  padding: "24px",
  overflowY: "auto",
  paddingBottom: theme.spacing(10),
  backgroundColor: "#141420",
}));

// ----------------------------------------------------------------------

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      {/* <Header onOpenNav={() => setOpen(true)} /> */}
      <div
        style={{
          display: "flex",
          height: "100%",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Sidebar openNav={open} onCloseNav={() => setOpen(false)} />
        <div
          style={{
            // flexGrow: 1,
            width: "100%",
            overflowY: "auto",
            minHeight: "100vh",
            height: "100%",
            padding: "24px",
            overflowY: "auto",
            paddingBottom: "200px",
            backgroundColor: "#141420",
          }}
        >
          <Outlet />
        </div>
      </div>
    </StyledRoot>
  );
}
