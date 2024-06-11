import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const Checkout = ({ show, handleClose, handleCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [deliveryMode, setDeliveryMode] = useState("express"); // Default to express
  const [accountNumber, setAccountNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [shippingFee, setShippingFee] = useState(150); // Default shipping fee for express
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // Set default shipping fee based on delivery mode
    if (deliveryMode === "express") {
      setShippingFee(150);
    } else if (deliveryMode === "standard") {
      setShippingFee(75);
    }
  }, [deliveryMode]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === "cash_on_delivery") {
      setAccountNumber(""); // Reset account number if cash on delivery is selected
    }
  };

  const handleDeliveryChange = (e) => {
    setDeliveryMode(e.target.value);
  };

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setDeliveryAddress(e.target.value);
  };

  const handleConfirmCheckout = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      // Pass selected payment method, delivery mode, account number, delivery address, and shipping fee to handleCheckout function
      handleCheckout(paymentMethod, deliveryMode, accountNumber, deliveryAddress, shippingFee);
      handleClose(); // Close the modal
    }
    setValidated(true);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleConfirmCheckout}>
          <Form.Group controlId="paymentMethod">
            <Form.Label>Payment Method:</Form.Label>
            <Form.Control
              as="select"
              value={paymentMethod}
              onChange={handlePaymentChange}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
              <option value="gcash">Gcash</option>
              <option value="paymaya">PayMaya</option>
              <option value="bank_account">Bank Account</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Please select a payment method.
            </Form.Control.Feedback>
          </Form.Group>
          {paymentMethod !== "cash_on_delivery" && (
            <Form.Group controlId="accountNumber">
              <Form.Label>Account Number:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter your account number.
              </Form.Control.Feedback>
            </Form.Group>
          )}
          <Form.Group controlId="deliveryAddress" className="mt-3">
            <Form.Label>Delivery Address:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Delivery Address"
              value={deliveryAddress}
              onChange={handleAddressChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter your delivery address.
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-4">
            Confirm Checkout
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Checkout;
