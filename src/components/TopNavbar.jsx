
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

  // Friendly page title from URL
  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  const pageTitle = path
    ? path
        .split("/")
        .pop()
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Dashboard";

  // initials for avatar
  const name = user?.username || user?.name || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Navbar
      className="top-navbar"
      expand="lg"
      fixed="top"
      variant="dark"
      style={{ backgroundColor: "#0d6efd", height: "60px" }}
    >
      <Container fluid className="nav-container">
        {/* Hamburger – only on mobile / tablet */}
        <Button
          variant="link"
          className="nav-hamburger d-lg-none"
          onClick={handleShowSidebar}
          aria-label="Open menu"
        >
          <FaBars />
        </Button>

        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          className="d-flex align-items-center nav-brand"
        >
          <span className="brand-emoji" aria-hidden>
            💰
          </span>
          <span className="brand-text">SpendWise</span>
        </Navbar.Brand>

        {/* Page title – center on md+ */}
        <div className="nav-page-title d-none d-md-block">{pageTitle}</div>

        {/* Right section */}
        <Nav className="ms-auto align-items-center nav-right">
          {token ? (
            <>
              <div className="nav-user d-none d-sm-flex align-items-center">
                <div className="user-avatar" title={name}>
                  {initials || "U"}
                </div>
                <div className="user-greet d-none d-md-block">
                  Hi, <span className="user-name">{name}</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline-light"
                className="logout-btn ms-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login" className="d-inline-block">
              <Button size="sm" variant="outline-light">
                <FaSignInAlt className="me-1" /> Login
              </Button>
            </Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;

