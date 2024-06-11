import { useEffect, useState } from "react";
import "../assets/css/featuredproduct.css";
import ProductsCards from "./ProductsCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  function retrieveProducts() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }
  useEffect(() => {
    retrieveProducts();
  }, []);

  console.log(products);
  return (
    <>
      <div className=" bg-feature">
        <h2 className="text-center text-white">
          OUR BEST <span style={{ color: "yellow" }}> SELLER</span>
        </h2>
        <div className="container">
          <div className="row">
            {products.slice(0, 6).map((product) => (
              <div key={product._id} className="col-md-4 mt-5">
                <ProductsCards
                  imgUrl={product.imageUrl}
                  title={product.name}
                  price={product.price}
                  description={product.description}
                  id={product._id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-feature p-3 pt-5">
        <footer>
          <div className="container">
            <div className="row text-center">
              <div className="col-12 text-white">
                <p>© 2024 All rights reserved. L&X Burger</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
