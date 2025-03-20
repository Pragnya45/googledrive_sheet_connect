import { useState } from "react";
import { Outlet } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
//
import Sidebar from "./Sidebar";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")({
  display: "flex",
  height: "100vh",
  width: "100%",
  overflowY: "hidden",
});

// ----------------------------------------------------------------------

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <div
        style={{
          display: "flex",
          height: "100%",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Sidebar
          openNav={open}
          onOpenNav={() => setOpen(true)}
          onCloseNav={() => setOpen(false)}
        />
        <div
          className="custom-scrollbar"
          style={{
            width: "100%",
            overflowY: "auto",
            minHeight: "100vh",
            height: "100%",
            padding: "24px",
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
