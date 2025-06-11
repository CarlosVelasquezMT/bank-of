"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Send } from "lucide-react"
import type { Account, User, Movement } from "@/types/bank"
import { formatCurrency } from "@/lib/utils"

interface TransferFormProps {
  currentUser: User
  accounts: Account[]
  onUpdateAccounts: (accounts: Account[]) => void
  onBack: () => void
}

export default function TransferForm({ currentUser, accounts, onUpdateAccounts, onBack }: TransferFormProps) {
  const [formData, setFormData] = useState({
    destinationAccount: "",
    amount: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const availableAccounts = accounts.filter((acc) => acc.role === "user" && acc.id !== currentUser.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.destinationAccount || !formData.amount || !formData.description) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }

    const amount = Number.parseFloat(formData.amount)
    if (amount <= 0) {
      setError("El monto debe ser mayor a cero")
      setLoading(false)
      return
    }

    if (amount > currentUser.balance) {
      setError("Saldo insuficiente para realizar la transferencia")
      setLoading(false)
      return
    }

    const destinationAccount = accounts.find((acc) => acc.accountNumber === formData.destinationAccount)
    if (!destinationAccount) {
      setError("Cuenta de destino no encontrada")
      setLoading(false)
      return
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create movements
    const transferId = Date.now().toString()
    const currentDate = new Date().toISOString()

    const senderMovement: Movement = {
      id: transferId + "_sender",
      type: "transfer",
      amount: -amount,
      description: `Transferencia a ${destinationAccount.fullName} - ${formData.description}`,
      date: currentDate,
      balance: currentUser.balance - amount,
    }

    const receiverMovement: Movement = {
      id: transferId + "_receiver",
      type: "transfer",
      amount: amount,
      description: `Transferencia de ${currentUser.fullName} - ${formData.description}`,
      date: currentDate,
      balance: destinationAccount.balance + amount,
    }

    // Update accounts
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === currentUser.id) {
        return {
          ...acc,
          balance: acc.balance - amount,
          movements: [...acc.movements, senderMovement],
        }
      }
      if (acc.id === destinationAccount.id) {
        return {
          ...acc,
          balance: acc.balance + amount,
          movements: [...acc.movements, receiverMovement],
        }
      }
      return acc
    })

    onUpdateAccounts(updatedAccounts)
    setSuccess(`Transferencia exitosa por ${formatCurrency(amount)} a ${destinationAccount.fullName}`)
    setFormData({ destinationAccount: "", amount: "", description: "" })
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
                <p className="text-sm text-gray-600">Transferir Dinero</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Transferir Dinero
            </CardTitle>
            <CardDescription>Envía dinero de forma segura a otras cuentas del banco</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Current Balance */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Tu saldo disponible</p>
              <p className="text-2xl font-bold text-black">{formatCurrency(currentUser.balance)}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destinationAccount">Cuenta de Destino</Label>
                <Select
                  value={formData.destinationAccount}
                  onValueChange={(value) => handleInputChange("destinationAccount", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.accountNumber}>
                        {account.fullName} - {account.accountNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto a Transferir</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={currentUser.balance}
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Input
                  id="description"
                  placeholder="Motivo de la transferencia"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription className="text-green-600">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Procesando transferencia..." : "Transferir Dinero"}
                </Button>
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
              </div>
            </form>

            {availableAccounts.length === 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">No hay otras cuentas disponibles para transferir dinero.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
