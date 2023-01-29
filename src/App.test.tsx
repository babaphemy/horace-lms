import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
const muiTheme = {};
describe("App", () => {
  it("renders a ThemeProvider with the `muiTheme` and Routes with a Route to the Home component", () => {
    const { getByTestId } = render(<App />);
    const themeProvider = getByTestId("theme-provider");
    expect(themeProvider).toBeInTheDocument();

    const routes = getByTestId("routes");
    expect(routes).toBeInTheDocument();

    const route = getByTestId("route-home");
    expect(route).toBeInTheDocument();
  });
});
