import { waitFor } from "@testing-library/react";
import { render, screen } from "../test/setup";
import ActivationPage from "./ActivationPage";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Account Activation Page", () => {
  let counter = 0;
  const server = setupServer(
    rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
      counter += 1;
      if (req.params.token === "5678") {
        return res(ctx.status(400));
      }
      return res(ctx.status(200));
    })
  );

  const setup = (token) => {
    const match = {
      params: {
        token: token,
      },
    };
    render(<ActivationPage match={match} />);
  };

  beforeEach(() => server.resetHandlers());
  beforeEach(() => server.listen());
  afterEach(() => server.close());

  it("sends activation request to backend", async () => {
    setup("1234");
    await screen.findByText("Account is activated");
    expect(counter).toBe(1);
  });

  it("displays activation success when token is valid", async () => {
    setup("1234");
    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();
  });

  it("displays activation failure message when token is invalid", async () => {
    setup("5678");
    const message = await screen.findByText("Activation failure");
    expect(message).toBeInTheDocument();
  });

  it("sends activation request after the token is changed", async () => {
    const match = {
      params: {
        token: "1234",
      },
    };
    const { rerender } = render(<ActivationPage match={match} />);
    await screen.findByText("Account is activated");
    match.params.token = "5678";
    rerender(<ActivationPage match={match} />);
    await screen.findByText("Activation failure");
    expect(counter).toBe(5);
  });
  it("displays spinner during activation api call", async () => {
    setup("1234");
    const spinner = screen.getByRole("status", { hidden: true });
    await waitFor(() => {
      expect(spinner).toBeInTheDocument();
    });
    await screen.findByText("Account is activated");
    await waitFor(() => {
      expect(spinner).not.toBeInTheDocument();
    });
  });
  it("displays spinner after second api call to the changed token", async () => {
    const match = {
      params: {
        token: "1234",
      },
    };
    const { rerender } = render(<ActivationPage match={match} />);
    await screen.findByText("Account is activated");
    match.params.token = "5678";

    rerender(<ActivationPage match={match} />);

    const spinner = screen.getByRole("status", { hidden: true });
    await waitFor(() => {
      expect(spinner).toBeInTheDocument();
    });
    await screen.findByText("Activation failure");
    await waitFor(() => {
      expect(spinner).not.toBeInTheDocument();
    });

    // await screen.findByText("Activation failure");
    // expect(counter).toBe(5);
  });
});
