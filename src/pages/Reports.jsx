
// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   BarChart,
//   Bar,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Form, Row, Col, Card } from "react-bootstrap";

// const Reports = () => {
//   const transactions = [
//     { category: "Groceries", amount: -250, method: "Cash", date: "2025-09-22" },
//     { category: "Food & Drinks", amount: -500, method: "Online", date: "2025-09-23" },
//     { category: "Transportation", amount: -200, method: "Cash", date: "2025-09-23" },
//     { category: "Shopping", amount: -800, method: "Online", date: "2025-09-24" },
//   ];

//   // Pie Chart Data
//   const categoryData = transactions.reduce((acc, txn) => {
//     acc[txn.category] = (acc[txn.category] || 0) + Math.abs(txn.amount);
//     return acc;
//   }, {});
//   const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

//   // Line Chart Data
//   const dateData = transactions.reduce((acc, txn) => {
//     acc[txn.date] = (acc[txn.date] || 0) + Math.abs(txn.amount);
//     return acc;
//   }, {});
//   const lineData = Object.entries(dateData).map(([date, value]) => ({ date, value }));

//   // Bar Chart Data
//   const barData = [
//     {
//       method: "Cash",
//       total: transactions.filter((t) => t.method === "Cash").reduce((a, b) => a + Math.abs(b.amount), 0),
//     },
//     {
//       method: "Online",
//       total: transactions.filter((t) => t.method === "Online").reduce((a, b) => a + Math.abs(b.amount), 0),
//     },
//   ];

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF1493"];

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2 className="mb-4">📊 Reports & Analytics</h2>

//       {/* Filters */}
//       <Form.Select className="mb-4" style={{ maxWidth: "250px" }}>
//         <option>This Month</option>
//         <option>This Week</option>
//         <option>Custom Range</option>
//       </Form.Select>

//       {/* Charts in Cards */}
//       <Row>
//         {/* Pie Chart */}
//         <Col md={6} className="mb-4">
//           <Card className="p-3 shadow-sm">
//             <h5 className="text-center">Spending by Category</h5>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
//                   {pieData.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>

//         {/* Line Chart */}
//         <Col md={6} className="mb-4">
//           <Card className="p-3 shadow-sm">
//             <h5 className="text-center">Spending Over Time</h5>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={lineData}>
//                 <CartesianGrid stroke="#eee" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>

//       {/* Bar Chart */}
//       <Row>
//         <Col md={12}>
//           <Card className="p-3 shadow-sm">
//             <h5 className="text-center">Payment Method Breakdown</h5>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={barData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="method" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="total" fill="#82ca9d" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Reports;



//newww 


// src/pages/Reports.jsx
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF1493", "#4B5563", "#7C3AED"];

const rangeOptions = ["This Month", "This Week", "This Year", "All Time", "Custom Range"];

const getStartOfWeek = (d) => {
  const date = new Date(d);
  const day = date.getDay(); // 0 (Sun) - 6
  const diff = (day === 0 ? -6 : 1 - day); // Monday start
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(date.getDate() + diff);
  return monday;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1, 0, 0, 0, 0);
const endOfYear = (d) => new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const endOfDay = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [range, setRange] = useState("This Month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const token = localStorage.getItem("token");

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
        // normalize dates
        const normalized = (res.data || []).map((t) => ({
          ...t,
          dateObj: t.date ? new Date(t.date) : new Date(t.createdAt || Date.now()),
          amountNum: Number(t.amount) || 0,
        }));
        setTransactions(normalized);
      } catch (err) {
        console.error("Reports fetch error:", err);
        setError(err.response?.data?.message || "Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTxns();
  }, [token]);

  // compute date window based on range
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

  // Filtered transactions within the window
  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      const d = t.dateObj;
      return d >= fromDate && d <= toDate;
    });
  }, [transactions, fromDate, toDate]);

  // Aggregations
  const { totalSpent, avgPerDay, txnCount, pieData, lineData, barData } = useMemo(() => {
    // total spent (sum absolute of negative amounts)
    let total = 0;
    const byCategory = {};
    const byDate = {}; // date string -> sum
    const byMethod = {};

    filteredTxns.forEach((t) => {
      const amt = Number(t.amountNum || t.amount || 0);
      // treat negative as expense; positive as income
      const expense = amt < 0 ? Math.abs(amt) : 0;
      total += expense;

      // category
      const cat = t.category || "Uncategorized";
      byCategory[cat] = (byCategory[cat] || 0) + expense;

      // date grouping by ISO date (yyyy-mm-dd)
      const key = t.dateObj.toISOString().split("T")[0];
      byDate[key] = (byDate[key] || 0) + expense;

      // method
      const m = t.method || "Unknown";
      byMethod[m] = (byMethod[m] || 0) + expense;
    });

    // pie data
    const pie = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

    // line data (sorted by date ascending)
    const sortedDates = Object.keys(byDate).sort((a, b) => new Date(a) - new Date(b));
    const line = sortedDates.map((date) => ({ date, value: Number(byDate[date].toFixed(2)) }));

    // bar data
    const bar = Object.entries(byMethod).map(([method, total]) => ({ method, total: Number(total.toFixed(2)) }));

    // average per day
    const daysDiff = Math.max(1, Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)));
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

  // Export CSV
  const exportCSV = () => {
    if (filteredTxns.length === 0) {
      alert("No transactions to export for the selected range.");
      return;
    }
    const header = ["Date", "Category", "Method", "Amount", "Currency", "Notes"];
    const rows = filteredTxns.map((t) => [
      t.dateObj.toISOString().split("T")[0],
      `"${(t.category || "").replace(/"/g, '""')}"`,
      t.method || "",
      t.amountNum,
      t.currency || "₹",
      `"${(t.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${range.replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Responsive: For small screens show stacked layout
  return (
    <div style={{ padding: "20px" }}>
      <h2 className="mb-3">📊 Reports & Analytics</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: 220 }}>
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          {/* Filters + Export */}
          <Row className="align-items-center mb-3">
            <Col xs={12} md={6} className="mb-2">
              <Dropdown as={ButtonGroup}>
                <Button variant="outline-secondary">{range}</Button>
                <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic" />
                <Dropdown.Menu>
                  {rangeOptions.map((opt) => (
                    <Dropdown.Item
                      key={opt}
                      active={opt === range}
                      onClick={() => setRange(opt)}
                    >
                      {opt}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {range === "Custom Range" && (
                <div className="d-flex gap-2 mt-2">
                  <InputGroup>
                    <InputGroup.Text>From</InputGroup.Text>
                    <Form.Control
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroup.Text>To</InputGroup.Text>
                    <Form.Control
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                    />
                  </InputGroup>
                </div>
              )}
            </Col>

            <Col xs={12} md={6} className="text-md-end">
              <Button variant="outline-primary" className="me-2" onClick={exportCSV}>
                Export CSV
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // quick refresh
                  setLoading(true);
                  axios
                    .get("http://localhost:5000/api/transactions", {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((res) => {
                      const normalized = (res.data || []).map((t) => ({
                        ...t,
                        dateObj: t.date ? new Date(t.date) : new Date(t.createdAt || Date.now()),
                        amountNum: Number(t.amount) || 0,
                      }));
                      setTransactions(normalized);
                    })
                    .catch((err) => setError("Failed to refresh"))
                    .finally(() => setLoading(false));
                }}
              >
                Refresh
              </Button>
            </Col>
          </Row>

          {/* Summary Cards */}
          <Row className="mb-4 g-3">
            <Col xs={12} md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Total Spent</Card.Title>
                  <Card.Text style={{ fontSize: 24, fontWeight: 700 }}>₹{totalSpent.toLocaleString("en-IN")}</Card.Text>
                  <Card.Subtitle className="text-muted">From {fromDate.toISOString().split("T")[0]} to {toDate.toISOString().split("T")[0]}</Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>Average / day</Card.Title>
                  <Card.Text style={{ fontSize: 24, fontWeight: 700 }}>₹{avgPerDay.toLocaleString("en-IN")}</Card.Text>
                  <Card.Subtitle className="text-muted">Calculated over selected range</Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title># Transactions</Card.Title>
                  <Card.Text style={{ fontSize: 24, fontWeight: 700 }}>{txnCount}</Card.Text>
                  <Card.Subtitle className="text-muted">Transactions in selected range</Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row className="g-3">
            {/* Pie chart */}
            <Col xs={12} lg={6}>
              <Card className="p-3 h-100">
                <h5 className="mb-3">Spending by Category</h5>
                {pieData.length === 0 ? (
                  <div className="text-center text-muted">No spending data for this range.</div>
                ) : (
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ReTooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </Col>

            {/* Line chart */}
            <Col xs={12} lg={6}>
              <Card className="p-3 h-100">
                <h5 className="mb-3">Spending Over Time</h5>
                {lineData.length === 0 ? (
                  <div className="text-center text-muted">No data to plot for selected range.</div>
                ) : (
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ReTooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </Col>

            {/* Bar chart full width */}
            <Col xs={12}>
              <Card className="p-3">
                <h5 className="mb-3">Payment Method Breakdown</h5>
                {barData.length === 0 ? (
                  <div className="text-center text-muted">No payment method data for selected range.</div>
                ) : (
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="method" />
                        <YAxis />
                        <ReTooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />
                        <Legend />
                        <Bar dataKey="total" fill="#82ca9d" barSize={60} />
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
