import { render, screen } from "../test/setup";
import Input from "./Input";

it("has is-invalid class for input when help is set", () => {
  render(<Input help="Error message" />);
  const input = screen.getByAltText("input");
  expect(input.classList).toContain("is-invalid");
});
it("has invalid-feedback class for span when help is set", () => {
  render(<Input help="Error message" />);
  const span = screen.getByTestId("feedback");
  expect(span.classList).toContain("invalid-feedback");
});
it("does not have is-invalid class for input when help is not set", () => {
  render(<Input />);
  const input = screen.getByAltText("input");
  expect(input.classList).not.toContain("is-invalid");
});
