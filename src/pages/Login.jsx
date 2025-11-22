import React, { useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // <-- new
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(true); // mark that user attempted to submit

    // basic client-side validation
    if (!email.trim() || !password.trim()) {
      return; // don't attempt request if invalid
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  // show invalid only after submission attempt
  const showInvalid = (value) => submitted && value.trim() === "";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px",
        background: "#f3f4f6",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "28px 26px",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(16,24,40,0.08)",
          border: "1px solid rgba(0,0,0,0.04)",
          background: "#fff",
        }}
      >
        <h2
          className="text-center"
          style={{ marginBottom: "8px", fontWeight: 800, fontSize: "28px" }}
        >
          Welcome Back!
        </h2>

       

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleLogin} noValidate>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600 }}>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={showInvalid(email)}
              style={{
                height: "46px",
                borderRadius: "8px",
                paddingLeft: "12px",
              }}
            />
            <Form.Control.Feedback type="invalid">
              Email is required.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={{ fontWeight: 600 }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={showInvalid(password)}
              style={{
                height: "46px",
                borderRadius: "8px",
                paddingLeft: "12px",
              }}
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
            </Form.Control.Feedback>
          </Form.Group>

         

          <Button
            variant="primary"
            type="submit"
            className="w-100 d-flex align-items-center justify-content-center"
            disabled={loading}
            style={{
              height: "48px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: 0.2,
            }}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden />
                <span style={{ marginLeft: 10 }}>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
            fontSize: "15px",
            color: "#374151",
          }}
        >
          <span>Don't have an account? </span>
          <Link
            to="/signup"
            style={{ marginLeft: 6, fontWeight: 600 }}
            onClick={() => setSubmitted(false)} // reset submission state when going to signup
          >
            Register
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link
            to="/forgot-password"
            style={{ fontSize: 14, color: "#2563eb" }}
            onClick={() => setSubmitted(false)}
          >
            Forgot Password?
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
