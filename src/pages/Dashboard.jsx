


import React, { useEffect, useMemo, useState } from "react";
import { Card, Row, Col, Spinner, ListGroup, Button } from "react-bootstrap";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "./Dashboard.css"; // <- add the CSS below to this file (or to your global css)

const COLORS = ["#0ea5e9", "#ff8a33"]; // cash, online

const formatINR = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const getDateKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // totals
  const [todayTotal, setTodayTotal] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTxns = async () => {
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const txns = (res.data || []).map((t) => ({
          ...t,
          dateObj: t.date ? new Date(t.date) : new Date(t.createdAt || Date.now()),
        }));
        setTransactions(txns);
        computeTotals(txns);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTxns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const endOfDay = (d) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };
  const startOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 Sun
    const diff = -day; // start from Sunday
    const s = new Date(date);
    s.setHours(0, 0, 0, 0);
    s.setDate(date.getDate() + diff);
    return s;
  };
  const endOfWeek = (d) => {
    const s = startOfWeek(d);
    const e = new Date(s);
    e.setDate(s.getDate() + 6);
    e.setHours(23, 59, 59, 999);
    return e;
  };
  const startOfMonth = (d) => {
    const date = new Date(d);
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  };
  const endOfMonth = (d) => {
    const date = new Date(d);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  };

  const computeTotals = (txns) => {
    const now = new Date();
    const tStart = startOfDay(now);
    const tEnd = endOfDay(now);
    const wStart = startOfWeek(now);
    const wEnd = endOfWeek(now);
    const mStart = startOfMonth(now);
    const mEnd = endOfMonth(now);

    let tSum = 0,
      wSum = 0,
      mSum = 0;
    txns.forEach((txn) => {
      const d = txn.dateObj instanceof Date ? txn.dateObj : new Date(txn.dateObj);
      const amt = Number(txn.amount) || 0;
      if (amt < 0) {
        if (d >= tStart && d <= tEnd) tSum += Math.abs(amt);
        if (d >= wStart && d <= wEnd) wSum += Math.abs(amt);
        if (d >= mStart && d <= mEnd) mSum += Math.abs(amt);
      }
    });
    setTodayTotal(tSum);
    setWeekTotal(wSum);
    setMonthTotal(mSum);
  };

  // Derived data
  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.dateObj) - new Date(a.dateObj))
        .slice(0, 7),
    [transactions]
  );

  const paymentBreakdown = useMemo(() => {
    let cash = 0,
      online = 0;
    transactions.forEach((t) => {
      const amt = Math.abs(Number(t.amount || 0));
      const m = (t.method || "").toLowerCase();
      if (m === "cash") cash += amt;
      else online += amt;
    });
    return [
      { name: "Cash", value: cash },
      { name: "Online", value: online },
    ];
  }, [transactions]);

  // 7-day bar chart (last 7 days including today)
  const last7Days = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      arr.push({ key: getDateKey(d), label: d.toLocaleDateString(undefined, { weekday: "short" }), value: 0 });
    }
    const map = Object.fromEntries(arr.map((a) => [a.key, a]));
    transactions.forEach((t) => {
      const key = getDateKey(t.dateObj);
      const amt = Number(t.amount || 0);
      if (amt < 0 && map[key]) {
        map[key].value += Math.abs(amt);
      }
    });
    return Object.values(map);
  }, [transactions]);

  // small helpers
  const pieTotal = paymentBreakdown.reduce((s, p) => s + (p.value || 0), 0);
  const pct = (v) => (pieTotal ? Math.round((v / pieTotal) * 100) : 0);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 className="mb-3">Dashboard</h2>

      {/* Top stats - responsive cols */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} md={4}>
          <Card className="p-3 h-100 shadow-sm">
            <div className="small text-muted">Today's Spend</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{formatINR(todayTotal)}</div>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Card className="p-3 h-100 shadow-sm">
            <div className="small text-muted">This Week</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{formatINR(weekTotal)}</div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={4}>
          <Card className="p-3 h-100 shadow-sm">
            <div className="small text-muted">This Month</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{formatINR(monthTotal)}</div>
          </Card>
        </Col>
      </Row>

      {/* Main area */}
      <Row className="g-4">
        {/* Charts area */}
        <Col lg={7} md={8} sm={12}>
          <Row className="g-3">
            {/* Payment method */}
            <Col xs={12}>
              <Card className="p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">Payment Method Breakdown</h5>
                    <div className="small text-muted">Cash vs Online</div>
                  </div>
                  <div className="text-end">
                    <div className="small text-muted">Total tracked</div>
                    <div style={{ fontWeight: 700 }}>{formatINR(pieTotal)}</div>
                  </div>
                </div>

                {/* Responsive wrapper: stacks vertically on small screens */}
                <div className="pie-legend-wrapper mt-3">
                  <div className="pie-container">
                    {/* If no data, show placeholder */}
                    {pieTotal === 0 ? (
                      <div className="empty-chart">No spending data yet</div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={paymentBreakdown}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={4}
                            isAnimationActive={false}
                            label={false}
                          >
                            {paymentBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  <div className="legend-container">
                    <div className="legend-row">
                      <div className="legend-swatch" style={{ background: COLORS[0] }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>Cash</div>
                        <div className="small text-muted">{pct(paymentBreakdown[0].value)}% • {formatINR(paymentBreakdown[0].value)}</div>
                      </div>
                    </div>

                    <div className="legend-row mt-2">
                      <div className="legend-swatch" style={{ background: COLORS[1] }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>Online</div>
                        <div className="small text-muted">{pct(paymentBreakdown[1].value)}% • {formatINR(paymentBreakdown[1].value)}</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <small className="text-muted">Note: amounts are absolute expenses and include only spending.</small>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Last 7 days */}
            <Col xs={12}>
              <Card className="p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h5 className="mb-0">Expenses — Last 7 days</h5>
                    <div className="small text-muted">Daily spend (expenses only)</div>
                  </div>
                </div>

                <div style={{ width: "100%", height: 220 }}>
                  {/* check if all zeros */}
                  {last7Days.every((d) => Number(d.value) === 0) ? (
                    <div className="empty-chart">No expense data for the last 7 days</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={last7Days} margin={{ top: 8, right: 12, left: -8, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip formatter={(val) => formatINR(val)} />
                        <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Recent transactions */}
        <Col lg={5} md={4} sm={12}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Transactions</h5>
              <Button size="sm" variant="outline-primary" href="/spendwise/transactions">View All</Button>
            </Card.Header>

            <Card.Body style={{ padding: 0 }}>
              <ListGroup variant="flush">
                {recent.length === 0 ? (
                  <ListGroup.Item className="py-4 text-center text-muted">No transactions yet</ListGroup.Item>
                ) : (
                  recent.map((t) => {
                    const amt = Number(t.amount || 0);
                    const dateStr = t.dateObj ? new Date(t.dateObj).toLocaleDateString() : "";
                    return (
                      <ListGroup.Item key={t._id} className="d-flex align-items-center justify-content-between py-3">
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{
                            width: 44, height: 44, borderRadius: 10,
                            background: "linear-gradient(180deg, rgba(15,23,42,0.03), rgba(15,23,42,0.02))",
                            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
                          }}>
                            {(t.category || "T").charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{t.category}</div>
                            <div className="small text-muted">{t.method} • {dateStr}</div>
                          </div>
                        </div>

                        <div style={{ fontWeight: 700, color: amt < 0 ? "#ef4444" : "#16a34a" }}>
                          {amt < 0 ? "- " : "+ "}{t.currency || "₹"}{Math.abs(amt).toLocaleString("en-IN")}
                        </div>
                      </ListGroup.Item>
                    );
                  })
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
