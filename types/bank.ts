export interface Movement {
  id: string
  type: "deposit" | "withdrawal" | "transfer"
  amount: number
  description: string
  date: string
  balance: number
}

export interface Credit {
  id: string
  amount: number
  limit: number
  interestRate: number
  dueDate: string
  status: "active" | "paid" | "overdue"
}

export interface Loan {
  id: string
  amount: number
  interestRate: number
  term: number
  monthlyPayment: number
  remainingBalance: number
  status: "active" | "paid" | "defaulted"
  startDate: string
}

export interface Account {
  id: string
  accountNumber: string
  fullName: string
  email: string
  password: string
  role: "admin" | "user"
  balance: number
  movements: Movement[]
  credits: Credit[]
  loans: Loan[]
}

export interface User extends Account {
  name: string
}
