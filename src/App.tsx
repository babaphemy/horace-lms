import "./App.css";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./assets/styles/theme";
import { Route, Routes } from "react-router-dom";
import Home from "./views/home/Home";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
