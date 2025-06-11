"use client"

import type React from "react"
import { useState } from "react"

interface User {
  id: string
  name: string
  email: string
  balance: number
}

interface Account {
  id: string
  name: string
  balance: number
}

interface RechargeServiceProps {
  currentUser: User
  accounts: Account[]
  onUpdateAccounts: (accounts: Account[]) => void
  onBack: () => void
}

const RechargeService: React.FC<RechargeServiceProps> = ({ currentUser, accounts, onUpdateAccounts, onBack }) => {
  const [rechargeAmount, setRechargeAmount] = useState<number>(0)

  const handleRecharge = () => {
    if (rechargeAmount > 0) {
      const updatedAccounts = accounts.map((account) => ({
        ...account,
        balance: account.balance + rechargeAmount,
      }))

      onUpdateAccounts(updatedAccounts)
      alert(`Recharged ${rechargeAmount} to all accounts.`)
      onBack()
    } else {
      alert("Please enter a valid recharge amount.")
    }
  }

  return (
    <div>
      <h2>Recharge Service</h2>
      <p>Current User: {currentUser.name}</p>
      <div>
        <label htmlFor="rechargeAmount">Recharge Amount:</label>
        <input
          type="number"
          id="rechargeAmount"
          value={rechargeAmount}
          onChange={(e) => setRechargeAmount(Number(e.target.value))}
        />
      </div>
      <button onClick={handleRecharge}>Recharge Accounts</button>
      <button onClick={onBack}>Back to Dashboard</button>
    </div>
  )
}

export default RechargeService
