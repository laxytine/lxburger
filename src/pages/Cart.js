import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import "../assets/css/cart.css";
import Checkout from "../components/Checkout";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartNotFound, setCartNotFound] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [shippingFee, setShippingFee] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    getCartItems();
  }, []);

  function getCartItems() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched cart data:", data.cart.cartItems);
        setCart(data.cart.cartItems);
        setTotalPrice(data.cart.totalPrice);
        if (data.message === "Cart not found") {
          setCartNotFound(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
        setLoading(false);
      });
  }

  function retrieveProducts() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched product data:", data); // Log the fetched data
        setProducts(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    getCartItems();
    retrieveProducts();
  }, []);

  const handleRemoveItem = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${id}/remove-from-cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Your item has been successfully removed from the cart",
        });
        console.log("Fetched cart data:", data);
        getCartItems();
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  const handleClearCart = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Cart cleared successfully") {
          getCartItems();
        }
      })
      .catch((error) => {
        console.error("Error clearing cart:", error);
      });
  };

    const handleQuantityChange = (id, newQuantity) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        productId: id,
        quantity: newQuantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Quantity updated successfully:", data);
        getCartItems(); // Refresh the cart items
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Your cart is empty. Add some items to proceed to checkout.",
      });
    } else {
      setShowCheckoutModal(true);
    }
  };

  const handleCheckoutModalClose = () => {
    setShowCheckoutModal(false);
  };

  const handleConfirmCheckout = () => {
    const checkoutData = {
      paymentMethod,
      deliveryMode,
      accountNumber,
      deliveryAddress,
      shippingFee,
      totalQuantity: cart.reduce((total, item) => total + item.quantity, 0),
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(checkoutData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Order placed successfully:", data);
        handleClearCart();
        setShowCheckoutModal(false);
        getCartItems();
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Your order has been placed successfully!",
        });
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Failed to place order. Please try again later.",
        });
      });
  };

  const handleDecrement = (id, currentQuantity) => {
    if (currentQuantity > 0) {
      const newQuantity = currentQuantity - 1;
      handleQuantityChange(id, newQuantity);
    }
  };

  const handleIncrement = (id, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    handleQuantityChange(id, newQuantity);
  };

  const handleShippingChange = (fee) => {
    setShippingFee(fee);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="my-4">Shopping Cart</h1>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" />
            </div>
          ) : cartNotFound ? (
            <p>Cart not found.</p>
          ) : (
            <>
              <Table striped bordered hover className="table text-center">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleDecrement(item.productId, item.quantity)
                          }
                          disabled={item.quantity === 0}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            handleIncrement(item.productId, item.quantity)
                          }
                        >
                          +
                        </button>
                      </td>
                      <td>&#8369;{item.subtotal.toLocaleString()}</td>
                      <td>
                        <Button
                          variant="danger"
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {totalPrice > 0 && (
                <>
                  <Form.Group
                    controlId="deliveryMode"
                    className="deliveryMode mt-3 col-3"
                  >
                    <Form.Label>
                      <strong>Choose Delivery Mode:</strong>
                    </Form.Label>
                    <Form.Control
                      as="select"
    
                      onChange={(e) =>
                        handleShippingChange(parseInt(e.target.value))
                      }
                    >
                      <option>
                        Priority Delivery (Free of Charge)
                      </option>
                      <option>
                        Standard Delivery (Free of Charge)
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <div className="container mt-3">
                    <div className="row">
                      <div className="col d-flex justify-content-start align-items-center">
                        <h3 className="pr-3 total">
                          Grand total: &#8369;{totalPrice.toLocaleString()}
                        </h3>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="container mt-3">
                <div className="row">
                  <div className="col d-flex justify-content-end me-5">
                    <Button
                      variant="danger"
                      className="mx-2 btn-clear"
                      onClick={handleClearCart}
                    >
                      Clear Cart
                    </Button>
                    <Button
                      variant="success"
                      className="mx-2 btn-checkout"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Col>
      </Row>
      <Checkout
        show={showCheckoutModal}
        cart={cart} // Pass the cart to Checkout component
        handleClose={handleCheckoutModalClose}
        handleCheckout={handleConfirmCheckout}
      />
    </Container>
  );
};

export default Cart;
