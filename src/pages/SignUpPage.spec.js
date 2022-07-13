import { waitFor } from "@testing-library/react";
import { render, screen } from "../test/setup";
import SignUpPage from "./SignUpPage";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", {
        name: "Sign Up",
      });
      expect(header).toBeInTheDocument();
    });
    it("has username input", async () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", async () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", async () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", async () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password validation input", async () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Validate Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password validation input", async () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Validate Password");
      expect(input.type).toBe("password");
    });
    it("has form submit button", async () => {
      render(<SignUpPage />);
      const input = screen.getByRole("button", { name: "Sign Up" });
      expect(input.type).toBe("submit");
    });
    it("disables button initially", async () => {
      render(<SignUpPage />);
      const input = screen.getByRole("button", { name: "Sign Up" });
      expect(input).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let requestBody;
    let counter = 0;

    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        counter += 1;
        requestBody = req.body;
        return res(ctx.status(200));
      })
    );

    beforeEach(() => server.listen());
    afterEach(() => server.close());

    let button, passwordInput, passwordValidateInput, usernameInput, emailInput;

    const setup = () => {
      render(<SignUpPage />);
      emailInput = screen.getByLabelText("E-mail");
      usernameInput = screen.getByLabelText("Username");
      passwordInput = screen.getByLabelText("Password");
      passwordValidateInput = screen.getByLabelText("Validate Password");
      userEvent.type(emailInput, "alex@gmail.com");
      userEvent.type(usernameInput, "user1");
      userEvent.type(passwordInput, "Password");
      userEvent.type(passwordValidateInput, "Password");
      button = screen.getByRole("button", { name: "Sign Up" });
    };
    it("enables the button when password and password validation field have same values", () => {
      setup();
      expect(button).not.toBeDisabled();
    });
    it("disables the button when password and password validation field dont have same values", () => {
      render(<SignUpPage />);
      const passwordInput = screen.getByLabelText("Password");
      const passwordValidateInput = screen.getByLabelText("Validate Password");
      userEvent.type(passwordInput, "Passwords");
      userEvent.type(passwordValidateInput, "Password");
      const input = screen.getByRole("button", { name: "Sign Up" });
      expect(input).toBeDisabled();
    });
    it("send username email and password to api after clicking button", async () => {
      setup();
      //   const mockFn = jest.fn();
      //   window.fetch = mockFn;
      userEvent.click(button);

      // await new Promise((resolve) => setTimeout(resolve, 500));
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      //   const firstCallOfMock = mockFn.mock.calls[0];
      //   const body = JSON.parse(firstCallOfMock[1].body);
      expect(requestBody).toEqual({
        username: "user1",
        email: "alex@gmail.com",
        password: "Password",
      });
    });
    it("disables button when there is an ongoing api call", async () => {
      counter = 0;
      setup();

      userEvent.click(button);
      userEvent.click(button);

      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(counter).toBe(1);
    });
    it("display spinner after clicking submit", async () => {
      setup();
      let spinner = screen.queryByRole("status", { hidden: true });
      expect(spinner).not.toBeInTheDocument();
      userEvent.click(button);
      spinner = screen.queryByRole("status", { hidden: true });
      expect(spinner).toBeInTheDocument();
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
    });
    it("display account activation notification after successful sign up request", async () => {
      setup();
      const message = "Please check your e-mail to activate your account";
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);
      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });
    it("hides signup form after successful sign up request", async () => {
      setup();
      const form = screen.getByTestId("form");
      userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });
    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: message },
          })
        );
      });
    };
    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      await waitFor(() => expect(validationError).toBeInTheDocument());
    });
    it("hides spinner and enables button after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      setup();
      userEvent.click(button);
      await waitFor(() => {
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(button).toBeEnabled();
      });
    });
    it("displays mismatch message for password repeat input", () => {
      setup();
      userEvent.type(passwordInput, "P4assword");
      userEvent.type(passwordValidateInput, "Password");
      const validationError = screen.getByText("Password mismatch");
      expect(validationError).toBeInTheDocument();
    });
    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Password mismatch"}
    `("clears validation error $message after $field is updated", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      const inputs = {
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      };
      userEvent.type(inputs[field], `${field}-updated`);
      expect(validationError).not.toBeInTheDocument();
    });
  });
});

//When mocking our tests are highly coupled with our implementation. For example if you mock axios but then move to using the fetch api.
//the tests will begin to fail because they depend on the implementation using axios.
