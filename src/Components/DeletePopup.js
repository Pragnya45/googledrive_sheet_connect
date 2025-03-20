import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

export default function DeletePopup({
  message,
  loading,
  handleClose,
  handleConfirm,
}) {
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: "#273142",
          width: "400px",
          borderRadius: "16px",
          border: "1px solid #313D4F",
          padding: "24px",
        },
      }}
    >
      <DialogTitle>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#fff", fontSize: "20px" }}
        >
          {message}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          paddingTop: "8px",
        }}
      >
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            backgroundColor: "#fff",
            color: "#5142FD",
            fontSize: "18px",
            width: "100%",
            height: "35px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            backgroundColor: "#5142FD",
            color: "#fff",
            fontSize: "18px",
            width: "100%",
            height: "35px",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#4035d9",
            },
          }}
        >
          {loading ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={1}
            >
              Confirm <CircularProgress size={18} color="inherit" />
            </Box>
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
