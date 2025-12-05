// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e && e.preventDefault();
    setError(null);
    setMessage(null);
    setResetLink(null);

    if (!email.trim()) return setError("Enter your email");

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Check below for the reset link.");
      if (res.data.resetLink) {
        setResetLink(res.data.resetLink);
      } else {
        // No link returned (email may not exist); show neutral info
        setResetLink(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to request reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 28, background: "#f3f4f6" }}>
      <Card style={{ width: "100%", maxWidth: 520, padding: 26, borderRadius: 12 }}>
        <h3 className="text-center mb-3">Forgot Password</h3>

        {message && <Alert variant="info">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {!resetLink && (
          <Form onSubmit={handleSend}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" />
            </Form.Group>

            <Button type="submit" disabled={loading} className="me-2">
              {loading ? <><Spinner as="span" animation="border" size="sm" /> Sending...</> : "Get Reset Link"}
            </Button>

            <Link to="/login" style={{ marginLeft: 12 }}>Back to login</Link>
          </Form>
        )}

        {resetLink && (
          <div>
            <Alert variant="success">Reset link generated — click below to change password (dev mode).</Alert>
            <div style={{ wordBreak: "break-word" }}>
              <a href={resetLink}>{resetLink}</a>
            </div>
            <div style={{ marginTop: 14 }}>
              <Button variant="secondary" onClick={() => { setResetLink(null); setMessage(null); }}>Request Again</Button>
              <Link to="/login" style={{ marginLeft: 12 }}>Back to login</Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
