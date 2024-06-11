import { useContext, useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

const SetAdmin = ({ show, onClose }) => {
  const { user: contextUser } = useContext(UserContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (show) {
      retrieveAllUsers();
    }
  }, [show]);

  const retrieveAllUsers = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text: "An error occurred while fetching users.",
        });
      });
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedUser(null);
    setName("");
    setEmail("");
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find((u) => u._id === userId);
    if (user) {
      setSelectedUser(user);
      setName(user.lastName);
      setEmail(user.email);
    } else {
      setSelectedUser(null);
      setName("");
      setEmail("");
    }
  };

  const updateAdmin = (e) => {
    e.preventDefault();

    if (!selectedUser) {
      Swal.fire({
        icon: "error",
        title: "No User Selected",
        text: "Please select a user to promote to admin.",
      });
      return;
    }

    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/users/${selectedUser._id}/set-as-admin`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.updatedUser) {
          Swal.fire({
            icon: "success",
            title: "User Updated",
            text: "User has been successfully updated to admin.",
          });
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
            handleCloseModal();
          }, 2000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: data.message || "An error occurred while updating the user.",
          }).then(() => {
            onClose();
          });
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "An error occurred while updating the user.",
        }).then(() => {
          onClose();
        });
      });
  };

  // Filter admin users
  const adminUsers = users.filter((user) => user.isAdmin);

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update User to Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={updateAdmin}>
          <Form.Group>
            <Form.Label>User:</Form.Label>
            <Form.Control as="select" onChange={handleUserChange}>
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="my-2">
            Make Admin
          </Button>
        </Form>
        {showSuccessMessage && (
          <Alert variant="success" className="mt-3">
            User is now an admin.
          </Alert>
        )}
        <h5 className="mt-4">Current Admin Users</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default SetAdmin;
