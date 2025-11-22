
//quick sanity 
// src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// resolve base URL safely (Vite or CRA or fallback)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
  "http://localhost:5000";

axios.defaults.baseURL = API_BASE;

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState({
    budgets: false,
    transactions: false,
    accounts: false,
  });

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchBudgets = useCallback(async () => {
    setLoading((l) => ({ ...l, budgets: true }));
    try {
      const res = await axios.get("/api/budgets", { headers });
      setBudgets(res.data || []);
    } catch (err) {
      console.error("fetchBudgets error:", err);
    } finally {
      setLoading((l) => ({ ...l, budgets: false }));
    }
  }, [token]);

  const fetchTransactions = useCallback(async () => {
    setLoading((l) => ({ ...l, transactions: true }));
    try {
      const res = await axios.get("/api/transactions", { headers });
      setTransactions(res.data || []);
    } catch (err) {
      console.error("fetchTransactions error:", err);
    } finally {
      setLoading((l) => ({ ...l, transactions: false }));
    }
  }, [token]);

  const fetchAccounts = useCallback(async () => {
    setLoading((l) => ({ ...l, accounts: true }));
    try {
      const res = await axios.get("/api/accounts", { headers });
      setAccounts(res.data || []);
    } catch (err) {
      console.error("fetchAccounts error:", err);
    } finally {
      setLoading((l) => ({ ...l, accounts: false }));
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      await Promise.all([fetchBudgets(), fetchTransactions(), fetchAccounts()]);
    })();
  }, [token]);

  const refreshAll = async () => {
    await Promise.all([fetchBudgets(), fetchTransactions(), fetchAccounts()]);
  };

  return (
    <DataContext.Provider
      value={{
        budgets,
        transactions,
        accounts,
        loading,
        fetchBudgets,
        fetchTransactions,
        fetchAccounts,
        refreshAll,
        setBudgets,
        setTransactions,
        setAccounts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
