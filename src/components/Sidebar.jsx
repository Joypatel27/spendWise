// import React, { useState } from "react";
// import { Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { 
//   FaHome, 
//   FaListUl, 
//   FaWallet, 
//   FaChartBar, 
//   FaShoppingBasket, 
//   FaCog,
// } from "react-icons/fa";
// import "./Sidebar.css";

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      

//       <Nav className="flex-column">
//         <Link className="nav-link" to="/dashboard">
//   <FaHome /> {!collapsed && "Dashboard"}
// </Link>

// <Link className="nav-link" to="/transactions">
//   <FaListUl /> {!collapsed && "Transactions"}
// </Link>

// <Link className="nav-link" to="/accounts">
//   <FaWallet /> {!collapsed && "Accounts"}
// </Link>

// <Link className="nav-link" to="/reports">
//   <FaChartBar /> {!collapsed && "Reports"}
// </Link>

// <Link className="nav-link" to="/budget">
//   <FaShoppingBasket /> {!collapsed && "Budget"}
// </Link>

// <Link className="nav-link" to="/settings">
//   <FaCog /> {!collapsed && "Settings"}
// </Link>

//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;
// Sidebar.jsx

// import React from "react"; // Removed useState
// import { Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import {
//   FaHome,
//   FaListUl,
//   FaWallet,
//   FaChartBar,
//   FaShoppingBasket,
//   FaCog,
// } from "react-icons/fa";
// import "./Sidebar.css";

// const Sidebar = () => {
//   // The 'collapsed' state is no longer needed here

//   return (
//     // Use the new class name for the container
//     <div className="sidebar-container">
//       <Nav className="flex-column">
//         <Link className="nav-link" to="/dashboard">
//           <FaHome /> Dashboard
//         </Link>
//         <Link className="nav-link" to="/transactions">
//           <FaListUl /> Transactions
//         </Link>
//         <Link className="nav-link" to="/accounts">
//           <FaWallet /> Accounts
//         </Link>
//         <Link className="nav-link" to="/reports">
//           <FaChartBar /> Reports
//         </Link>
//         <Link className="nav-link" to="/budget">
//           <FaShoppingBasket /> Budget
//         </Link>
//         <Link className="nav-link" to="/settings">
//           <FaCog /> Settings
//         </Link>
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;
// Sidebar.jsx

// import React from "react"; // Removed useState
// import { Nav } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import {
//   FaHome,
//   FaListUl,
//   FaWallet,
//   FaChartBar,
//   FaShoppingBasket,
//   FaCog,
// } from "react-icons/fa";
// import "./Sidebar.css";

// const Sidebar = ({onLinkClick}) => {
//   // The 'collapsed' state is no longer needed here

//   return (
//     // Use the new class name for the container
//     <div className="sidebar-container">
//       <Nav className="flex-column">
//         <Link className="nav-link" to="/dashboard">
//           <FaHome /> Dashboard
//         </Link>
//         <Link className="nav-link" to="/transactions">
//           <FaListUl /> Transactions
//         </Link>
//         <Link className="nav-link" to="/accounts">
//           <FaWallet /> Accounts
//         </Link>
//         <Link className="nav-link" to="/reports">
//           <FaChartBar /> Reports
//         </Link>
//         <Link className="nav-link" to="/budget">
//           <FaShoppingBasket /> Budget
//         </Link>
//         <Link className="nav-link" to="/settings">
//           <FaCog /> Settings
//         </Link>
//       </Nav>
//     </div>
//   );
// };

// export default Sidebar;
import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaListUl, FaWallet, FaChartBar, FaShoppingBasket, FaCog } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ onLinkClick }) => {
  // A helper function to ensure onLinkClick is only called if it exists
  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="sidebar-container">
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
