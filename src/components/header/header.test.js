import { render, screen, within } from "@testing-library/react";
import { Header } from "./Header";

it("should contain a logo", async () => {
  render(<Header />);
  const logo = await screen.findByTestId("logo");
  expect(logo).toBeInTheDocument();
});

it("should contain an unorder list with options apple & orange", () => {
  render(<Header />);
  const list = screen.getByRole("list");
  const { getAllByRole } = within(list);
  const items = getAllByRole("listitem");
  const itemNames = items.map((item) => item.textContent);
  expect(itemNames).toEqual(["orange", "apple"]);
});
