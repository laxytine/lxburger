import { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

const AddProduct = ({ show, onClose }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (name !== '' && description !== '' && price !== '') {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [name, description, price]);

  const handleCloseModal = () => {
    onClose();
  };


  const createProduct = (e) => {
    e.preventDefault();

    const newProduct = {
      name: name,
      description: description,
      price: parseFloat(price),
      imageUrl: imageUrl,
      isActive: true
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Product added successfully") {
          setShowSuccessMessage(true);

          setName("");
          setDescription("");
          setPrice("");
          setImageUrl("");

          onClose();
        } else if (data.message === "Product with this name already exists") {
          Swal.fire({
            icon: "error",
            title: "Product already exists",
            text: data.message
          }).then(() => {
          onClose();
      	});
        } else {
          Swal.fire({
            icon: "success",
            title: "Successful Product Creation",
          }).then(() => {
          onClose();
         });
        }
      })
      .catch((error) => {
        console.error("Error creating new product:", error);
      });
  };

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createProduct}>
            <Form.Group>
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image URL:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Image URL"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </Form.Group>
            {isActive ?
              <Button variant="primary" type="submit" id="submitBtn" className='my-2'>
                Submit
              </Button>
              :
              <Button variant="danger" type="submit" id="submitBtn" className='my-2' disabled>
                Submit
              </Button>
            }
          </Form>
          {showSuccessMessage && (
            <Alert variant="success" className="mt-3">
              Product added successfully. Redirecting to products page...
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddProduct;
