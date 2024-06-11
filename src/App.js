import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./UserContext";
import AppNavBar from "./components/AppNavBar";
import Logout from "./components/Logout";
import Cart from "./pages/Cart";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  // Function for clearing localStorage on logout
  const unsetUser = () => {
    localStorage.clear();
  };


  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Error />} />

          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
