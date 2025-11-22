
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

import "./Layout.css";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  return (
    <div className="app-layout">
      <TopNavbar handleShowSidebar={handleSidebarShow} />

      <Container fluid>
        <Row className="main-content-row">
          {/* Desktop Sidebar */}
          <Col lg={2} className="d-none d-lg-block p-0">
            <Sidebar variant="desktop" />
          </Col>

          {/* Mobile Sidebar (WalletSync-style) */}
          <Offcanvas
            show={showSidebar}
            onHide={handleSidebarClose}
            placement="start"
            className="mobile-sidebar d-lg-none"
          >
            <div className="mobile-sidebar-header">
              <div className="mobile-sidebar-brand">
                <span className="brand-emoji">💰</span>
                <span className="brand-text">SpendWise</span>
                <div className="brand-subtitle">Track Your Expense</div>
              </div>

              <button
                className="mobile-sidebar-close"
                onClick={handleSidebarClose}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <Offcanvas.Body className="p-0">
              <Sidebar onLinkClick={handleSidebarClose} variant="mobile" />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Page Content */}
          <Col xs={12} lg={10}>
            <main className="main-content">
              <Outlet />
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;
