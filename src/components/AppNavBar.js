import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../UserContext";
import "../assets/css/navbar.css";
import burgers from "../assets/images/home-logo.png";

export default function AppNavbar() {
  const { user } = useContext(UserContext);
  // State to store the user information stored in the login page
  // const[user, setUser] = useState(localStorage.getItem("token"));
  console.log("user", user); //checking if we received the login token
  console.log("Navbar", localStorage.getItem("token"));
  const isAdmin = localStorage.getItem("isAdmin");

  console.log("isAdmin", isAdmin);
  return (
    <Navbar expand="lg" className="pad">
      <Container fluid className="px-5">
        <Navbar.Brand as={Link} to="/">
          <img
            src={burgers}
            alt="logo"
            height={50}
            width={100}
            className="img-fluid"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-Navbar-nav" />
        <Navbar.Collapse id="basic-Navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              exact="true"
              style={{ color: "white" }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/products"
              exact="true"
              style={{ color: "white" }}
            >
              Products
            </Nav.Link>
            {localStorage.getItem("token") !== null ? (
              <>
                {isAdmin === "false" && (
                  <Nav.Link as={Link} to="/cart" style={{ color: "white" }}>
                    Cart
                  </Nav.Link>
                )}
                {isAdmin === "false" && (
                  <Nav.Link as={Link} to="/orders" style={{ color: "white" }}>
                    Orders
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/logout" style={{ color: "white" }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/register" style={{ color: "white" }}>
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" style={{ color: "white" }}>
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
