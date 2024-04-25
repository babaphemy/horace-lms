import React from "react";
import FooterLte from "./FooterLte";
import Header from "../Header";
import { Box, Container } from "@mui/material";

type ClassLayoutProps = {
  children: React.ReactNode;
};

const ClassLayout = ({ children }: ClassLayoutProps) => {
  return (
    <div>
      <Header />
      <Box
        sx={{
          background:
            "linear-gradient(197.86deg, #F59B9B 17.24%, #1B9CC3 69.35%, #107797 83.49%)",
          minHeight: "300px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          p: 5,
        }}
      />
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2, md: 4 } }}>
        <div className="w-full relative md:-top-56 md:-mb-56">{children}</div>
      </Container>
      <FooterLte />
    </div>
  );
};

export default ClassLayout;
