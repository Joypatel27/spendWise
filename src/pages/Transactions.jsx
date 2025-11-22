
// src/pages/Transactions.jsx
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Spinner, Dropdown } from "react-bootstrap";
import axios from "axios";
import { useData } from "../context/DataContext";
import "./Transactions.css"; // <-- import the CSS below

const categories = [
  { name: "Groceries", icon: "🛒" },
  { name: "Restaurant, Fast Food", icon: "🍔" },
  { name: "Bar, Cafe", icon: "🍷" },
  { name: "Food & Drinks", icon: "🍽️" },
  { name: "Housing", icon: "🏠" },
  { name: "Transportation", icon: "🚗" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Investments", icon: "📈" },
];

const Transactions = () => {
  const { transactions, accounts, fetchTransactions, fetchAccounts, refreshAll, loading } = useData();

  const [show, setShow] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [currency, setCurrency] = useState("₹");
  const [category, setCategory] = useState(categories[0].name);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const today = new Date().toISOString().split("T")[0];

  const [loadingTxns, setLoadingTxns] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(""); // account id or ""
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!transactions.length) fetchTransactions();
    if (!accounts.length) fetchAccounts();
    // eslint-disable-next-line
  }, []);

  // helpers
  const getIcon = (catName) => categories.find((c) => c.name === catName)?.icon || "❓";
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  // group by date string (use txn.date if present else createdAt)
  const grouped = (transactions || []).reduce((acc, txn) => {
    const key = txn.date ? txn.date.split("T")[0] : (txn.createdAt ? txn.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]);
    if (!acc[key]) acc[key] = [];
    acc[key].push(txn);
    return acc;
  }, {});

  const openAdd = () => {
    setEditingTxn(null);
    setAmount("");
    setCategory(categories[0].name);
    setMethod("Cash");
    setCurrency("₹");
    setDate(today);
    setSelectedAccount(accounts && accounts.length ? accounts[0]._id : "");
    setShow(true);
  };

  const openEdit = (txn) => {
    setEditingTxn(txn);
    setAmount(Math.abs(Number(txn.amount || 0))); // show positive value in input
    setCategory(txn.category);
    setMethod(txn.method);
    setCurrency(txn.currency || "₹");
    setDate(txn.date ? txn.date.split("T")[0] : today);
    setSelectedAccount(txn.account ? (txn.account._id || txn.account) : "");
    setShow(true);
  };

  const handleAddOrUpdate = async () => {
    if (!amount) {
      alert("Enter amount!");
      return;
    }

    const amt = -Math.abs(Number(amount)); // expense
    const payload = {
      category,
      method,
      amount: amt,
      currency,
      date,
      account: selectedAccount || null,
    };

    try {
      if (editingTxn) {
        await axios.put(`http://localhost:5000/api/transactions/${editingTxn._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/transactions", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await refreshAll();
      setShow(false);
      setEditingTxn(null);
    } catch (err) {
      console.error("Add/Update txn error:", err);
      alert(err.response?.data?.message || "Transaction operation failed");
    }
  };

  const handleDelete = async (txnId) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${txnId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await refreshAll();
    } catch (err) {
      console.error("Delete txn error:", err);
      alert("Delete failed");
    }
  };

  if (loading.transactions || loading.accounts || loadingTxns || loadingAccounts) {
    return (
      <div style={{ padding: "20px" }}>
        <Spinner />
      </div>
    );
  }

  // sort date keys descending
  const dateKeys = Object.keys(grouped).sort((a,b)=> new Date(b) - new Date(a));

  return (
   
<div style={{ padding: "20px" }}>
  {/* Responsive header: column on mobile, row on bigger screens */}
  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3">
    <h2 className="mb-2 mb-sm-0">Transactions</h2>

    <Button
      variant="primary"
      onClick={openAdd}
      className="mt-1 mt-sm-0"
      style={{
        width: "100%",      // full width on very small screens
        maxWidth: "220px",  // normal sized button on tablets/desktop
        alignSelf: "flex-start",
      }}
    >
      + Add Transaction
    </Button>
  </div>

      <div>
        {dateKeys.map(dateKey => {
          const totalForDay = grouped[dateKey].reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
          return (
            <div key={dateKey} className="day-block">
              <div className="day-header d-flex align-items-center justify-content-between">
                <h6 className="mb-0">{formatDate(dateKey)}</h6>
                <span className={`day-total ${totalForDay < 0 ? "negative" : "positive"}`}>
                  {totalForDay < 0 ? "- " : "+ "}₹{Math.abs(totalForDay).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="day-list">
                {grouped[dateKey].map(txn => (
                  <div key={txn._id} className="txn-item">
                    <div className="txn-left">
                      <div className="txn-icon">{getIcon(txn.category)}</div>
                      <div className="txn-meta">
                        <div className="txn-title">{txn.category}</div>
                        <div className="txn-sub small text-muted">{txn.method} • {txn.account?.name || "No account selected"}</div>
                      </div>
                    </div>

                    <div className="txn-right">
                      <div className={`txn-amount ${txn.amount < 0 ? "amt-negative" : "amt-positive"}`}>
                        {txn.amount < 0 ? "- " : "+ "}{txn.currency || "₹"}{Math.abs(txn.amount).toLocaleString("en-IN")}
                      </div>

                      <div className="txn-actions">
                        {/* On small screens collapse into a small dropdown to save space */}
                        <div className="actions-large">
                          <Button size="sm" variant="outline-secondary" onClick={() => openEdit(txn)}>Edit</Button>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(txn._id)}>Delete</Button>
                        </div>

                        <div className="actions-small">
                          <Dropdown align="end">
                            <Dropdown.Toggle size="sm" variant="light" id="txn-actions-dd">⋮</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => openEdit(txn)}>Edit</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDelete(txn._id)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingTxn ? "Edit Transaction" : "Add Transaction"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount (positive number)" />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c,i) => <option key={i} value={c.name}>{c.icon} {c.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Account</Form.Label>
              {loadingAccounts ? <Spinner size="sm" /> : (
                <Form.Select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                  <option value="">-- No account --</option>
                  {accounts.map(acc => <option key={acc._id} value={acc._id}>{acc.name} ({acc.type}) — ₹{Number(acc.balance).toLocaleString("en-IN")}</option>)}
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Currency</Form.Label>
              <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="₹">INR ₹</option>
                <option value="$">USD $</option>
                <option value="€">EUR €</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} max={today} />
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" className="me-2" onClick={() => setShow(false)}>Cancel</Button>
              <Button variant="success" onClick={handleAddOrUpdate}>{editingTxn ? "Save" : "Add"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Transactions;
