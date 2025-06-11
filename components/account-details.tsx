"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Building2, Plus, CreditCard, Banknote, TrendingUp, TrendingDown } from "lucide-react"
import type { Account, Movement, Credit, Loan } from "@/types/bank"
import { formatCurrency } from "@/lib/utils"

interface AccountDetailsProps {
  account: Account
  onBack: () => void
  onUpdateAccount: (account: Account) => void
}

export default function AccountDetails({ account, onBack, onUpdateAccount }: AccountDetailsProps) {
  const [newMovement, setNewMovement] = useState({
    type: "deposit" as "deposit" | "withdrawal",
    amount: "",
    description: "",
  })
  const [newCredit, setNewCredit] = useState({
    amount: "",
    limit: "",
    interestRate: "",
  })
  const [newLoan, setNewLoan] = useState({
    amount: "",
    interestRate: "",
    term: "",
  })

  const handleAddMovement = () => {
    if (!newMovement.amount || !newMovement.description) return

    const amount = Number.parseFloat(newMovement.amount)
    const newBalance = newMovement.type === "deposit" ? account.balance + amount : account.balance - amount

    if (newBalance < 0) {
      alert("Balance insuficiente para realizar el retiro")
      return
    }

    const movement: Movement = {
      id: Date.now().toString(),
      type: newMovement.type,
      amount,
      description: newMovement.description,
      date: new Date().toISOString(),
      balance: newBalance,
    }

    const updatedAccount = {
      ...account,
      balance: newBalance,
      movements: [...account.movements, movement],
    }

    onUpdateAccount(updatedAccount)
    setNewMovement({ type: "deposit", amount: "", description: "" })
  }

  const handleAddCredit = () => {
    if (!newCredit.amount || !newCredit.limit || !newCredit.interestRate) return

    const credit: Credit = {
      id: Date.now().toString(),
      amount: Number.parseFloat(newCredit.amount),
      limit: Number.parseFloat(newCredit.limit),
      interestRate: Number.parseFloat(newCredit.interestRate),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
    }

    const updatedAccount = {
      ...account,
      credits: [...account.credits, credit],
    }

    onUpdateAccount(updatedAccount)
    setNewCredit({ amount: "", limit: "", interestRate: "" })
  }

  const handleAddLoan = () => {
    if (!newLoan.amount || !newLoan.interestRate || !newLoan.term) return

    const amount = Number.parseFloat(newLoan.amount)
    const rate = Number.parseFloat(newLoan.interestRate) / 100 / 12
    const term = Number.parseInt(newLoan.term)
    const monthlyPayment = (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

    const loan: Loan = {
      id: Date.now().toString(),
      amount,
      interestRate: Number.parseFloat(newLoan.interestRate),
      term,
      monthlyPayment,
      remainingBalance: amount,
      status: "active",
      startDate: new Date().toISOString(),
    }

    const updatedAccount = {
      ...account,
      loans: [...account.loans, loan],
    }

    onUpdateAccount(updatedAccount)
    setNewLoan({ amount: "", interestRate: "", term: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-red-600">Bank of America</h1>
                <p className="text-sm text-gray-600">Detalles de Cuenta</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{account.fullName}</span>
              <Badge variant="secondary">Usuario</Badge>
            </CardTitle>
            <CardDescription>
              Cuenta: {account.accountNumber} | Email: {account.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Balance Actual</p>
                <p className="text-2xl font-bold text-black">{formatCurrency(account.balance)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Movimientos</p>
                <p className="text-2xl font-bold text-black">{account.movements.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Créditos</p>
                <p className="text-2xl font-bold text-black">{account.credits.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Préstamos</p>
                <p className="text-2xl font-bold text-black">{account.loans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="movements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="movements">Movimientos</TabsTrigger>
            <TabsTrigger value="credits">Créditos</TabsTrigger>
            <TabsTrigger value="loans">Préstamos</TabsTrigger>
            <TabsTrigger value="actions">Acciones</TabsTrigger>
          </TabsList>

          <TabsContent value="movements">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Movimientos</CardTitle>
                <CardDescription>Todos los movimientos de la cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {account.movements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {movement.type === "deposit" ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">{movement.description}</p>
                          <p className="text-sm text-gray-600">{new Date(movement.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">
                          {movement.type === "deposit" ? "+" : "-"}
                          {formatCurrency(Math.abs(movement.amount))}
                        </p>
                        <p className="text-sm text-gray-600">
                          Balance: <span className="text-black">{formatCurrency(movement.balance)}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                  {account.movements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay movimientos registrados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle>Créditos</CardTitle>
                <CardDescription>Créditos asignados a la cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {account.credits.map((credit) => (
                    <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">
                            Crédito <span className="text-black">{formatCurrency(credit.amount)}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Límite: <span className="text-black">{formatCurrency(credit.limit)}</span> | Tasa:{" "}
                            {credit.interestRate}%
                          </p>
                        </div>
                      </div>
                      <Badge variant={credit.status === "active" ? "default" : "secondary"}>
                        {credit.status === "active" ? "Activo" : credit.status}
                      </Badge>
                    </div>
                  ))}
                  {account.credits.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay créditos asignados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Préstamos</CardTitle>
                <CardDescription>Préstamos asignados a la cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {account.loans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Banknote className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium">
                            Préstamo <span className="text-black">{formatCurrency(loan.amount)}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Cuota mensual: <span className="text-black">{formatCurrency(loan.monthlyPayment)}</span> |
                            Plazo: {loan.term} meses
                          </p>
                          <p className="text-sm text-gray-600">
                            Saldo restante: <span className="text-black">{formatCurrency(loan.remainingBalance)}</span>
                          </p>
                        </div>
                      </div>
                      <Badge variant={loan.status === "active" ? "default" : "secondary"}>
                        {loan.status === "active" ? "Activo" : loan.status}
                      </Badge>
                    </div>
                  ))}
                  {account.loans.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay préstamos asignados</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            {/* Add Movement */}
            <Card>
              <CardHeader>
                <CardTitle>Agregar Movimiento</CardTitle>
                <CardDescription>Registrar depósito o retiro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <select
                      className="w-full p-2 border rounded"
                      value={newMovement.type}
                      onChange={(e) =>
                        setNewMovement((prev) => ({ ...prev, type: e.target.value as "deposit" | "withdrawal" }))
                      }
                    >
                      <option value="deposit">Depósito</option>
                      <option value="withdrawal">Retiro</option>
                    </select>
                  </div>
                  <div>
                    <Label>Monto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newMovement.amount}
                      onChange={(e) => setNewMovement((prev) => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <Input
                      value={newMovement.description}
                      onChange={(e) => setNewMovement((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddMovement} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Credit */}
            <Card>
              <CardHeader>
                <CardTitle>Asignar Crédito</CardTitle>
                <CardDescription>Crear nuevo crédito para la cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Monto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newCredit.amount}
                      onChange={(e) => setNewCredit((prev) => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Límite</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newCredit.limit}
                      onChange={(e) => setNewCredit((prev) => ({ ...prev, limit: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Tasa de Interés (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newCredit.interestRate}
                      onChange={(e) => setNewCredit((prev) => ({ ...prev, interestRate: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddCredit} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Asignar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Loan */}
            <Card>
              <CardHeader>
                <CardTitle>Asignar Préstamo</CardTitle>
                <CardDescription>Crear nuevo préstamo para la cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Monto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newLoan.amount}
                      onChange={(e) => setNewLoan((prev) => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Tasa de Interés (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newLoan.interestRate}
                      onChange={(e) => setNewLoan((prev) => ({ ...prev, interestRate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Plazo (meses)</Label>
                    <Input
                      type="number"
                      value={newLoan.term}
                      onChange={(e) => setNewLoan((prev) => ({ ...prev, term: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddLoan} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Asignar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
