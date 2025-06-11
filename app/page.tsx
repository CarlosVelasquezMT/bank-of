"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import AdminDashboard from "@/components/admin-dashboard"
import UserDashboard from "@/components/user-dashboard"
import type { User, Account } from "@/types/bank"

const STORAGE_KEYS = {
  ACCOUNTS: "bank_accounts",
  CURRENT_USER: "bank_current_user",
}

const defaultAccounts: Account[] = [
  {
    id: "1",
    accountNumber: "1001234567",
    fullName: "Administrador Principal",
    email: "admin@bankofamerica.com",
    password: "admin123",
    role: "admin",
    balance: 0,
    movements: [],
    credits: [],
    loans: [],
  },
]

export default function BankOfAmericaApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      // Load accounts from localStorage
      const savedAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
      if (savedAccounts) {
        const parsedAccounts = JSON.parse(savedAccounts)
        setAccounts(parsedAccounts)
      } else {
        // If no saved accounts, save default accounts to localStorage
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(defaultAccounts))
      }

      // Load current user from localStorage
      const savedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      if (savedCurrentUser) {
        const parsedUser = JSON.parse(savedCurrentUser)
        setCurrentUser(parsedUser)
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      // If there's an error, use default data
      setAccounts(defaultAccounts)
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(defaultAccounts))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save accounts to localStorage whenever accounts change
  useEffect(() => {
    if (!isLoading && accounts.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
      } catch (error) {
        console.error("Error saving accounts to localStorage:", error)
      }
    }
  }, [accounts, isLoading])

  // Save current user to localStorage whenever currentUser changes
  useEffect(() => {
    if (!isLoading) {
      try {
        if (currentUser) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser))
        } else {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
        }
      } catch (error) {
        console.error("Error saving current user to localStorage:", error)
      }
    }
  }, [currentUser, isLoading])

  const handleLogin = (email: string, password: string) => {
    const user = accounts.find((acc) => acc.email === email && acc.password === password)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const updateAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts)
    // Update current user if it was modified
    if (currentUser) {
      const updatedCurrentUser = newAccounts.find((acc) => acc.id === currentUser.id)
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser)
      }
    }
  }

  // Show loading screen while data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-red-600">Bank of America</h2>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === "admin" ? (
        <AdminDashboard
          currentUser={currentUser}
          accounts={accounts}
          onUpdateAccounts={updateAccounts}
          onLogout={handleLogout}
        />
      ) : (
        <UserDashboard
          currentUser={currentUser}
          accounts={accounts}
          onUpdateAccounts={updateAccounts}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
