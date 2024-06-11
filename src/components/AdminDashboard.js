import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import AddProduct from "./AddProduct";
import SetAdmin from "./SetAdmin";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showSetAdminModal, setShowSetAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Modal control functions
  const openAddProductModal = () => setShowAddProductModal(true);

  const closeAddProductModal = () => {
    setShowAddProductModal(false);
    retrieveAllProducts();
  };

  const openSetAdminModal = (user) => {
    setSelectedUser(user);
    setShowSetAdminModal(true);
  };
  const closeSetAdminModal = () => setShowSetAdminModal(false);


  // Fetch all products from API
  const retrieveAllProducts = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  // Update user admin status
  const updateAdminStatus = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${id}/updateAdmin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.updatedUser) {
          Swal.fire({
            icon: "success",
            title: "User Updated",
            text: "User has been successfully updated to admin.",
          });
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === id ? data.updatedUser : user
            )
          );
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: data.message || "An error occurred while updating the user.",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "An error occurred while updating the user.",
        });
      });
  };

  // Update product details
  const updateProduct = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(productToEdit),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: data.message,
        });
        setEditingId(null);
        retrieveAllProducts();
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  // Handle product activation
  const handleActivate = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/activate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isActive: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: data.message,
        });
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id ? { ...product, isActive: true } : product
          )
        );
        retrieveAllProducts();
      })
      .catch((error) => console.error("Error activating product:", error));
  };

  // Handle product archiving
  const handleArchive = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}/archive`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isActive: false }),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          title: "Success",
          icon: "success",
          text: data.message,
        });
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id ? { ...product, isActive: false } : product
          )
        );
        retrieveAllProducts();
      })
      .catch((error) => console.error("Error archiving product:", error));
  };

  // Initial fetch of products
  useEffect(() => {
    retrieveAllProducts();
  }, []);


  // Handle editing state and input changes
  const handleEdit = (id) => setEditingId(id);
  const handleInputChange = (event, id, field) => {
    const newValue = event.target.value;
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id ? { ...product, [field]: newValue } : product
      )
    );
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end">
        <Button className="btn btn-success mx-2" onClick={() => openSetAdminModal(users)}>
          ADMIN
        </Button>
      </div>
      <SetAdmin show={showSetAdminModal} onClose={closeSetAdminModal} users={selectedUser} />
      <div className="d-flex justify-content-end">
        <Button className="btn btn-success m-2" onClick={openAddProductModal}>
          ADD PRODUCT
        </Button>
      </div>
      <AddProduct show={showAddProductModal} onClose={closeAddProductModal} />
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>Product Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Image URL</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className={editingId === product._id ? "bg-warning" : ""}>
              <td>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleInputChange(e, product._id, "name")}
                  disabled={editingId !== product._id}
                  className="text-center text-dark"
                  style={{ background: "none", border: "none", outline: "none" }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) => handleInputChange(e, product._id, "description")}
                  disabled={editingId !== product._id}
                  className="text-center text-dark"
                  style={{ background: "none", border: "none", outline: "none" }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={product.price}
                  onChange={(e) => handleInputChange(e, product._id, "price")}
                  disabled={editingId !== product._id}
                  className="text-center text-dark"
                  style={{ background: "none", border: "none", outline: "none" }}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={product.imageUrl}
                  onChange={(e) => handleInputChange(e, product._id, "imageUrl")}
                  disabled={editingId !== product._id}
                  className="text-center text-dark"
                  style={{ background: "none", border: "none", outline: "none" }}
                />
              </td>
              <td>
                {product.isActive ? (
                  <Button className="btn btn-danger" onClick={() => handleArchive(product._id)}>
                    Archive
                  </Button>
                ) : (
                  <Button className="btn btn-success" onClick={() => handleActivate(product._id)}>
                    Activate
                  </Button>
                )}
              </td>
              <td>
                {editingId === product._id ? (
                  <Button className="btn btn-success" onClick={() => updateProduct(product._id)}>
                    Save
                  </Button>
                ) : (
                  <Button className="btn btn-primary" onClick={() => handleEdit(product._id)}>
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Admin;
