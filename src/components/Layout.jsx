// // import React from "react";
// // import Sidebar from "./Sidebar";
// // import Navbar from "./TopNavbar";
// // import { Container } from "react-bootstrap";

// // const Layout = ({ children }) => {
// //   return (
// //    <div style={{ display: "flex" }}>
// //       <Sidebar />
// //       <div style={{ flex: 1, marginLeft: "220px" }}>
// //         <Navbar />
        
// //         <Container fluid style={{ marginTop: "70px", padding: "20px" }}>
// //           {children}
// //         </Container>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Layout;
// import React from "react";
// import TopNavbar from "./TopNavbar";
// import Sidebar from "./Sidebar";
// import { Container, Row, Col } from "react-bootstrap";

// const Layout = ({ children }) => {
//   return (
//     <div>
//       <TopNavbar />
//       <Container fluid>
//         <Row>
//           {/* Sidebar on the left */}
//           <Col xs={2} className="p-0">
//             <Sidebar />
//           </Col>

//           {/* Page Content */}
//           <Col xs={10} mb={3} className="p-4" style={{ marginTop: "55px" }}>
//             {children}
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Layout;
// Layout.jsx
// Layout.jsx

// import React, { useState } from "react";
// import TopNavbar from "./TopNavbar";
// import Sidebar from "./Sidebar";
// import { Container, Row, Col, Offcanvas } from "react-bootstrap";

// const Layout = ({ children }) => {
//   // State to control the visibility of the Offcanvas sidebar on mobile
//   const [showSidebar, setShowSidebar] = useState(false);

//   const handleSidebarClose = () => setShowSidebar(false);
//   const handleSidebarShow = () => setShowSidebar(true);

//   return (
//     <div>
//       {/* Pass the function to open the sidebar to the navbar */}
//       <TopNavbar handleShowSidebar={handleSidebarShow} />

//       <Container fluid>
//         <Row>
//           {/* 1. DESKTOP SIDEBAR */}
//           {/* This column is hidden on mobile (d-none) and visible on large screens (d-lg-block) */}
//           <Col lg={2} className="d-none d-lg-block p-0">
//             <Sidebar />
//           </Col>

//           {/* 2. MOBILE OFFCANVAS SIDEBAR */}
//           {/* This component is only for mobile and is controlled by the 'showSidebar' state */}
//           <Offcanvas show={showSidebar} onHide={handleSidebarClose} responsive="lg" className="d-lg-none">
//             <Offcanvas.Header closeButton>
//               <Offcanvas.Title>Menu</Offcanvas.Title>
//             </Offcanvas.Header>
//             <Offcanvas.Body className="p-0">
//               <Sidebar />
//             </Offcanvas.Body>
//           </Offcanvas>

//           {/* 3. PAGE CONTENT */}
//           {/* Takes full width on mobile (xs={12}) and less width on desktop (lg={10}) */}
//           <Col xs={12} lg={10} className="p-4" style={{ marginTop: "55px" }}>
//             {children}
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Layout;

// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import { Container, Row, Col, Offcanvas } from "react-bootstrap";
// import TopNavbar from "./TopNavbar";
// import Sidebar from "./Sidebar";

// const Layout = () => {
//   const [showSidebar, setShowSidebar] = useState(false);

//   const handleSidebarClose = () => setShowSidebar(false);
//   const handleSidebarShow = () => setShowSidebar(true);

//   return (
//     <div className="app-layout">
//       <TopNavbar handleShowSidebar={handleSidebarShow} />

//       <Container fluid>
//         <Row>
//           {/* Desktop Sidebar (Visible on large screens) */}
//           <Col lg={2} className="d-none d-lg-block p-0">
//             <Sidebar />
//           </Col>

//           {/* Mobile Sidebar (Appears from the side) */}
//           <Offcanvas show={showSidebar} onHide={handleSidebarClose} className="d-lg-none">
//             <Offcanvas.Header closeButton>
//               <Offcanvas.Title>Menu</Offcanvas.Title>
//             </Offcanvas.Header>
//             <Offcanvas.Body className="p-0">
//               {/* Pass the close function to the sidebar for auto-closing */}
//               <Sidebar onLinkClick={handleSidebarClose} />
//             </Offcanvas.Body>
//           </Offcanvas>

//           {/* Main Page Content */}
//           <Col xs={12} lg={10}>
//             <main className="p-4" style={{ marginTop: "55px" }}>
//               <Outlet /> {/* This is where your page component will be rendered */}
//             </main>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Layout;
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

// Import the new CSS file for the layout
import "./Layout.css";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  return (
    <div className="app-layout">
      <TopNavbar handleShowSidebar={handleSidebarShow} />

      <Container fluid>
        {/* We apply a class to the Row to push the WHOLE THING down */}
        <Row className="main-content-row">
          {/* Desktop Sidebar */}
          <Col lg={2} className="d-none d-lg-block p-0">
            <Sidebar />
          </Col>

          {/* Mobile Sidebar */}
          <Offcanvas show={showSidebar} onHide={handleSidebarClose} className="d-lg-none">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
              <Sidebar onLinkClick={handleSidebarClose} />
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Page Content */}
          <Col xs={12} lg={10}>
            {/* The inline style has been removed from here */}
            <main className="p-4">
              <Outlet />
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Layout;

