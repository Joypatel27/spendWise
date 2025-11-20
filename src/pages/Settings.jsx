// // import React from 'react'

// // const Settings = () => {
// //   return (
// //     <div>Settings</div>
// //   )
// // }

// // export default Settings
// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   ListGroup,
//   Alert,
// } from "react-bootstrap";
// import { FaUserCircle, FaBell, FaSun, FaMoon, FaDatabase, FaFileExport } from "react-icons/fa";

// const Settings = () => {
//   // --- State for settings (In a real app, this would be saved to a backend or localStorage) ---
//   const [profile, setProfile] = useState({ name: "Demo User", email: "demo@example.com" });
//   const [currency, setCurrency] = useState("INR");
//   // const [notifications, setNotifications] = useState({ budgetAlerts: true, weeklySummary: false });
//   const [darkMode, setDarkMode] = useState(false);

//   // const handleNotificationChange = (e) => {
//   //   setNotifications({ ...notifications, [e.target.name]: e.target.checked });
//   // };
  
//   const handleThemeChange = () => {
//       setDarkMode(!darkMode);
//       // In a real app, you would add logic here to change the app's theme
//       alert(`Theme switched to ${!darkMode ? 'Dark Mode' : 'Light Mode'}. (UI change not implemented in this demo)`);
//   }

//   const handleExportData = () => {
//       alert("Exporting data... (This is a placeholder action)");
//   }

//   return (
//     <Container fluid>
//       <h2 className="h4 mb-4">Settings</h2>
//       <Row>
//         {/* Left Column: Navigation */}
//         <Col md={4} lg={3}>
//             <Card>
//                 <ListGroup variant="flush">
//                     <ListGroup.Item action href="#profile"><FaUserCircle className="me-2"/> Profile</ListGroup.Item>
//                     {/* <ListGroup.Item action href="#notifications"><FaBell className="me-2"/> Notifications</ListGroup.Item> */}
//                     <ListGroup.Item action href="#appearance"><FaSun className="me-2"/> Appearance</ListGroup.Item>
//                     <ListGroup.Item action href="#data"><FaDatabase className="me-2"/> Data Management</ListGroup.Item>
//                 </ListGroup>
//             </Card>
//         </Col>

//         {/* Right Column: Settings Content */}
//         <Col md={8} lg={9}>
//           {/* Profile Section */}
//           <Card className="mb-4" id="profile">
//             <Card.Header>
//               <Card.Title as="h5" className="mb-0">
//                 <FaUserCircle className="me-2" /> Profile
//               </Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <Form>
//                 <Form.Group as={Row} className="mb-3">
//                   <Form.Label column sm="2">Name</Form.Label>
//                   <Col sm="10">
//                     <Form.Control type="text" value={profile.name} readOnly />
//                   </Col>
//                 </Form.Group>
//                 <Form.Group as={Row}>
//                   <Form.Label column sm="2">Email</Form.Label>
//                   <Col sm="10">
//                     <Form.Control type="email" value={profile.email} readOnly />
//                   </Col>
//                 </Form.Group>
//               </Form>
//             </Card.Body>
//           </Card>

//           {/* Notifications Section
//           <Card className="mb-4" id="notifications">
//             <Card.Header>
//               <Card.Title as="h5" className="mb-0">
//                 <FaBell className="me-2" /> Notifications
//               </Card.Title>
//             </Card.Header>
//             <Card.Body>
//               <Form>
//                 <Form.Check
//                   type="switch"
//                   id="budget-alerts"
//                   name="budgetAlerts"
//                   label="Budget Alerts"
//                   checked={notifications.budgetAlerts}
//                   onChange={handleNotificationChange}
//                   className="mb-2"
//                 />
//                 <Form.Check
//                   type="switch"
//                   id="weekly-summary"
//                   name="weeklySummary"
//                   label="Weekly Summary Email"
//                   checked={notifications.weeklySummary}
//                   onChange={handleNotificationChange}
//                 />
//               </Form>
//             </Card.Body>
//           </Card> */}
          
//           {/* Appearance Section */}
//           <Card className="mb-4" id="appearance">
//              <Card.Header>
//               <Card.Title as="h5" className="mb-0">
//                 <FaSun className="me-2" /> Appearance
//               </Card.Title>
//             </Card.Header>
//             <Card.Body className="d-flex justify-content-between align-items-center">
//                 <span>Theme</span>
//                 <Button variant="outline-primary" onClick={handleThemeChange}>
//                     {darkMode ? <><FaSun className="me-2"/> Light Mode</> : <><FaMoon className="me-2"/> Dark Mode</>}
//                 </Button>
//             </Card.Body>
//           </Card>

         
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Settings;


//  {/* Data Management Section */}
//           {/* <Card className="mb-4" id="data">
//             <Card.Header>
//                 <Card.Title as="h5" className="mb-0"><FaDatabase className="me-2" /> Data Management</Card.Title>
//             </Card.Header>
//             <Card.Body>
//                 <p>Export all your transaction data to a CSV file.</p>
//                 <Button variant="secondary" onClick={handleExportData}>
//                     <FaFileExport className="me-2"/> Export Data
//                 </Button>
//                 <hr/>
//                 <Alert variant="danger">
//                     <Alert.Heading>Danger Zone</Alert.Heading>
//                     <p>Resetting your data will permanently delete all transactions, budgets, and accounts. This action cannot be undone.</p>
//                     <Button variant="outline-danger">Reset All Data</Button>
//                 </Alert>
//             </Card.Body>
//           </Card> */}



// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { FaUserCircle, FaSun, FaMoon, FaDatabase } from "react-icons/fa";
import axios from "axios";

const Settings = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/authRoutes/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (err) {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        setProfile({ name: localUser.name, email: localUser.email });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleExportData = () => {
    alert("Exporting data... more features coming soon!");
  };

  if (loading) return <Container className="p-4">Loading...</Container>;

  return (
    <Container fluid>
      <h2 className="h4 mb-4">Settings</h2>
      {error && <Alert variant="warning">{error}</Alert>}

      <Row>
        {/* Left Navigation */}
        <Col md={4} lg={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item action href="#profile">
                <FaUserCircle className="me-2" /> Profile
              </ListGroup.Item>
              <ListGroup.Item action href="#appearance">
                <FaSun className="me-2" /> Appearance
              </ListGroup.Item>
              <ListGroup.Item action href="#data">
                <FaDatabase className="me-2" /> Log out
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={8} lg={9}>
          {/* PROFILE */}
          <Card className="mb-4" id="profile">
            <Card.Header>
              <Card.Title className="mb-0">
                <FaUserCircle className="me-2" /> Profile
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={profile.name} readOnly />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={profile.email} readOnly />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {/* APPEARANCE */}
          <Card className="mb-4" id="appearance">
            <Card.Header>
              <Card.Title className="mb-0">
                <FaSun className="me-2" /> Appearance
              </Card.Title>
            </Card.Header>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <span>Theme</span>
              <Button variant="outline-primary" onClick={handleThemeChange}>
                {darkMode ? (
                  <>
                    <FaSun className="me-2" /> Light Mode
                  </>
                ) : (
                  <>
                    <FaMoon className="me-2" /> Dark Mode
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>

          {/* DATA MANAGEMENT */}
          <Card className="mb-4" id="data">
            
            <Card.Body>
              <Button variant="outline-secondary" onClick={handleExportData}>
                Log out
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
