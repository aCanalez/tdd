import ProfileCard from "./ProfileCard";
import { render, screen, waitFor } from "../test/setup";
import storage from "../utils/storage";

describe("Profile Card", () => {
  fit("displays edit button when logged in user is shown on card",async  () => {
    const user = { id: 5, username: "user5", isLoggedIn: true };
   await waitFor(() => {
    storage.setItem("auth", user);
   })
    render(<ProfileCard user={user} />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
