import { render, screen, waitFor } from "./test/setup";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { rest } from "msw";
import { setupServer } from "msw/node";
import storage from "./utils/storage";

const server = setupServer(
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get("/api/1.0/users/:id", (req, res, ctx) => {
    const id = Number.parseInt(req.params.id);
    return res(
      ctx.json({
        id,
        username: "userName" + id,
        email: "user" + id + "@mail.com",
        image: null,
      })
    );
  }),
  rest.get("/api/1.0/users", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        content: [
          {
            id: 1,
            username: "user-in-list",
            email: "user-in-list@mail.com",
            image: null,
          },
        ],
        page: 0,
        size: 0,
        totalPages: 0,
      })
    );
  }),
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ username: "user5", id: 5 }));
  })
);

beforeEach(() => server.listen());
afterEach(() => server.close());

const setup = (path) => {
  window.history.pushState({}, "", path);
  render(<App />);
};

describe("Routing", () => {
  it.each`
    path               | pageTestId
    ${"/"}             | ${"home-page"}
    ${"/signup"}       | ${"signup-page"}
    ${"/login"}        | ${"login-page"}
    ${"/user/1"}       | ${"user-page"}
    ${"/activate/123"} | ${"activation-page"}
    ${"/activate/423"} | ${"activation-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });
  it.each`
    path               | pageTestId
    ${"/"}             | ${"signup-page"}
    ${"/"}             | ${"login-page"}
    ${"/"}             | ${"user-page"}
    ${"/"}             | ${"activation-page"}
    ${"/signup"}       | ${"home-page"}
    ${"/signup"}       | ${"login-page"}
    ${"/signup"}       | ${"user-page"}
    ${"/signup"}       | ${"activation-page"}
    ${"/login"}        | ${"home-page"}
    ${"/login"}        | ${"signup-page"}
    ${"/login"}        | ${"user-page"}
    ${"/login"}        | ${"activation-page"}
    ${"/user/1"}       | ${"signup-page"}
    ${"/user/1"}       | ${"home-page"}
    ${"/user/1"}       | ${"login-page"}
    ${"/user/1"}       | ${"activation-page"}
    ${"/activate/123"} | ${"signup-page"}
    ${"/activate/123"} | ${"login-page"}
    ${"/activate/123"} | ${"user-page"}
    ${"/activate/123"} | ${"home-page"}
  `(
    "does not display $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      setup(path);
      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );
  it.each`
    targetPage
    ${"Home"}
    ${"SignUp"}
    ${"Login"}
  `("has link to $targetPage on Navbar", ({ targetPage }) => {
    setup("/");
    const link = screen.getByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickingTo  | visiblePage
    ${"/"}       | ${"SignUp"} | ${"signup-page"}
    ${"/signup"} | ${"Home"}   | ${"home-page"}
    ${"/signup"} | ${"Login"}  | ${"login-page"}
  `(
    "displays $visiblePage after clicking $clickingTo",
    ({ intialPath, clickingTo, visiblePage }) => {
      setup(intialPath);
      const link = screen.getByRole("link", { name: clickingTo });
      userEvent.click(link);
      expect(screen.getByTestId(visiblePage)).toBeInTheDocument();
    }
  );

  it("displays home page when clicking brand logo", () => {
    setup("/login");
    const image = screen.getByAltText("logo");
    userEvent.click(image);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  it("navigates to user page when clicking the username on user list", async () => {
    setup("/");
    const user = await screen.findByText("user-in-list");
    userEvent.click(user);
    const page = await screen.findByTestId("user-page");
    expect(page).toBeInTheDocument();
  });

  describe("Login", () => {
    const setupLoggedIn = () => {
      setup("/login");
      userEvent.type(screen.getByLabelText("E-mail"), "user5@mail.com");
      userEvent.type(screen.getByLabelText("Password"), "P4ssword");
      userEvent.click(screen.getByRole("button", { name: "Login" }));
    };
    it("redirects to homepage after successful login", async () => {
      setupLoggedIn();
      const page = await screen.findByTestId("home-page");
      expect(page).toBeInTheDocument();
    });
    it("hides login and signup from navbar after successful login", async () => {
      setupLoggedIn();
      await screen.findByTestId("home-page");
      const loginLink = screen.queryByRole("link", { name: "Login" });
      const signupLink = screen.queryByRole("link", { name: "Sign Up" });
      expect(loginLink).not.toBeInTheDocument();
      expect(signupLink).not.toBeInTheDocument();
    });
    it("displays my profile link on navbar after successful login", async () => {
      setup("/login");
      const myProfileLinkBeforeLogin = screen.queryByRole("link", {
        name: "My Profile",
      });
      expect(myProfileLinkBeforeLogin).not.toBeInTheDocument();
      userEvent.type(screen.getByLabelText("E-mail"), "user5@mail.com");
      userEvent.type(screen.getByLabelText("Password"), "P4ssword");
      userEvent.click(screen.getByRole("button", { name: "Login" }));
      await screen.findByTestId("home-page");
      const myProfileLinkAfterLogin = screen.queryByRole("link", {
        name: "MyProfile",
      });
      expect(myProfileLinkAfterLogin).toBeInTheDocument();
    });
    it("displays user page with logged in user id in url after clicking My Profile link", async () => {
      setupLoggedIn();
      await screen.findByTestId("home-page");
      const myProfile = screen.queryByRole("link", {
        name: "MyProfile",
      });
      userEvent.click(myProfile);
      await screen.findByTestId("user-page");
      const username = await screen.findByText("userName5");
      expect(username).toBeInTheDocument();
    });
    it("stores logged in state in local storage", async () => {
      storage.clear();
      setupLoggedIn();
      await screen.findByTestId("home-page");
      const state = storage.getItem("auth");
      expect(state.isLoggedIn).toBeTruthy();
    });
    it("displays layout of logged in state", async () => {
      storage.setItem("auth", { isLoggedIn: true });
      setup("/");
      const myProfileLink = screen.queryByRole("link", {
        name: "MyProfile",
      });
      expect(myProfileLink).toBeInTheDocument();
    });
  });
});
