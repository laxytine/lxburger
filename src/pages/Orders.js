import React, { useContext, useEffect, useState } from "react";
import { Container, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

const Orders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 403) {
        console.error(
          "Action forbidden: Check if the user has the right permissions."
        );
        return;
      }

      const data = await res.json();
      console.log("Fetched orders:", data);
      // Sort orders with the latest on top
      const sortedOrders = data.orders.sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn));
      setOrders(sortedOrders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date to 12-hour clock and date only
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container>
      <h1>Order History</h1>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover className="text-center">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Price</th>
              <th>Date Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order.productsOrdered
                      .map((item) => item.productName)
                      .join(", ")}
                  </td>
                  <td>&#8369;{order.totalPrice.toLocaleString()}</td>
                  <td>{formatDate(order.orderedOn)}</td>
                  <td>{order.status === "success" ? "Order Received" : order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No orders found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;
