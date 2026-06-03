"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Alert, Snackbar, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AuthProvider from "@/lib/AuthProvider";
import { ReduxProvider } from "@/redux/reduxProvider";
import { useDispatch, useSelector } from "react-redux";
import { getApiStatus, resetStates } from "@/redux/features/apiStatusSlice";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        body: themeParam.palette.mode === "dark" ? darkScrollbar() : null,
      }),
    },
  },
  typography: {
    // h1: {
    //   fontSize: "1.5rem",
    // },
    h2: {
      fontSize: "30px",
    },
    h3: {
      fontSize: "36px",
    },
    h4: {
      fontSize: "28px",
    },
    h5: {
      fontSize: "24px",
    },
    h6: {
      fontSize: "20px",
    },
    subtitle1: {
      fontSize: "16px",
    },
    subtitle2: {
      fontSize: "17px",
    },
    body1: {
      fontSize: "18px",
    },
    body2: {
      fontSize: "14px",
    },
  },
});

// export const metadata = {
//   title: "NextAuth Tutorial",
//   description: "Learn NextAuth.js by Dave Gray",
// };

export default function RootLayout({ children }) {
  return (
    <ReduxProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <main className="flex justify-center items-start p-6 min-h-screen">
                  <SnackBarComponent />
                  {children}
                </main>
              </LocalizationProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </ReduxProvider>
  );
}

const SnackBarComponent = () => {
  const statusState = useSelector(getApiStatus);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(resetStates());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={statusState?.isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={statusState.isSuccess === true ? "success" : "error"}
        sx={{ width: "100%" }}
      >
        {statusState?.message || ""}
      </Alert>
    </Snackbar>
  );
};
