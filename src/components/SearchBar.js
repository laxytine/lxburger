import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import "../assets/css/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/search-by-name`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: searchTerm }),
        }
      );
      const data = await response.json();
      if (data.length === 0) {
        Swal.fire({
          title: "No Products Found",
          text: "No products match your search criteria.",
          icon: "warning",
        });
      } else {
        onSearch(data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      Swal.fire({
        title: "Error",
        text: "There was an error fetching search results. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <Form onSubmit={handleSearch} className="container">
      <Row className="align-items-center">
        <Col xs="8">
          <div className="search-input-container">
            <Form.Control
              type="text"
              placeholder="Search for products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input" // Apply custom CSS class
            />
          </div>
        </Col>
        <Col xs="4">
          <Button type="submit" variant="warning" className="w-50">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
