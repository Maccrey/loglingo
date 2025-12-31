
import { render } from "@testing-library/react";
import { DuckMascot } from "./DuckMascot";

describe("DuckMascot", () => {
  it("renders Thinking mode correctly", () => {
    const { container, getByAltText } = render(<DuckMascot mode="thinking" />);
    // Check if Image is present by alt text
    const img = getByAltText("Loglingo Duck Mascot");
    expect(img).toBeInTheDocument();
  });

  it("renders Party mode correctly", () => {
    const { getByAltText } = render(<DuckMascot mode="party" />);
    const img = getByAltText("Loglingo Duck Mascot");
    expect(img).toBeInTheDocument();
  });

  it("renders Lonely mode correctly", () => {
    const { getByAltText } = render(<DuckMascot mode="lonely" />);
    const img = getByAltText("Loglingo Duck Mascot");
    expect(img).toBeInTheDocument();
  });

  it("renders Teacher mode correctly", () => {
    const { getByAltText } = render(<DuckMascot mode="teacher" />);
    const img = getByAltText("Loglingo Duck Mascot");
    expect(img).toBeInTheDocument();
  });
});
