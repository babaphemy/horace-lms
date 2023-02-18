import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={muiTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
