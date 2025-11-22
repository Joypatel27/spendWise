
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
  Dropdown
} from "react-bootstrap";
import { FaUniversity, FaMoneyBillWave, FaCreditCard, FaPlusCircle, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import "./Accounts.css"; // <-- import the CSS below

const accountIcon = (type) => {
  switch (type) {
    case "Bank": return <FaUniversity className="acct-icon" />;
    case "Credit Card": return <FaCreditCard className="acct-icon" />;
    case "Cash": return <FaMoneyBillWave className="acct-icon" />;
    default: return <FaMoneyBillWave className="acct-icon" />;
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
    <Container fluid style={{ paddingTop: 12, paddingBottom: 24 }}>
      <h2 className="h4 mb-4">Accounts</h2>

      <Row className="mb-4">
        {/* Left column - total + CTA */}
        <Col xs={12} md={4} className="mb-3">
          <Card className="mb-3 total-card">
            <Card.Body className="text-center">
              <Card.Subtitle className="text-muted mb-2">Total Balance</Card.Subtitle>
              <Card.Title className={`display-6 fw-bold ${totalBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                ₹{totalBalance.toLocaleString("en-IN")}
              </Card.Title>
            </Card.Body>
          </Card>

          <div className="d-grid">
            <Button variant="primary" size="lg" onClick={openAdd} className="add-account-btn">
              <FaPlusCircle className="me-2" /> Add New Account
            </Button>
          </div>
        </Col>

        {/* Right column - accounts list */}
        <Col xs={12} md={8}>
          <Card className="accounts-card">
            <Card.Header className="fw-bold">Your Accounts</Card.Header>
            <ListGroup variant="flush">
              {loading ? (
                <ListGroup.Item className="text-center py-4"><Spinner animation="border" /></ListGroup.Item>
              ) : accounts.length === 0 ? (
                <ListGroup.Item className="text-center text-muted py-4">No accounts yet.</ListGroup.Item>
              ) : (
                accounts.map((acc) => (
                  <ListGroup.Item key={acc._id} className="acct-row d-flex align-items-center justify-content-between">
                    <div className="acct-left d-flex align-items-center">
                      <div className="acct-icon-wrap">{accountIcon(acc.type)}</div>
                      <div className="acct-text">
                        <div className="acct-name fw-bold text-truncate">{acc.name}</div>
                        <div className="small text-muted acct-type">{acc.type}</div>
                      </div>
                    </div>

                    <div className="acct-right d-flex align-items-center">
                      <div className="me-2">
                        <Badge pill bg={acc.balance >= 0 ? "light" : "danger"} text={acc.balance >= 0 ? "dark" : "light"} className="acct-badge">
                          ₹{Number(acc.balance).toLocaleString("en-IN")}
                        </Badge>
                      </div>

                      <div className="acct-actions d-none d-sm-flex gap-2">
                        <Button variant="outline-secondary" size="sm" onClick={() => openEdit(acc)} aria-label={`Edit ${acc.name}`}>
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(acc._id)} aria-label={`Delete ${acc.name}`}>
                          <FaTrash />
                        </Button>
                      </div>

                      {/* compact dropdown for xs screens */}
                      <div className="acct-actions-sm d-sm-none">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="light" size="sm" id={`acct-dd-${acc._id}`}>⋮</Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => openEdit(acc)}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(acc._id)}>Delete</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
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
