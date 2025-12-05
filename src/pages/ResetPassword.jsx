// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) setErr("Missing reset token in URL.");
  }, [token]);

  const handleReset = async (e) => {
    e && e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!newPassword || newPassword.length < 6) {
      return setErr("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", {
        resetToken: token,
        newPassword,
      });
      setMsg("Password updated. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1400);
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 28, background: "#f3f4f6" }}>
      <Card style={{ width: "100%", maxWidth: 420, padding: 26, borderRadius: 12 }}>
        <h3 className="text-center mb-3">Reset Password</h3>

        {msg && <Alert variant="success">{msg}</Alert>}
        {err && <Alert variant="danger">{err}</Alert>}

        <Form onSubmit={handleReset}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
          </Form.Group>

          <Button type="submit" disabled={loading}>
            {loading ? <><Spinner as="span" animation="border" size="sm" /> Resetting...</> : "Reset Password"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
