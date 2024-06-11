import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of Navigate
import Swal from "sweetalert2";
import "../assets/css/LoginForm.css";

export default function Login() {
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsActive(e.target.value.trim() !== "" && password.trim() !== "");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsActive(e.target.value.trim() !== "" && email.trim() !== "");
  };

  function authenticate(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.access !== "undefined") {
          localStorage.setItem("token", data.access);
          localStorage.setItem("isAdmin", data.user.isAdmin);
          console.log(data);
          localStorage.setItem("isVerified", data.user.isVerified);
          localStorage.setItem("id", data.user.id);

          navigate("/");
          window.location.reload();
        } else if (data.error) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.error,
          });
        }
      });

    setEmail("");
    setPassword("");
  }

  return localStorage.getItem("token") !== null ? (
    // If user is logged in, navigate to products page
    navigate("/products")
  ) : (
    // Otherwise, render login form
    <Container fluid className="login-container bg-login">
      <Row className="h-100">
        <Col
          md={6}
          className=" d-flex justify-content-center align-items-center"
        >
          <img
            src="https://postimage.me/images/2024/06/04/burgerlogin19810e90a880a6f1.gif"
            alt="login"
            className="img-fluid rounded-circle"
          />
        </Col>
        <Col
          md={6}
          className="login-form-col d-flex align-items-center justify-content-center"
        >
          <div className="login-form-wrapper mb-5 pb-5">
            <h1 className="mb-5 text-center text-white">Login</h1>
            <Form
              onSubmit={authenticate}
              className="d-flex flex-column text-white"
            >
              <Form.Group controlId="userEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="mb-3 rounded-pill"
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className="mb-3 rounded-pill"
                />
              </Form.Group>

              <Button
                variant="warning"
                type="submit"
                id="submitBtn"
                disabled={!isActive}
                className="rounded-pill"
              >
                Submit
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
