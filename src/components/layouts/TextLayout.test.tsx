import React from "react";
import { render, screen } from "@testing-library/react";

// Component
import TextLayout from "./TextLayout";

test("should display the TextLayout page", () => {
  render(<TextLayout>My input</TextLayout>);
  expect(screen.getByText("My input")).toBeInTheDocument();
});
