import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/css/RegistrationForm.css";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  console.log(firstName);
  console.log(lastName);
  console.log(email);
  console.log(mobileNo);
  console.log(password);
  console.log(confirmPassword);

  function registerUser(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.message) {
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword("");
          setConfirmPassword("");
          Swal.fire({
            title: "Success",
            icon: "success",
            text: data.message,
          });
          navigate("/login");
        } else if (data.error) {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: data.error,
          });
        } else {
          Swal.fire({
            title: "Opss...",
            icon: "error",
            text: "Something went wrong. Please try again.",
          });
        }
      });
  }

  return localStorage.getItem("token") !== null ? (
    <Navigate to="/products" />
  ) : (
    <Container fluid className="registration-container bg-register">
      <Row className="h-100">
        <Col
          md={{ span: 8, offset: 2 }}
          className="d-flex align-items-center justify-content-center"
        >
          <div className="registration-form-wrapper">
            <h1 className="mb-5 text-center">Register</h1>
            <Form onSubmit={registerUser}>
              <Form.Group>
                <Form.Label>First Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mb-3 rounded-pill"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Last Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mb-3 rounded-pill"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 rounded-pill"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Mobile No:</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter 11 Digit No."
                  minLength={11}
                  maxLength={11}
                  required
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="mb-3 rounded-pill"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-3 rounded-pill"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  required
                  pattern={password}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mb-3 rounded-pill"
                />
              </Form.Group>
              <div className="d-flex justify-content-center">
                <Button
                  variant="warning"
                  type="submit"
                  id="submitBtn"
                  className="rounded-pill"
                >
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/login")}
                  className="rounded-pill mx-2"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
