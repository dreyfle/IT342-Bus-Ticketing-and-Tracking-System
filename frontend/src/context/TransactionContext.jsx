"use client"

import { createContext, useContext, useState, useEffect } from "react"

const TransactionContext = createContext()

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("busTransactions")
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("busTransactions", JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple ID generation
      timestamp: new Date().toISOString(),
    }
    setTransactions((prev) => [...prev, newTransaction])
  }

  const clearTransactions = () => {
    setTransactions([])
    localStorage.removeItem("busTransactions")
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        clearTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
