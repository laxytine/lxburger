import { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import "../assets/css/featuredproduct.css";
import Admin from "../components/AdminDashboard";
import OtpModal from "../components/OtpModal";
import ProductsCards from "../components/ProductsCard";
import SearchBar from "../components/SearchBar";

export default function Products(props) {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("isAdmin");
  const isVerified = localStorage.getItem("isVerified");

  const [showOTPModal, setShowOTPModal] = useState(isVerified === "false");

  useEffect(() => {
    retrieveProducts();
  }, []);

  const retrieveProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/active`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving products:", error);
    }
  };

  const handleSearch = (data) => {
    setProducts(data);
  };

  const handleViewAll = () => {
    retrieveProducts();
  };

  if (isAdmin === "true") {
    return <Admin />;
  }

  return (
    <>
      {showOTPModal ? (
        <OtpModal setShowOTPModal={setShowOTPModal} />
      ) : (
        <div className="bg-feature">
          <h2 className="text-center text-white">
            START YOUR <span style={{ color: "yellow" }}> ORDER TODAY</span>
          </h2>
          <SearchBar onSearch={handleSearch} />
          {loading ? (
            <div className="d-flex justify-content-center my-4 min-vh-100">
              <Spinner animation="border" className="text-white" />
            </div>
          ) : (
            <div className="container min-vh-100 ">
              <div className="row  ">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div className="col-md-4 mt-5 " key={product._id}>
                      <ProductsCards
                        imgUrl={product.imageUrl}
                        title={product.name}
                        price={product.price}
                        description={product.description}
                        id={product._id}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white mt-5 ">
                    <p>No products found.</p>
                    <Button variant="warning" onClick={handleViewAll}>
                      View All Products
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
