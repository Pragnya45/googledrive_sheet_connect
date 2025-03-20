import React from "react";
import { Breadcrumbs, Typography, Box } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

function Breadcrumb({ page, category }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        mb: 1,
      }}
    >
      <Breadcrumbs
        separator={<ChevronRightRoundedIcon sx={{ color: "white" }} />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-separator": {
            margin: "0 4px",
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "white",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          Dashboard
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "white",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          {page}
        </Typography>

        {category && (
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontSize: "14px",
              fontWeight: "400",
            }}
          >
            {category}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
}

export default Breadcrumb;
