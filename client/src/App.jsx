import Home from "./pages/Home.jsx";
import Households from "./pages/Households.jsx";
import Chores from "./pages/Chores.jsx";
import Assignments from "./pages/Assignments.jsx";
import Auth from "./pages/Auth.jsx";

function Nav() {
  return (
    <nav>
      <a href="/">Home</a> |{" "}
      <a href="/households">Households</a> |{" "}
      <a href="/chores">Chores</a> |{" "}
      <a href="/assignments">Assignments</a> |{" "}
      <a href="/auth">Auth (OTP)</a>
      <hr />
    </nav>
  );
}

export default function App() {
  const path = window.location.pathname;

  let Page;
  if (path === "/") Page = Home;
  else if (path === "/households") Page = Households;
  else if (path === "/chores") Page = Chores;
  else if (path === "/assignments") Page = Assignments;
  else if (path === "/auth") Page = Auth;
  else Page = () => <h2>404 - Page Not Found</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>ChoreMate</h1>
      <Nav />
      <Page />
    </div>
  );
}
