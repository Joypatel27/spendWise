
// src/components/Sidebar.jsx
import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaListUl,
  FaWallet,
  FaChartBar,
  FaShoppingBasket,
  FaCog,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ onLinkClick, variant = "desktop" }) => {
  const handleClick = () => {
    if (onLinkClick) onLinkClick();
  };

  // desktop: fixed rail, mobile: inside offcanvas (no fixed)
  const wrapperClass =
    variant === "mobile" ? "sidebar-mobile" : "sidebar-desktop";

  return (
    <div className={wrapperClass}>
      <Nav className="flex-column">
        <Link className="nav-link" to="/dashboard" onClick={handleClick}>
          <FaHome /> Dashboard
        </Link>
        <Link className="nav-link" to="/transactions" onClick={handleClick}>
          <FaListUl /> Transactions
        </Link>
        <Link className="nav-link" to="/accounts" onClick={handleClick}>
          <FaWallet /> Accounts
        </Link>
        <Link className="nav-link" to="/reports" onClick={handleClick}>
          <FaChartBar /> Reports
        </Link>
        <Link className="nav-link" to="/budget" onClick={handleClick}>
          <FaShoppingBasket /> Budget
        </Link>
        <Link className="nav-link" to="/settings" onClick={handleClick}>
          <FaCog /> Settings
        </Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
