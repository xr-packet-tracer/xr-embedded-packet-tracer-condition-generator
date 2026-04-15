import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders packet tracer generator header", () => {
  render(<App />);
  expect(
    screen.getByText(/Packet Tracer Condition Generator/i)
  ).toBeInTheDocument();
});
