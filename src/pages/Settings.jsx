// // src/pages/Settings.jsx
// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   ListGroup,
//   Alert,
//   Nav,
// } from "react-bootstrap";
// import { FaUserCircle, FaSun, FaMoon, FaDatabase, FaBars } from "react-icons/fa";
// import axios from "axios";
// import "./Settings.css";

// const Settings = () => {
//   const [profile, setProfile] = useState({ name: "", email: "" });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

//   const token = localStorage.getItem("token");
//   const [activeTab, setActiveTab] = useState("profile");
//   const [navOpen, setNavOpen] = useState(false);

//   // Fetch user profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/authRoutes/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfile({
//           name: res.data.name,
//           email: res.data.email,
//         });
//       } catch (err) {
//         const localUser = JSON.parse(localStorage.getItem("user") || "{}");
//         setProfile({ name: localUser.name || "", email: localUser.email || "" });
//       }
//       setLoading(false);
//     };

//     fetchProfile();
//   }, [token]);

//   // Apply dark mode to body
//   useEffect(() => {
//     if (darkMode) {
//       document.body.classList.add("dark-mode");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.body.classList.remove("dark-mode");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   const handleThemeChange = () => setDarkMode(!darkMode);

//   const handleExportData = () => alert("Exporting data... more features coming soon!");

//   if (loading) return <Container className="p-4">Loading...</Container>;

//   return (
//     <Container fluid className="settings-page" style={{ padding: 20 }}>
//       <div className="settings-header d-flex align-items-center justify-content-between mb-3">
//         <h2 className="h4 mb-0">Settings</h2>

//         {/* Mobile nav toggle */}
//         <Button
//           variant="outline-secondary"
//           className="d-md-none"
//           aria-label="Toggle settings navigation"
//           onClick={() => setNavOpen(!navOpen)}
//         >
//           <FaBars />
//         </Button>
//       </div>

//       {error && <Alert variant="warning">{error}</Alert>}

//       <Row>
//         {/* Left Navigation - becomes top horizontal on small screens */}
//         <Col md={4} lg={3} className={`settings-nav-col ${navOpen ? "open" : ""}`}>
//           <Card className="settings-nav-card">
//             <Nav variant="pills" className="flex-column" activeKey={activeTab}>
//               <Nav.Item>
//                 <Nav.Link eventKey="profile" onClick={() => { setActiveTab("profile"); setNavOpen(false); }}>
//                   <FaUserCircle className="me-2" /> Profile
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link eventKey="appearance" onClick={() => { setActiveTab("appearance"); setNavOpen(false); }}>
//                   <FaSun className="me-2" /> Appearance
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link eventKey="data" onClick={() => { setActiveTab("data"); setNavOpen(false); }}>
//                   <FaDatabase className="me-2" /> Log out
//                 </Nav.Link>
//               </Nav.Item>
//             </Nav>
//           </Card>
//         </Col>

//         <Col md={8} lg={9}>
//           {/* PROFILE */}
//           <div className={`settings-panel ${activeTab !== "profile" ? "d-none d-md-block" : ""}`} id="profile">
//             <Card className="mb-4">
//               <Card.Header>
//                 <Card.Title className="mb-0">
//                   <FaUserCircle className="me-2" /> Profile
//                 </Card.Title>
//               </Card.Header>
//               <Card.Body>
//                 <Form>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Name</Form.Label>
//                     <Form.Control type="text" value={profile.name || ""} readOnly />
//                   </Form.Group>
//                   <Form.Group className="mb-0">
//                     <Form.Label>Email</Form.Label>
//                     <Form.Control type="email" value={profile.email || ""} readOnly />
//                   </Form.Group>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </div>

//           {/* APPEARANCE */}
//           <div className={`settings-panel ${activeTab !== "appearance" ? "d-none d-md-block" : ""}`} id="appearance">
//             <Card className="mb-4">
//               <Card.Header>
//                 <Card.Title className="mb-0">
//                   <FaSun className="me-2" /> Appearance
//                 </Card.Title>
//               </Card.Header>
//               <Card.Body className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
//                 <div>
//                   <div className="lh-1">Theme</div>
//                   {/* <div className="small text-muted">Toggle between light and dark themes for the app.</div> */}
//                 </div>

//                 <div>
//                   <Button variant={darkMode ? "outline-light" : "outline-primary"} onClick={handleThemeChange} className="theme-toggle-btn">
//                     {darkMode ? (<><FaSun className="me-2" /> Light Mode</>) : (<><FaMoon className="me-2" /> Dark Mode</>)}
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </div>

//           {/* DATA MANAGEMENT */}
//           <div className={`settings-panel ${activeTab !== "data" ? "d-none d-md-block" : ""}`} id="data">
//             <Card className="mb-4">
//               <Card.Header>
//                 <Card.Title className="mb-0">
//                   <FaDatabase className="me-2" /> Account
//                 </Card.Title>
//               </Card.Header>
//               <Card.Body>
//                 <div className="d-flex gap-2 flex-wrap">
//                   {/* <Button variant="outline-secondary" onClick={handleExportData}>Export data</Button> */}
//                   <Button variant="outline-danger" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Log out</Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Settings;



// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Nav,
} from "react-bootstrap";
import { FaUserCircle, FaSun, FaMoon, FaDatabase, FaBars } from "react-icons/fa";
import axios from "axios";
import "./Settings.css"; // keep settings-specific styles here (optional)

const Settings = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // initialize from localStorage (safe)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("profile");
  const [navOpen, setNavOpen] = useState(false);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          const localUser = JSON.parse(localStorage.getItem("user") || "{}");
          setProfile({ name: localUser.name || "", email: localUser.email || "" });
          setLoading(false);
          return;
        }
        const res = await axios.get("/api/auth/me", { headers });
        setProfile({ name: res.data.name || "", email: res.data.email || "" });
      } catch (err) {
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        setProfile({ name: localUser.name || "", email: localUser.email || "" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // when darkMode toggles: set class, persist theme, and notify app
  useEffect(() => {
    try {
      if (darkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
      // notify same-tab listeners
      window.dispatchEvent(new Event("themeChanged"));
    } catch (err) {
      console.warn("theme effect error", err);
    }
  }, [darkMode]);

  const handleThemeChange = () => setDarkMode((d) => !d);
  const handleExportData = () => alert("Exporting data... more features coming soon!");

  if (loading) return <Container className="p-4">Loading...</Container>;

  return (
    <Container fluid className="settings-page" style={{ padding: 20 }}>
      <div className="settings-header d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Settings</h2>

        <Button
          variant="outline-secondary"
          className="d-md-none"
          aria-label="Toggle settings navigation"
          onClick={() => setNavOpen(!navOpen)}
        >
          <FaBars />
        </Button>
      </div>

      {error && <Alert variant="warning">{error}</Alert>}

      <Row>
        <Col md={4} lg={3} className={`settings-nav-col ${navOpen ? "open" : ""}`}>
          <Card className="settings-nav-card">
            <Nav variant="pills" className="flex-column" activeKey={activeTab}>
              <Nav.Item>
                <Nav.Link eventKey="profile" onClick={() => { setActiveTab("profile"); setNavOpen(false); }}>
                  <FaUserCircle className="me-2" /> Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="appearance" onClick={() => { setActiveTab("appearance"); setNavOpen(false); }}>
                  <FaSun className="me-2" /> Appearance
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="data" onClick={() => { setActiveTab("data"); setNavOpen(false); }}>
                  <FaDatabase className="me-2" /> Log out
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card>
        </Col>

        <Col md={8} lg={9}>
          <div className={`settings-panel ${activeTab !== "profile" ? "d-none d-md-block" : ""}`} id="profile">
            <Card className="mb-4">
              <Card.Header>
                <Card.Title className="mb-0">
                  <FaUserCircle className="me-2" /> Profile
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={profile.name || ""} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-0">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={profile.email || ""} readOnly />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </div>

          <div className={`settings-panel ${activeTab !== "appearance" ? "d-none d-md-block" : ""}`} id="appearance">
            <Card className="mb-4">
              <Card.Header>
                <Card.Title className="mb-0">
                  <FaSun className="me-2" /> Appearance
                </Card.Title>
              </Card.Header>
              <Card.Body className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
                <div>
                  <div className="lh-1">Theme</div>
                </div>

                <div>
                  <Button variant={darkMode ? "outline-light" : "outline-primary"} onClick={handleThemeChange} className="theme-toggle-btn">
                    {darkMode ? (<><FaSun className="me-2" /> Light Mode</>) : (<><FaMoon className="me-2" /> Dark Mode</>)}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className={`settings-panel ${activeTab !== "data" ? "d-none d-md-block" : ""}`} id="data">
            <Card className="mb-4">
              <Card.Header>
                <Card.Title className="mb-0">
                  <FaDatabase className="me-2" /> Account
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="d-flex gap-2 flex-wrap">
                  <Button variant="outline-danger" onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>Log out</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
