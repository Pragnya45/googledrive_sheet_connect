import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  Link,
  Drawer,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import useResponsive from "../../hooks/useResponsive";
import Scrollbar from "../scrollbar";
import NavSection from "../nav-section/NavSection";
import avatar from "../../assets/images/avatars/avatar_default.jpg";
import SvgColor from "../svg-color";
import { adminLogoutFn } from "../../Redux/logoutSlice";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { adminState } from "../../Redux/adminSlice";
import Iconify from "../../Components/iconify";

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "Patients",
    path: "/",
    icon: icon("ic_user"),
  },
  //   {
  //     title: "Edit patients",
  //     path: "/dashboard/editPatients",
  //     icon: icon("ic_user"),
  //   },
  //   {
  //     title: "Search Patients",
  //     path: "/dashboard/search",
  //     icon: icon("ic_user"),
  //   },
  {
    title: "Select File",
    path: "/select-file",
    icon: icon("ic_user"),
  },
];
const NAV_WIDTH = 250;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "start",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Sidebar.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Sidebar({ openNav, onCloseNav, onOpenNav }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { token } = useSelector(adminState);

  const isDesktop = useResponsive("up", "lg");
  function signOut() {
    console.log("Signing out...");
    dispatch(adminLogoutFn()); // Clear token from Redux
  }
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: "inline-flex" }}>
        <img src="https://bhumio.com/favicon.ico" alt="" />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={avatar} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "white", fontWeight: 700 }}
              >
                Joy
              </Typography>

              <Typography variant="body2" sx={{ color: "white" }}>
                Admin
              </Typography>
              {token && (
                <Button
                  variant="outlined"
                  style={{
                    border: "none",
                    textAlign: "left",
                    alignItems: "flex-start",
                    padding: 0,
                    fontWeight: "600",
                  }}
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              )}
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
        background: "#2E2E49",
      }}
    >
      <IconButton
        onClick={onOpenNav}
        sx={{
          mr: 1,
          color: "text.primary",
          display: { lg: "none" },
        }}
      >
        <Iconify icon="eva:menu-2-fill" />
      </IconButton>
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: "#2E2E49",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH, bgcolor: "#2E2E49" },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
