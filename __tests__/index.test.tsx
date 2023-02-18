import React from "react";
import { screen, render, act } from "@testing-library/react";
import Home from "../pages";
import "@testing-library/jest-dom";

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
    const { container } = render(<Home />);
    expect(container).toBeDefined();
  });
  it("renders the H1 tag", () => {
    const { getByText } = render(<Home />);
    const txtH1 = getByText("Horace Learning");
    expect(txtH1).toBeInTheDocument();
  });
  it("renders the email", async () => {
    await act(async () => render(<Home />));
    const txtEmail = screen.getAllByText("femi");
    expect(txtEmail.length).toBe(1);
  });
});
