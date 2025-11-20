
// import React, {useState } from "react";
// import {
//   Button,
//   Modal,
//   Form,
//   Container,
//   Row,
//   Col,
//   Card,
//   ListGroup,
//   Badge,
// } from "react-bootstrap";
// import { FaUniversity, FaMoneyBillWave, FaCreditCard, FaPlusCircle } from "react-icons/fa";

// // --- Mock Data (Replace with your actual data fetching) ---
// const initialAccounts = [
//   { id: 1, name: "SBI Savings", type: "Bank", balance: 52500 },
//   { id: 2, name: "HDFC Credit Card", type: "Credit Card", balance: -12500 },
//   { id: 3, name: "Cash in Wallet", type: "Cash", balance: 4200 },
//   { id: 4, name: "ICICI Checking", type: "Bank", balance: 18300 },
// ];
// // --- End of Mock Data ---

// const Accounts = () => {
//   const [accounts, setAccounts] = useState(initialAccounts);
//   const [showModal, setShowModal] = useState(false);
//   const [newAccount, setNewAccount] = useState({ name: "", type: "Bank", balance: "" });

//   // Calculate total balance
//   const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

//   const handleClose = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewAccount({ ...newAccount, [name]: value });
//   };

//   const handleAddAccount = (e) => {
//     e.preventDefault();
//     if (!newAccount.name || !newAccount.balance) {
//       alert("Please fill in all fields.");
//       return;
//     }
//     const accountToAdd = {
//       id: Date.now(),
//       ...newAccount,
//       balance: parseFloat(newAccount.balance),
//     };
//     setAccounts([...accounts, accountToAdd]);
//     setNewAccount({ name: "", type: "Bank", balance: "" });
//     handleClose();
//   };
  
//   // Helper to get the right icon for the account type
//   const getAccountIcon = (type) => {
//     switch (type) {
//       case "Bank":
//         return <FaUniversity className="me-2" />;
//       case "Credit Card":
//         return <FaCreditCard className="me-2" />;
//       case "Cash":
//         return <FaMoneyBillWave className="me-2" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <Container fluid>
//         <h2 className="h4 mb-4">Accounts</h2>
//         <Row>
//           {/* Left Column: Summary and Add Button */}
//           <Col md={4}>
//             <Card className="mb-4">
//               <Card.Body className="text-center">
//                 <Card.Subtitle className="text-muted mb-2">Total Balance</Card.Subtitle>
//                 <Card.Title className={`display-6 fw-bold ${totalBalance >= 0 ? 'text-success' : 'text-danger'}`}>
//                   ₹{totalBalance.toLocaleString("en-IN")}
//                 </Card.Title>
//               </Card.Body>
//             </Card>
//             <div className="d-grid">
//               <Button variant="primary" size="lg" onClick={handleShow}>
//                 <FaPlusCircle className="me-2" /> Add New Account
//               </Button>
//             </div>
//           </Col>

//           {/* Right Column: Accounts List */}
//           <Col md={8}>
//             <Card>
//               <Card.Header>Your Accounts</Card.Header>
//               <ListGroup variant="flush">
//                 {accounts.map((account) => (
//                   <ListGroup.Item key={account.id} className="d-flex justify-content-between align-items-center">
//                     <div>
//                       {getAccountIcon(account.type)}
//                       <span className="fw-bold">{account.name}</span>
//                     </div>
//                     <Badge 
//                       bg={account.balance >= 0 ? "light" : "danger"} 
//                       text={account.balance >= 0 ? "dark" : "white"} 
//                       className="fs-6"
//                     >
//                       ₹{account.balance.toLocaleString("en-IN")}
//                     </Badge>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
      
//       {/* Add Account Modal */}
//       <Modal show={showModal} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Account</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleAddAccount}>
//             <Form.Group className="mb-3">
//               <Form.Label>Account Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={newAccount.name}
//                 onChange={handleInputChange}
//                 placeholder="e.g., SBI Savings"
//                 required
//                 autoFocus
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Account Type</Form.Label>
//               <Form.Select name="type" value={newAccount.type} onChange={handleInputChange}>
//                 <option>Bank</option>
//                 <option>Credit Card</option>
//                 <option>Cash</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Current Balance (₹)</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="balance"
//                 value={newAccount.balance}
//                 onChange={handleInputChange}
//                 placeholder="Enter current balance"
//                 required
//               />
//                <Form.Text className="text-muted">
//                 For credit cards, enter this as a negative number (e.g., -5000).
//               </Form.Text>
//             </Form.Group>
//             <Button variant="primary" type="submit" className="w-100 mt-3">
//               Save Account
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default Accounts;



// src/pages/Accounts.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FaUniversity, FaMoneyBillWave, FaCreditCard, FaPlusCircle, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

const accountIcon = (type) => {
  switch (type) {
    case "Bank": return <FaUniversity className="me-2" />;
    case "Credit Card": return <FaCreditCard className="me-2" />;
    case "Cash": return <FaMoneyBillWave className="me-2" />;
    default: return null;
  }
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // account object when editing
  const [form, setForm] = useState({ name: "", type: "Bank", balance: "", currency: "INR ₹" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchAccounts", err);
      alert("Failed to load accounts. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((s, a) => s + (Number(a.balance) || 0), 0);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", type: "Bank", balance: "", currency: "INR ₹" });
    setShowModal(true);
  };

  const openEdit = (acc) => {
    setEditing(acc);
    setForm({ name: acc.name, type: acc.type, balance: acc.balance, currency: acc.currency || "INR ₹" });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Please enter account name");
    try {
      if (editing) {
        const res = await axios.put(`http://localhost:5000/api/accounts/${editing._id}`, {
          ...form,
          balance: Number(form.balance || 0),
        }, { headers: { Authorization: `Bearer ${token}` }});
        setAccounts((prev) => prev.map(a => a._id === res.data._id ? res.data : a));
      } else {
        const res = await axios.post(`http://localhost:5000/api/accounts`, {
          ...form,
          balance: Number(form.balance || 0),
        }, { headers: { Authorization: `Bearer ${token}` }});
        setAccounts((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("saveAccount", err);
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this account? This will not delete transactions.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/accounts/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setAccounts((p) => p.filter(a => a._id !== id));
    } catch (err) {
      console.error("deleteAccount", err);
      alert("Delete failed");
    }
  };

  return (
    <Container fluid style={{ paddingTop: 12 }}>
      <h2 className="h4 mb-4">Accounts</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body className="text-center">
              <Card.Subtitle className="text-muted mb-2">Total Balance</Card.Subtitle>
              <Card.Title className={`display-6 fw-bold ${totalBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                ₹{totalBalance.toLocaleString("en-IN")}
              </Card.Title>
            </Card.Body>
          </Card>

          <div className="d-grid">
            <Button variant="primary" size="lg" onClick={openAdd}>
              <FaPlusCircle className="me-2" /> Add New Account
            </Button>
          </div>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header>Your Accounts</Card.Header>
            <ListGroup variant="flush">
              {loading ? (
                <ListGroup.Item className="text-center py-4"><Spinner animation="border" /></ListGroup.Item>
              ) : accounts.length === 0 ? (
                <ListGroup.Item className="text-center text-muted py-4">No accounts yet.</ListGroup.Item>
              ) : (
                accounts.map((acc) => (
                  <ListGroup.Item key={acc._id} className="d-flex justify-content-between align-items-center">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {accountIcon(acc.type)}
                      <div>
                        <div className="fw-bold">{acc.name}</div>
                        <div className="small text-muted">{acc.type}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div>
                        <Badge bg={acc.balance >= 0 ? "light" : "danger"} text={acc.balance >= 0 ? "dark" : "white"} className="fs-6">
                          ₹{Number(acc.balance).toLocaleString("en-IN")}
                        </Badge>
                      </div>

                      <div className="d-flex gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => openEdit(acc)}>
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(acc._id)}>
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Account" : "Add New Account"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-2">
              <Form.Label>Account Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="e.g., SBI Savings" required />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Account Type</Form.Label>
              <Form.Select name="type" value={form.type} onChange={handleChange}>
                <option>Bank</option>
                <option>Credit Card</option>
                <option>Cash</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Current Balance (₹)</Form.Label>
              <Form.Control name="balance" type="number" value={form.balance} onChange={handleChange} placeholder="e.g., 10000" />
              <Form.Text className="text-muted">For credit cards, use negative number (e.g., -5000)</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Control name="currency" value={form.currency} onChange={handleChange} />
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="primary">{editing ? "Save changes" : "Save Account"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Accounts;
