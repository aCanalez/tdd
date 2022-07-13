import { waitFor } from "@testing-library/react";
import { render, screen } from "../test/setup";
import { setupServer } from "msw/node";
import { rest } from "msw";
import UserList from "./UserList";
import userEvent from "@testing-library/user-event";

const users = [
  { id: 1, username: "user1", email: "user1@mail.com", image: null },
  { id: 2, username: "user2", email: "user2@mail.com", image: null },
  { id: 3, username: "user3", email: "user3@mail.com", image: null },
  { id: 4, username: "user4", email: "user4@mail.com", image: null },
  { id: 5, username: "user5", email: "user5@mail.com", image: null },
  { id: 6, username: "user6", email: "user6@mail.com", image: null },
  { id: 7, username: "user7", email: "user7@mail.com", image: null },
];

const getPage = (page, size) => {
  let start = page * size;
  let end = start + size;
  let totalPages = Math.ceil(users.length / size);

  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

const server = setupServer(
  rest.get("/api/1.0/users", (req, res, ctx) => {
    let page = Number.parseInt(req.url.searchParams.get("page"));
    let size = Number.parseInt(req.url.searchParams.get("size"));
    if (Number.isNaN(page)) {
      page = 0;
    }
    if (Number.isNaN(size)) {
      size = 0;
    }
    return res(ctx.status(200), ctx.json(getPage(page, size)));
  })
);

beforeEach(() => server.resetHandlers());
beforeEach(() => server.listen());
afterEach(() => server.close());

const setup = () => {
  render(<UserList />);
};

describe("user List", () => {
  it("displays 3 users in list", async () => {
    setup();
    const users = await screen.findAllByText(/user/);
    expect(users.length).toBe(3);
  });
  it("displays next page link", async () => {
    setup();
    await screen.findByText("user1");
    expect(screen.getByText("next >")).toBeInTheDocument();
  });
  it("displays next page after clicking next", async () => {
    setup();
    await screen.findByText("user1");
    const nextPageLink = screen.getByText("next >");
    userEvent.click(nextPageLink);
    const firstUserPage2 = await screen.findByText("user4");
    await waitFor(() => {
      expect(firstUserPage2).toBeInTheDocument();
    });
  });
  it("hides last page link at last page", async () => {
    setup();
    await screen.findByText("user1");
    userEvent.click(screen.getByText("next >"));
    await screen.findByText("user4");
    userEvent.click(screen.getByText("next >"));
    await screen.findByText("user7");
    expect(screen.queryByText("next >")).not.toBeInTheDocument();
  });
  it("does not display the previous page link in the first page", async () => {
    setup();
    await screen.findByText("user1");
    const previousPageLink = screen.queryByText("< prev");
    expect(previousPageLink).not.toBeInTheDocument();
  });
  it("display the previous page link in the second page", async () => {
    setup();
    await screen.findByText("user1");
    userEvent.click(screen.getByText("next >"));
    await screen.findByText("user4");
    const previousPageLink = screen.queryByText("< prev");
    expect(previousPageLink).toBeInTheDocument();
  });
  it("display the previous page after clicking the previous page link", async () => {
    setup();
    await screen.findByText("user1");
    userEvent.click(screen.getByText("next >"));
    await screen.findByText("user4");
    userEvent.click(screen.getByText("< prev"));
    const firstUserOnFirstPage = await screen.findByText("user1");
    expect(firstUserOnFirstPage).toBeInTheDocument();
  });
  it("displays spinner during the api call is in progress", async () => {
    setup();
    const spinner = screen.getByRole("status", { hidden: true });
    await screen.findByText("user1");
    expect(spinner).not.toBeInTheDocument();
  });
});
