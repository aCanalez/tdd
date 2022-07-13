import { waitFor } from "@testing-library/react";
import { render, screen } from "../test/setup";
import { setupServer } from "msw/node";
import { rest } from "msw";
import UserPage from "./UserPage";

const server = setupServer();
beforeEach(() => server.resetHandlers());
beforeEach(() => server.listen());
afterEach(() => server.close());
describe("User Page", () => {
  beforeEach(() => {
    server.use(
      rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        if (req.params.id === "1") {
          return res(
            ctx.json({
              id: 1,
              username: "user1",
              email: "user1@mail.com",
              image: null,
            })
          );
        } else {
          return res(
            ctx.status(400),
            ctx.json({
              message: "User not found",
            })
          );
        }
      })
    );
  });
  it("Displays user name on page when user is found", async () => {
    const match = { params: { id: 1 } };
    render(<UserPage match={match} />);
    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });
  });
  it("Displays spinner when page request is loading", async () => {
    const match = { params: { id: 1 } };
    render(<UserPage match={match} />);
    const spinner = screen.getByRole("status", { hidden: true });
    await screen.findByText("user1");
    await waitFor(() => {
      expect(spinner).not.toBeInTheDocument();
    });
  });
  it("Displays a message to user that user does not exists", async () => {
    const match = { params: { id: 200 } };
    render(<UserPage match={match} />);
    const message = await screen.findByText("User not found");
    expect(message).toBeInTheDocument();
  });
  it("Displays logged in user information", async () => {});
});
