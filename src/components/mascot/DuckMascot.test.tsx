
import { render } from "@testing-library/react";
import { DuckMascot } from "./DuckMascot";

describe("DuckMascot", () => {
  it("renders Thinking mode correctly", () => {
    const { container } = render(<DuckMascot mode="thinking" />);
    // Check if SVG is present
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // Thinking mode specific elements (e.g., question mark text is likely present in DOM)
    // Note: Framer motion might render elements differently, but basic SVG structure should be there.
  });

  it("renders Party mode correctly", () => {
    const { container } = render(<DuckMascot mode="party" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders Lonely mode correctly", () => {
    const { container } = render(<DuckMascot mode="lonely" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders Teacher mode correctly", () => {
    const { container } = render(<DuckMascot mode="teacher" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
