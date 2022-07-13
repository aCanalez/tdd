import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import ActivationPage from "./pages/ActivationPage";
import { Route, Routes } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";

function App() {
  // const [path, setPath] = useState(window.location.pathname);
  // const onClickLink = (e) => {
  //   e.preventDefault();
  //   const path = e.currentTarget.attributes.href.value;
  //   window.history.pushState({}, "", path);
  //   setPath(path);
  // };
  return (
    <>
      <NavigationBar />
      <div className="container pt-3">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/activate/:token" element={<ActivationPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
