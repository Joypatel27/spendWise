
import React from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaBars, FaSignInAlt } from "react-icons/fa";

const TopNavbar = ({ handleShowSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Better page title extraction
  const path = location.pathname.replace(/^\/+|\/+$/g, ""); // remove leading/trailing slashes
  const pageTitle = path ? path.split("/").pop().replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "Dashboard";

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
      <Container fluid>
        <Button variant="primary" className="d-lg-none me-2" onClick={handleShowSidebar}>
          <FaBars />
        </Button>

        <Navbar.Brand as={Link} to="/dashboard" style={{ fontWeight: "bold" }}>
          💰 SpendWise
        </Navbar.Brand>

        {/* <Navbar.Text className="d-none d-sm-block mx-auto" style={{ color: "white", fontSize: "1.2rem", fontWeight: "500" }}>
          {pageTitle}
        </Navbar.Text> */}

        <Nav className="ms-auto">
          {token ? (
            <>
              <Navbar.Text style={{ color: "white", marginRight: "10px" }}>
                Hi, {user?.username || user?.name}
              </Navbar.Text>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline-light">
                <FaSignInAlt className="me-2" />
                Login
              </Button>
            </Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
