

// src/context/DataContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

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

  // keep axios Authorization header in sync
  useEffect(() => {
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete axios.defaults.headers.common.Authorization;
  }, [token]);

  // listen for auth changes (Login dispatches 'authChanged')
  useEffect(() => {
    const onAuthChanged = () => setToken(localStorage.getItem("token"));
    window.addEventListener("authChanged", onAuthChanged);
    return () => window.removeEventListener("authChanged", onAuthChanged);
  }, []);

  const fetchBudgets = useCallback(async () => {
    setLoading(l => ({ ...l, budgets: true }));
    try {
      const res = await axios.get("/api/budgets");
      setBudgets(res.data || []);
    } catch (err) {
      console.error("fetchBudgets error:", err);
      setBudgets([]);
    } finally {
      setLoading(l => ({ ...l, budgets: false }));
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(l => ({ ...l, transactions: true }));
    try {
      const res = await axios.get("/api/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("fetchTransactions error:", err);
      setTransactions([]);
    } finally {
      setLoading(l => ({ ...l, transactions: false }));
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    setLoading(l => ({ ...l, accounts: true }));
    try {
      const res = await axios.get("/api/accounts");
      setAccounts(res.data || []);
    } catch (err) {
      console.error("fetchAccounts error:", err);
      setAccounts([]);
    } finally {
      setLoading(l => ({ ...l, accounts: false }));
    }
  }, []);

  useEffect(() => {
    if (!token) {
      // clear data on logout
      setBudgets([]);
      setTransactions([]);
      setAccounts([]);
      return;
    }
    (async () => {
      await Promise.all([fetchBudgets(), fetchTransactions(), fetchAccounts()]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const refreshAll = async () => {
    await Promise.all([fetchBudgets(), fetchTransactions(), fetchAccounts()]);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    window.dispatchEvent(new Event("authChanged"));
  };

  return (
    <DataContext.Provider value={{
      token, setToken,
      budgets, transactions, accounts,
      loading,
      fetchBudgets, fetchTransactions, fetchAccounts,
      refreshAll,
      setBudgets, setTransactions, setAccounts,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};
