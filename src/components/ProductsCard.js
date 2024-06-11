import React from "react";
import { Button, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import cart from "../assets/images/products-cart-icon.png";
const ProductsCards = ({ imgUrl, title, price, description, id }) => {
  function addToCart() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        productId: id,
        productName: title,
        quantity: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Item added successfully") {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Item added to cart",
          });
        } else {
          Swal.fire({
            title: "Opss...",
            icon: "error",
            text: "Please Login to Continue your order.",
          });
        }
      });
  }

  return (
    <Card
      style={{
        width: "20rem",
        background: "transparent",
        border: "1px solid yellow",
      }}
    >
      <Card.Img
        variant="top"
        src={imgUrl}
        style={{
          width: "200px",
          height: "160px", // specify the height
          margin: "10px auto",
        }}
        className="img-fluid"
      />
      <Card.Body>
        <Card.Title style={{ color: "yellow" }}>{title}</Card.Title>
        <Card.Text className="text-truncate" style={{ color: "white" }}>
          {description}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <Card.Text className="textStyle">
            &#8369;{price.toLocaleString()}
          </Card.Text>
          <Button variant="none" onClick={addToCart}>
            <img src={cart} alt="" className="img-fluid hover" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductsCards;
