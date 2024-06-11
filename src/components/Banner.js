import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/home.css";
import burger from "../assets/images/Spicy_Burger.webp";

export default function Banner() {
  const navigate = useNavigate();

  const handleOrderNowClick = () => {
    navigate("/products");
  };

  return (
    <>
      <div className="container-fluid bg-hero">
        <div className="  row d-flex flex-row justify-content-center align-items-center gap-5 bg-hero vh-100   ">
          <div className="col text-center">
            <h1 className="h1">
              <span className="text-warning">L&X</span> Burger
            </h1>
            <p className="p pt-2">Indulge in Flavorful Moments </p>
            <p className="p">Where Every Bite is a Celebration!</p>
            <button
              onClick={handleOrderNowClick}
              className="btn btn-warning  px-3 py-2"
            >
              ORDER NOW!
            </button>
          </div>
          <div className="col text-center ">
            <img src={burger} alt="burger" className="img-fluid" />
          </div>
        </div>
      </div>
    </>
  );
}
