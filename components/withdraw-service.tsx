"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Banknote, CheckCircle } from "lucide-react"
import type { User, Account, Movement } from "@/types/bank"

interface WithdrawServiceProps {
  currentUser: User
  accounts: Account[]
  onUpdateAccounts: (accounts: Account[]) => void
  onBack: () => void
}

export default function WithdrawService({ currentUser, accounts, onUpdateAccounts, onBack }: WithdrawServiceProps) {
  const [formData, setFormData] = useState({
    amount: "",
    withdrawalMethod: "",
    recipientName: currentUser.fullName,
    recipientId: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [withdrawalCode, setWithdrawalCode] = useState("")
  const [withdrawalCompleted, setWithdrawalCompleted] = useState(false)

  const withdrawalMethods = [
    { id: "atm", name: "Cajero Automático" },
    { id: "branch", name: "Sucursal Bancaria" },
    { id: "agent", name: "Agente Bancario" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.amount || !formData.withdrawalMethod || !formData.recipientName || !formData.recipientId) {
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
      setError("Saldo insuficiente para realizar el retiro")
      setLoading(false)
      return
    }

    if (formData.recipientId.length < 6) {
      setError("El número de identificación debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate withdrawal code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setWithdrawalCode(code)

    // Create movement
    const withdrawalId = Date.now().toString()
    const currentDate = new Date().toISOString()

    const withdrawalMovement: Movement = {
      id: withdrawalId,
      type: "withdrawal",
      amount: amount,
      description: `Retiro sin tarjeta - Código: ${code}`,
      date: currentDate,
      balance: currentUser.balance - amount,
    }

    // Update accounts
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === currentUser.id) {
        return {
          ...acc,
          balance: acc.balance - amount,
          movements: [...acc.movements, withdrawalMovement],
        }
      }
      return acc
    })

    onUpdateAccounts(updatedAccounts)
    setWithdrawalCompleted(true)
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getMethodName = (methodId: string) => {
    return withdrawalMethods.find((method) => method.id === methodId)?.name || methodId
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
                <p className="text-sm text-gray-600">Retiro sin Tarjeta</p>
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
              <Banknote className="h-5 w-5 mr-2" />
              Retiro sin Tarjeta
            </CardTitle>
            <CardDescription>Genera un código para retirar dinero sin necesidad de tarjeta</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawalCompleted ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">¡Retiro Generado!</h3>
                <p className="text-gray-600 mb-2">Se ha generado un código de retiro para {formData.recipientName}</p>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-1">Código de retiro:</p>
                  <p className="text-3xl font-bold tracking-widest">{withdrawalCode}</p>
                </div>
                <div className="text-left mb-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="font-medium mb-2">Instrucciones:</p>
                  <ol className="list-decimal pl-5 space-y-1 text-sm">
                    <li>Diríjase a un {getMethodName(formData.withdrawalMethod)}.</li>
                    <li>Seleccione la opción "Retiro sin tarjeta" o "Código de retiro".</li>
                    <li>Ingrese el código de 6 dígitos mostrado arriba.</li>
                    <li>Presente su identificación ({formData.recipientId}).</li>
                    <li>Reciba su dinero (${Number.parseFloat(formData.amount).toLocaleString()}).</li>
                  </ol>
                </div>
                <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
                  Volver al Dashboard
                </Button>
              </div>
            ) : (
              <>
                {/* Current Balance */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tu saldo disponible</p>
                  <p className="text-2xl font-bold text-green-600">${currentUser.balance.toLocaleString()}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto a Retirar</Label>
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
                    <Label htmlFor="withdrawalMethod">Método de Retiro</Label>
                    <Select
                      value={formData.withdrawalMethod}
                      onValueChange={(value) => handleInputChange("withdrawalMethod", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona dónde retirar" />
                      </SelectTrigger>
                      <SelectContent>
                        {withdrawalMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Nombre del Beneficiario</Label>
                    <Input
                      id="recipientName"
                      placeholder="Nombre de quien retirará el dinero"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange("recipientName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientId">Número de Identificación</Label>
                    <Input
                      id="recipientId"
                      placeholder="Número de documento de identidad"
                      value={formData.recipientId}
                      onChange={(e) => handleInputChange("recipientId", e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={loading}>
                      {loading ? "Generando código..." : "Generar Código de Retiro"}
                    </Button>
                    <Button type="button" variant="outline" onClick={onBack}>
                      Cancelar
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-2">Información importante:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>El código de retiro es válido por 24 horas.</li>
                      <li>La persona que retira debe presentar una identificación válida.</li>
                      <li>El monto máximo por retiro es de $1,000.</li>
                    </ul>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
