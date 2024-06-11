import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/css/ErrorPage.css"; // Ensure you have some basic styles if needed

function ErrorPage() {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <h1 className="display-4">404</h1>
      <p className="lead">Page Not Found</p>
      <Button variant="primary" as={Link} to="/">
        Back to Home
      </Button>
    </Container>
  );
}

export default ErrorPage;
