
import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Form,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Dropdown,
  ButtonGroup,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import "./Reports.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF1493", "#4B5563", "#7C3AED"];
const rangeOptions = ["This Month", "This Week", "This Year", "All Time", "Custom Range"];

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
const endOfYear = (d) => new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const endOfDay = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };

// Monday start-of-week helper
const getStartOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(date);
  monday.setHours(0,0,0,0);
  monday.setDate(date.getDate() + diff);
  return monday;
};

// short date label for small screens
const shortDateLabel = (isoDate, width) => {
  try {
    const dt = new Date(isoDate);
    if (width < 576) return dt.toLocaleDateString(undefined, { day: "numeric", month: "short" }); // "21 Nov"
    if (width < 992) return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" }); // "Nov 21"
    return dt.toISOString().split("T")[0]; // YYYY-MM-DD on wide screens
  } catch {
    return isoDate;
  }
};

const SmallLegend = ({ payload }) => {
  // simple stacked legend for small screens
  if (!payload || !payload.length) return null;
  return (
    <div className="small-legend">
      {payload.map((p, i) => (
        <div key={p.value + i} className="small-legend-item">
          <span className="legend-swatch" style={{ background: p.color }} />
          <span className="legend-name">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("This Month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchTxns = async () => {
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const normalized = (res.data || []).map((t) => ({
          ...t,
          dateObj: t.date ? new Date(t.date) : new Date(t.createdAt || Date.now()),
          amountNum: Number(t.amount) || 0,
        }));
        setTransactions(normalized);
      } catch (err) {
        console.error("Reports fetch error:", err);
        setError(err?.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTxns();
  }, [token]);

  // from/to date window
  const [fromDate, toDate] = useMemo(() => {
    const now = new Date();
    if (range === "This Month") return [startOfMonth(now), endOfMonth(now)];
    if (range === "This Week") return [getStartOfWeek(now), endOfDay(new Date(now))];
    if (range === "This Year") return [startOfYear(now), endOfYear(now)];
    if (range === "All Time") return [new Date(0), endOfDay(new Date())];
    if (range === "Custom Range") {
      const f = customFrom ? startOfDay(new Date(customFrom)) : new Date(0);
      const t = customTo ? endOfDay(new Date(customTo)) : endOfDay(new Date());
      return [f, t];
    }
    return [startOfMonth(now), endOfMonth(now)];
  }, [range, customFrom, customTo]);

  // filter transactions in window
  const filteredTxns = useMemo(() => transactions.filter((t) => {
    const d = t.dateObj;
    return d >= fromDate && d <= toDate;
  }), [transactions, fromDate, toDate]);

  // aggregations
  const { totalSpent, avgPerDay, txnCount, pieData, lineData, barData } = useMemo(() => {
    let total = 0;
    const byCategory = {};
    const byDate = {};
    const byMethod = {};

    filteredTxns.forEach((t) => {
      const amt = Number(t.amountNum || t.amount || 0);
      const expense = amt < 0 ? Math.abs(amt) : 0;
      total += expense;

      const cat = t.category || "Uncategorized";
      byCategory[cat] = (byCategory[cat] || 0) + expense;

      const key = t.dateObj.toISOString().split("T")[0];
      byDate[key] = (byDate[key] || 0) + expense;

      const m = t.method || "Unknown";
      byMethod[m] = (byMethod[m] || 0) + expense;
    });

    const pie = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
    const sortedDates = Object.keys(byDate).sort((a,b) => new Date(a) - new Date(b));
    const line = sortedDates.map(date => ({ date, value: Number(byDate[date].toFixed(2)) }));
    const bar = Object.entries(byMethod).map(([method, total]) => ({ method, total: Number(total.toFixed(2)) }));

    const daysDiff = Math.max(1, Math.round((toDate - fromDate) / (1000*60*60*24)));
    const avg = Number((total / daysDiff).toFixed(2));
    return {
      totalSpent: Number(total.toFixed(2)),
      avgPerDay: avg,
      txnCount: filteredTxns.length,
      pieData: pie,
      lineData: line,
      barData: bar,
    };
  }, [filteredTxns, fromDate, toDate]);

  const exportCSV = () => {
    if (filteredTxns.length === 0) { alert("No transactions to export for the selected range."); return; }
    const header = ["Date","Category","Method","Amount","Currency","Notes"];
    const rows = filteredTxns.map(t => [
      t.dateObj.toISOString().split("T")[0],
      `"${(t.category||"").replace(/"/g,'""')}"`,
      t.method||"",
      t.amountNum,
      t.currency||"₹",
      `"${(t.notes||"").replace(/"/g,'""')}"`
    ]);
    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `transactions_${range.replace(/\s+/g,"_")}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  // responsive sizing decisions
  const chartHeight = windowWidth < 576 ? 260 : windowWidth < 768 ? 320 : 380;
  const pieOuterRadius = Math.max(60, Math.floor(Math.min(chartHeight, Math.max(120, windowWidth * 0.2)) / 2));
  const showPieLabels = windowWidth >= 600; // hide labels on phones
  const showLegendInline = windowWidth >= 600;

  return (
    <div className="reports-page" style={{ padding: 20 }}>
      <h2 className="mb-3">📊 Reports & Analytics</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 220 }}>
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <Row className="align-items-center mb-3 g-2">
            <Col xs={12} md={6}>
              <Dropdown as={ButtonGroup}>
                <Button variant="outline-secondary">{range}</Button>
                <Dropdown.Toggle split variant="outline-secondary" />
                <Dropdown.Menu>
                  {rangeOptions.map(opt => (<Dropdown.Item key={opt} active={opt===range} onClick={()=>setRange(opt)}>{opt}</Dropdown.Item>))}
                </Dropdown.Menu>
              </Dropdown>

              {range === "Custom Range" && (
                <div className="d-flex gap-2 mt-2 custom-range-row">
                  <InputGroup className="me-2">
                    <InputGroup.Text>From</InputGroup.Text>
                    <Form.Control type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>To</InputGroup.Text>
                    <Form.Control type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} />
                  </InputGroup>
                </div>
              )}
            </Col>

            <Col xs={12} md={6} className="text-md-end">
              <Button variant="outline-primary" className="me-2" onClick={exportCSV}>Export CSV</Button>
              <Button variant="primary" onClick={() => {
                setLoading(true);
                axios.get("http://localhost:5000/api/transactions", { headers: { Authorization: `Bearer ${token}` }})
                  .then(res => setTransactions((res.data||[]).map(t => ({ ...t, dateObj: t.date ? new Date(t.date) : new Date(t.createdAt||Date.now()), amountNum: Number(t.amount)||0 }))))
                  .catch(()=> setError("Failed to refresh"))
                  .finally(()=> setLoading(false));
              }}>Refresh</Button>
            </Col>
          </Row>

          <Row className="mb-4 g-3">
            <Col xs={12} md={4}><Card className="h-100 chart-card"><Card.Body><Card.Title>Total Spent</Card.Title><Card.Text style={{fontSize:24,fontWeight:700}}>₹{totalSpent.toLocaleString("en-IN")}</Card.Text><Card.Subtitle className="text-muted">From {fromDate.toISOString().split("T")[0]} to {toDate.toISOString().split("T")[0]}</Card.Subtitle></Card.Body></Card></Col>
            <Col xs={12} md={4}><Card className="h-100 chart-card"><Card.Body><Card.Title>Average / day</Card.Title><Card.Text style={{fontSize:24,fontWeight:700}}>₹{avgPerDay.toLocaleString("en-IN")}</Card.Text><Card.Subtitle className="text-muted">Calculated over selected range</Card.Subtitle></Card.Body></Card></Col>
            <Col xs={12} md={4}><Card className="h-100 chart-card"><Card.Body><Card.Title># Transactions</Card.Title><Card.Text style={{fontSize:24,fontWeight:700}}>{txnCount}</Card.Text><Card.Subtitle className="text-muted">Transactions in selected range</Card.Subtitle></Card.Body></Card></Col>
          </Row>

          <Row className="g-3">
            <Col xs={12} lg={6}>
              <Card className="p-3 chart-card">
                <h5 className="mb-3">Spending by Category</h5>
                {pieData.length === 0 ? (
                  <div className="text-center text-muted">No spending data for this range.</div>
                ) : (
                  <>
                    <div style={{ width: "100%", height: chartHeight }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name"
                               cx="50%" cy="50%" outerRadius={pieOuterRadius} innerRadius={pieOuterRadius * 0.5}
                               label={showPieLabels ? undefined : false} labelLine={showPieLabels} isAnimationActive={false}>
                            {pieData.map((entry, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <ReTooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                          {showLegendInline ? <Legend verticalAlign="bottom" height={36} /> : null}
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* compact legend for small screens */}
                    {!showLegendInline && (
                      <div className="compact-legend mt-2">
                        {pieData.map((p, i) => (
                          <div key={p.name} className="compact-legend-item">
                            <span className="legend-swatch" style={{ background: COLORS[i % COLORS.length] }} />
                            <span className="legend-text">{p.name} — ₹{Number(p.value).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </Card>
            </Col>

            <Col xs={12} lg={6}>
              <Card className="p-3 chart-card">
                <h5 className="mb-3">Spending Over Time</h5>
                {lineData.length === 0 ? (
                  <div className="text-center text-muted">No data to plot for selected range.</div>
                ) : (
                  <div style={{ width: "100%", height: chartHeight }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ left: 8, right: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(d)=>shortDateLabel(d, windowWidth)} interval={"preserveStartEnd"} />
                        <YAxis />
                        <ReTooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: windowWidth < 576 ? 2 : 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={12}>
              <Card className="p-3 chart-card">
                <h5 className="mb-3">Payment Method Breakdown</h5>
                {barData.length === 0 ? (
                  <div className="text-center text-muted">No payment method data for selected range.</div>
                ) : (
                  <div style={{ width: "100%", height: chartHeight }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ left: 8, right: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="method" tick={{ fontSize: windowWidth < 576 ? 11 : 12 }} interval={0} />
                        <YAxis />
                        <ReTooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                        <Legend />
                        <Bar dataKey="total" fill="#82ca9d" barSize={windowWidth < 576 ? 20 : 40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Reports;
