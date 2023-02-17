import React from "react";
import { screen, render, act } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
const muiTheme = {};

describe("App", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, email: "femi" }]),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders without breaking", () => {
    const { container } = render(
      <BrowserRouter>
        <ThemeProvider theme={muiTheme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(container).toBeDefined();
  });
  it("renders the H1 tag", () => {
    const { getByText } = render(
      <BrowserRouter>
        <ThemeProvider theme={muiTheme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    );
    const txtH1 = getByText("Horace Learning");
    expect(txtH1).toBeInTheDocument();
  });
  it("renders the email", async () => {
    await act(async () =>
      render(
        <BrowserRouter>
          <ThemeProvider theme={muiTheme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      )
    );
    const txtEmail = screen.getAllByText("femi");
    expect(txtEmail.length).toBe(1);
  });
});
