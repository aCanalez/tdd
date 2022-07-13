import { waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { render, screen } from "../test/setup";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import LoginPage from "./LoginPage";
import storage from "../utils/storage";

let requestBody,
  count = 0;

const server = setupServer(
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    count += 1;
    requestBody = req.body;
    return res(ctx.status(401), ctx.json({ message: "Incorrect credentials" }));
  })
);

beforeEach(() => {
  server.resetHandlers();
  count = 0;
});
beforeAll(() => server.listen());
afterAll(() => server.close());

describe("Login Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<LoginPage />);
      const header = screen.queryByRole("heading", {
        name: "Login",
      });
      expect(header).toBeInTheDocument();
    });
    it("has email input", async () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", async () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", async () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has form login button", async () => {
      render(<LoginPage />);
      const input = screen.getByRole("button", { name: "Login" });
      expect(input.type).toBe("submit");
    });
    it("disables button initially", async () => {
      render(<LoginPage />);
      const input = screen.getByRole("button", { name: "Login" });
      expect(input).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    let button, emailInput, passwordInput;

    const setup = (email = "user100@mail.com") => {
      render(<LoginPage />);
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, email);
      userEvent.type(passwordInput, "incorrectPassword");
      button = screen.getByRole("button", { name: "Login" });
    };

    it("enables the button when email and password inputs are filled", async () => {
      setup();
      expect(button).toBeEnabled();
    });

    it("displays spinner during api call", async () => {
      setup();
      let spinner = screen.queryByRole("status", { hidden: true });
      expect(spinner).not.toBeInTheDocument();
      userEvent.click(button);
      spinner = screen.queryByRole("status", { hidden: true });
      await waitForElementToBeRemoved(spinner);
    });

    it("sends email and password to backend after clicking the button", async () => {
      setup();
      userEvent.click(button);
      const spinner = screen.queryByRole("status", { hidden: true });
      await waitForElementToBeRemoved(spinner);
      expect(requestBody).toEqual({
        email: "user100@mail.com",
        password: "incorrectPassword",
      });
    });

    it("disables the button when there is an api call", async () => {
      setup();
      userEvent.click(button);
      userEvent.click(button);
      const spinner = screen.queryByRole("status", { hidden: true });
      await waitForElementToBeRemoved(spinner);
      expect(count).toEqual(1);
    });

    it("displays the authentication failed message to user", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      expect(errorMessage).toBeInTheDocument();
    });

    it("clears authentication fail message when email field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(emailInput, "new@mail.com");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("clears authentication fail message when password field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(passwordInput, "new@mail.com");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("stores id, username, and image in storage", async () => {
      storage.clear();
      const payload = {
        id: 5,
        username: "user5",
        image: null,
        isLoggedIn: true,
      };
      server.use(
        rest.post("/api/1.0/auth", (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(...payload));
        })
      );
      setup("user5@mail.com");
      userEvent.click(button);
      const spinner = screen.queryByRole("status", { hidden: true });
      await waitForElementToBeRemoved(spinner);
      const localState = storage.getItem("auth");
      // console.log(Object.keys(localState));
    });
    it("stores authorization header value in storage", async () => {
      storage.clear();
      const payload = {
        id: 5,
        username: "user5",
        image: null,
        isLoggedIn: true,
      };
      server.use(
        rest.post("/api/1.0/auth", (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(...payload));
        })
      );
      setup("user5@mail.com");
      userEvent.click(button);
      // const spinner = screen.queryByRole("status", { hidden: true });
      // await waitForElementToBeRemoved(spinner);
      const localState = storage.getItem("auth");
      console.log(localState);
    });
  });
});
