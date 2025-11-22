

// src/pages/Budgets.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  ListGroup,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import { FaPlusCircle, FaTrashAlt, FaList } from "react-icons/fa";
import "./Budgets.css";
import { useData } from "../context/DataContext";

/** Circular progress - SVG ring (responsive size via prop) */
const CircularProgress = ({ pct = 0, size = 120, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const safePct = Math.min(100, Math.max(0, Number(pct) || 0));
  const offset = circ - (safePct / 100) * circ;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className="circular-progress"
      role="img"
      aria-label={`${Math.round(safePct)}%`}
    >
      <defs>
        <linearGradient id="grad" x1="0" x2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      <circle cx={center} cy={center} r={radius} stroke="#eef6fb" strokeWidth={stroke} fill="none" />
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="url(#grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${circ}`}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="circular-text">
        <tspan className="circular-text-big">{Math.round(safePct)}%</tspan>
      </text>
    </svg>
  );
};

const BudgetCard = ({ budget, spent = 0, matchedTxns = [], onDelete, onViewTransactions, progressSize }) => {
  const amountNum = Number(budget.amount) || 0;
  const remaining = Math.max(0, amountNum - Number(spent || 0));
  const pct = amountNum > 0 ? Math.min(100, Math.round((Number(spent || 0) / amountNum) * 100)) : 0;
  const recent = (matchedTxns || []).slice(0, 3);
  const isIncome = budget.type === "income";

  const fmtDate = (d) => {
    if (!d) return "Unknown date";
    const dt = d instanceof Date ? d : new Date(d);
    if (isNaN(dt.getTime())) return "Unknown date";
    return dt.toLocaleDateString();
  };

  return (
    <Card className="budget-card-upgraded mb-4">
      <Card.Body className="budget-body d-flex flex-column flex-md-row align-items-stretch gap-3">
        <div className="progress-area d-flex align-items-center justify-content-center">
          <CircularProgress pct={pct} size={progressSize} stroke={Math.max(8, Math.round(progressSize * 0.08))} />
        </div>

        <div className="budget-main-content flex-grow-1">
          <div className="d-flex align-items-start justify-content-between">
            <div className="budget-title-wrap">
              <Card.Title className="mb-1 text-capitalize budget-title">{budget.name}</Card.Title>
              <div className="text-muted small budget-meta">
                {budget.category ? `Category: ${budget.category}` : "Applies to all categories"} • Start day: {budget.startDay || 1}
              </div>
              <div className="small mt-1">
                <strong>{(budget.type || "spending").toUpperCase()}</strong>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="small text-muted mb-2">{isIncome ? "Recent earnings" : "Recent spend"}</div>

            {recent.length === 0 ? (
              <div className="text-muted small">No transactions yet</div>
            ) : (
              <div className="recent-list-vertical d-flex gap-2 flex-column flex-md-row">
                {recent.map((t) => {
                  const dateVal = t.date || t.dateObj || t.createdAt;
                  const amt = Number(t.amount ?? t.amountNum) || 0;
                  return (
                    <div key={t._id || `${t._id}-${Math.random()}`} className="recent-item p-2 border rounded">
                      <div className="fw-semibold text-truncate">{t.category}</div>
                      <div className="small text-muted">{fmtDate(dateVal)} • {t.method}</div>
                      <div className={`fw-bold ${amt < 0 ? "text-danger" : "text-success"}`}>₹{Math.abs(amt).toLocaleString("en-IN")}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="budget-right d-flex flex-column align-items-end text-end">
          <div className="small text-muted">Monthly Budget</div>
          <div className="h4 mb-1">₹{amountNum.toLocaleString("en-IN")}</div>

          <div>
            <Badge bg="success">Active</Badge>
          </div>

          <div className="mt-3">
            <div className="small text-muted">{isIncome ? "Earned" : "Spent"}</div>
            <div className="fw-bold fs-5">₹{Number(spent || 0).toLocaleString("en-IN")}</div>
            <div className="small text-muted mt-1">
              {isIncome ? "Remaining target" : "Remaining"} <span className="fw-bold">₹{remaining.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-3 d-flex flex-wrap gap-2 justify-content-end">
            <Button variant="outline-secondary" size="sm" onClick={() => onViewTransactions(budget._id)}>
              <FaList className="me-1" /> View
            </Button>

            <Button variant="outline-danger" size="sm" onClick={() => onDelete(budget._id)}>
              <FaTrashAlt className="me-1" /> Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const Budgets = () => {
  const { budgets = [], transactions = [], loading = {}, fetchBudgets, fetchTransactions, refreshAll } = useData();

  // track window width so we can pick good progress sizes
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [localLoading, setLocalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTxnModal, setShowTxnModal] = useState(false);
  const [selectedTxns, setSelectedTxns] = useState([]);
  const [newBudget, setNewBudget] = useState({ name: "", category: "", amount: "", startDay: 1, type: "spending" });
  const [oneMonth, setOneMonth] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!budgets.length && typeof fetchBudgets === "function") fetchBudgets();
    if (!transactions.length && typeof fetchTransactions === "function") fetchTransactions();
    // eslint-disable-next-line
  }, []);

  // compute month window helper (unchanged)
  const computeMonthWindow = (refDate = new Date(), startDay = 1) => {
    const d = new Date(refDate);
    const day = d.getDate();

    let start, end;

    if (!startDay || startDay <= 1) {
      start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    } else {
      if (day >= startDay) {
        start = new Date(d.getFullYear(), d.getMonth(), startDay, 0, 0, 0, 0);
        end = new Date(d.getFullYear(), d.getMonth() + 1, startDay - 1, 23, 59, 59, 999);
      } else {
        start = new Date(d.getFullYear(), d.getMonth() - 1, startDay, 0, 0, 0, 0);
        end = new Date(d.getFullYear(), d.getMonth(), startDay - 1, 23, 59, 59, 999);
      }
    }

    return { start, end };
  };

  // budgetData computation unchanged (keeps server fallback behavior)
  const budgetData = useMemo(() => {
    const map = {};
    const txnsByBudget = {};

    (budgets || []).forEach((b) => {
      const serverSpent = typeof b.spent !== "undefined" ? Number(b.spent) : null;
      const serverMatched = Array.isArray(b.matchedTxns) ? b.matchedTxns : null;
      const { start, end } = computeMonthWindow(new Date(), b.startDay || 1);
      const catTrim = b.category ? String(b.category).trim().toLowerCase() : "";

      if (serverSpent !== null) {
        const localMatched = serverMatched
          ? serverMatched
          : (transactions || []).filter((t) => {
              const d = t.date ? new Date(t.date) : t.createdAt ? new Date(t.createdAt) : null;
              if (!d || isNaN(d.getTime())) return false;
              if (d < start || d > end) return false;

              if (catTrim) {
                const tcat = (t.category || "").toString().toLowerCase();
                if (!tcat.includes(catTrim)) return false;
              }
              if (b.type === "income") return Number(t.amount) > 0;
              return Number(t.amount) < 0;
            });

        map[b._id] = { spent: serverSpent, matched: localMatched };
        txnsByBudget[b._id] = localMatched;
      } else {
        const matchedLocal = (transactions || []).filter((t) => {
          const d = t.date ? new Date(t.date) : t.createdAt ? new Date(t.createdAt) : null;
          if (!d || isNaN(d.getTime())) return false;
          if (d < start || d > end) return false;

          if (catTrim) {
            const tcat = (t.category || "").toString().toLowerCase();
            if (!tcat.includes(catTrim)) return false;
          }
          if (b.type === "income") return Number(t.amount) > 0;
          return Number(t.amount) < 0;
        });

        const sum = matchedLocal.reduce((acc, t) => {
          const n = Number(t.amount) || 0;
          if (b.type === "income") return acc + (n > 0 ? n : 0);
          return acc + (n < 0 ? Math.abs(n) : 0);
        }, 0);

        map[b._id] = { spent: Number(sum.toFixed(2)), matched: matchedLocal };
        txnsByBudget[b._id] = matchedLocal;
      }
    });

    return { map, txnsByBudget };
  }, [budgets, transactions]);

  const totalBudgeted = (budgets || []).reduce((s, b) => s + (Number(b.amount) || 0), 0);
  const totalSpentAcrossBudgets = Object.values(budgetData.map || {}).reduce((s, v) => s + (v?.spent || 0), 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpentAcrossBudgets);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget({ ...newBudget, [name]: value });
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.name || !newBudget.amount) {
      alert("Please provide name and amount for the budget.");
      return;
    }

    try {
      setLocalLoading(true);
      await axios.post(
        "/api/budgets",
        {
          name: newBudget.name,
          category: newBudget.category ? String(newBudget.category).trim() : "",
          amount: Number(newBudget.amount),
          startDay: Number(newBudget.startDay || 1),
          oneMonth: !!oneMonth,
          type: newBudget.type || "spending",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (typeof refreshAll === "function") {
        await refreshAll();
      } else {
        if (typeof fetchBudgets === "function") await fetchBudgets();
        if (typeof fetchTransactions === "function") await fetchTransactions();
      }

      setNewBudget({ name: "", category: "", amount: "", startDay: 1, type: "spending" });
      setOneMonth(false);
      setShowModal(false);
    } catch (err) {
      console.error("Create budget error:", err);
      alert(err?.response?.data?.message || "Failed to create budget");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await axios.delete(`/api/budgets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (typeof fetchBudgets === "function") await fetchBudgets();
    } catch (err) {
      console.error("Delete budget error:", err);
      alert(err?.response?.data?.message || "Failed to delete budget");
    }
  };

  const handleViewTransactions = (budgetId) => {
    const matched = budgetData.txnsByBudget?.[budgetId] || [];
    setSelectedTxns(matched);
    setShowTxnModal(true);
  };

  const handleRefreshTransactions = async () => {
    try {
      setLocalLoading(true);
      if (typeof fetchTransactions === "function") await fetchTransactions();
    } catch (err) {
      console.error("Refresh transactions error:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  if (localLoading || loading?.budgets || loading?.transactions) {
    return (
      <div style={{ padding: 20 }}>
        <Spinner animation="border" />
      </div>
    );
  }

  // choose a good progress size based on window width
  const progressSize = windowWidth < 420 ? 90 : windowWidth < 768 ? 110 : 140;

  return (
    <Container fluid className="budgets-page-upgraded" style={{ padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-3">
        <h2 className="h4 mb-0">Monthly Budgets</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={handleRefreshTransactions}>Refresh Txns</Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlusCircle className="me-2" /> Add Monthly Budget
          </Button>
        </div>
      </div>

      <Row className="mb-4 g-3">
        <Col xs={12} md={4}>
          <Card className="summary-card-upgraded">
            <Card.Body>
              <div className="summary-title">Total Budgeted</div>
              <div className="summary-value">₹{totalBudgeted.toLocaleString("en-IN")}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="summary-card-upgraded">
            <Card.Body>
              <div className="summary-title">Total Spent (this month)</div>
              <div className="summary-value">₹{totalSpentAcrossBudgets.toLocaleString("en-IN")}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="summary-card-upgraded">
            <Card.Body>
              <div className="summary-title">Total Remaining</div>
              <div className={`summary-value ${totalRemaining <= 0 ? "text-danger" : "text-success"}`}>₹{totalRemaining.toLocaleString("en-IN")}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          {(!budgets || budgets.length === 0) ? (
            <Card className="p-4 text-center empty-card-upgraded">
              <div className="text-muted">No monthly budgets yet. Click "Add Monthly Budget" to create one.</div>
            </Card>
          ) : (
            budgets.map((b) => {
              const d = budgetData.map?.[b._id] || { spent: 0, matched: [] };
              const spent = d.spent || 0;
              const matched = d.matched || [];
              return (
                <BudgetCard
                  key={b._id}
                  budget={b}
                  matchedTxns={matched}
                  spent={spent}
                  onDelete={handleDelete}
                  onViewTransactions={handleViewTransactions}
                  progressSize={progressSize}
                />
              );
            })
          )}
        </Col>
      </Row>

      {/* Add Budget Modal (unchanged) */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setOneMonth(false); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Monthly Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddBudget}>
            <Form.Group className="mb-3">
              <Form.Label>Budget Name</Form.Label>
              <Form.Control type="text" name="name" value={newBudget.name} onChange={handleInputChange} placeholder="e.g., Groceries or Salary" required autoFocus />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={newBudget.type} onChange={handleInputChange}>
                <option value="spending">Spending</option>
                <option value="income">Income (target earnings)</option>
                <option value="saving">Saving</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category (optional)</Form.Label>
              <Form.Control type="text" name="category" value={newBudget.category} onChange={handleInputChange} placeholder='Exact category name or partial (e.g., "Food")' />
              <Form.Text className="text-muted">Category matching is case-insensitive and will match substrings (so "Food" matches "Restaurant, Fast Food").</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Monthly Amount (₹)</Form.Label>
              <Form.Control type="number" name="amount" value={newBudget.amount} onChange={handleInputChange} placeholder="e.g., 10000" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Day of Month</Form.Label>
              <Form.Control type="number" name="startDay" value={newBudget.startDay} onChange={handleInputChange} min={1} max={28} />
              <Form.Text className="text-muted">Budget window starts on this day every month. Default is 1.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="oneMonth"
                label="One-month budget (salary)"
                checked={oneMonth}
                onChange={(e) => setOneMonth(e.target.checked)}
              />
              <Form.Text className="text-muted">If checked, this budget will automatically expire after 1 month (server handles expiresAt).</Form.Text>
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={localLoading}>{localLoading ? "Saving..." : "Save Budget"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Transactions preview modal (unchanged) */}
      <Modal show={showTxnModal} onHide={() => setShowTxnModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transactions contributing to this budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTxns.length === 0 ? (
            <div className="text-center text-muted py-4">No transactions for this budget period.</div>
          ) : (
            <ListGroup variant="flush">
              {selectedTxns.map((t) => {
                const dateVal = t.date || t.dateObj || t.createdAt;
                const amt = Number(t.amount ?? t.amountNum) || 0;
                return (
                  <ListGroup.Item key={t._id || `${t._id}-${Math.random()}`} className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{t.category}</div>
                      <div className="small text-muted">{t.method} • {(() => {
                        const dt = dateVal ? new Date(dateVal) : null;
                        return dt && !isNaN(dt.getTime()) ? dt.toLocaleDateString() : "Unknown date";
                      })()}</div>
                    </div>
                    <div className={`fw-bold ${amt < 0 ? "text-danger" : "text-success"}`}>₹{Math.abs(amt).toLocaleString("en-IN")}</div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Budgets;
