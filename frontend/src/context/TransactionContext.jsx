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

  // Sample data for demonstration
  const sampleTransactions = [
    {
      id: 1735934400000, // Unique timestamp ID
      tripId: 10245,
      origin: "South Bus Terminal",
      destination: "Naga",
      operator: "BTTS System",
      busClass: "Aircon",
      departure: "2025-01-10T08:30:00",
      status: "CONFIRMED",
      seatPosition: "2A",
      amountPaid: "₱200.00",
      paymentMethod: "GCash",
      paymentStatus: "Paid",
      paymentProof: "gcash_payment_screenshot.jpg",
      timestamp: "2025-01-03T10:30:00.000Z",
    },
    {
      id: 1735934460000,
      tripId: 10289,
      origin: "South Bus Terminal",
      destination: "San Fernando",
      operator: "BTTS System",
      busClass: "Ordinary",
      departure: "2025-01-12T14:15:00",
      status: "RESERVED",
      seatPosition: "1B",
      amountPaid: "₱175.00",
      paymentMethod: "InstaPay",
      paymentStatus: "Pending",
      timestamp: "2025-01-03T11:15:00.000Z",
    },
    {
      id: 1735934520000,
      tripId: 10334,
      origin: "South Bus Terminal",
      destination: "Oslob",
      operator: "BTTS System",
      busClass: "Aircon",
      departure: "2025-01-15T06:00:00",
      status: "CONFIRMED",
      seatPosition: "3C",
      amountPaid: "₱275.00",
      paymentMethod: "GCash",
      paymentStatus: "Paid",
      paymentProof: "gcash_receipt_001.jpg",
      timestamp: "2025-01-03T12:00:00.000Z",
    },
    {
      id: 1735934580000,
      tripId: 10378,
      origin: "South Bus Terminal",
      destination: "Badian",
      operator: "BTTS System",
      busClass: "Aircon",
      departure: "2025-01-08T16:30:00",
      status: "CONFIRMED",
      seatPosition: "4D",
      amountPaid: "₱250.00",
      paymentMethod: "InstaPay",
      paymentStatus: "Paid",
      paymentProof: "instapay_confirmation.png",
      timestamp: "2025-01-03T13:30:00.000Z",
    },
    {
      id: 1735934640000,
      tripId: 10423,
      origin: "South Bus Terminal",
      destination: "Toledo",
      operator: "BTTS System",
      busClass: "Ordinary",
      departure: "2025-01-20T11:00:00",
      status: "RESERVED",
      seatPosition: "5A",
      amountPaid: "₱225.00",
      paymentMethod: "GCash",
      paymentStatus: "Pending",
      timestamp: "2025-01-03T14:45:00.000Z",
    },
  ]

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("busTransactions")
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions)
      // If no saved transactions or empty, load sample data
      if (parsed.length === 0) {
        setTransactions(sampleTransactions)
      } else {
        setTransactions(parsed)
      }
    } else {
      // First time loading, use sample data
      setTransactions(sampleTransactions)
    }
  }, [])

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("busTransactions", JSON.stringify(transactions))
    }
  }, [transactions])

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple ID generation
      timestamp: new Date().toISOString(),
    }
    setTransactions((prev) => [...prev, newTransaction])
  }

  const updateTransaction = (id, updatedData) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedData, timestamp: new Date().toISOString() } : transaction,
      ),
    )
  }

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  const clearTransactions = () => {
    setTransactions([])
    localStorage.removeItem("busTransactions")
  }

  const resetToSampleData = () => {
    setTransactions(sampleTransactions)
    localStorage.setItem("busTransactions", JSON.stringify(sampleTransactions))
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearTransactions,
        resetToSampleData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
