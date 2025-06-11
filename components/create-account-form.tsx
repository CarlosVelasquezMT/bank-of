"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building2 } from "lucide-react"
import type { Account } from "@/types/bank"

interface CreateAccountFormProps {
  onCreateAccount: (account: Account) => void
  onCancel: () => void
  existingAccounts: Account[]
}

export default function CreateAccountForm({ onCreateAccount, onCancel, existingAccounts }: CreateAccountFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    initialBalance: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const generateAccountNumber = () => {
    const existingNumbers = existingAccounts.map((acc) => acc.accountNumber)
    let newNumber
    do {
      newNumber =
        "10" +
        Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, "0")
    } while (existingNumbers.includes(newNumber))
    return newNumber
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }

    if (existingAccounts.some((acc) => acc.email === formData.email)) {
      setError("Ya existe una cuenta con este email")
      setLoading(false)
      return
    }

    const initialBalance = Number.parseFloat(formData.initialBalance) || 0
    if (initialBalance < 0) {
      setError("El balance inicial no puede ser negativo")
      setLoading(false)
      return
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newAccount: Account = {
      id: Date.now().toString(),
      accountNumber: generateAccountNumber(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: "user",
      balance: initialBalance,
      movements:
        initialBalance > 0
          ? [
              {
                id: "1",
                type: "deposit",
                amount: initialBalance,
                description: "Depósito inicial",
                date: new Date().toISOString(),
                balance: initialBalance,
              },
            ]
          : [],
      credits: [],
      loans: [],
    }

    onCreateAccount(newAccount)
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
                <p className="text-sm text-gray-600">Crear Nueva Cuenta</p>
              </div>
            </div>
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Cuenta de Usuario</CardTitle>
            <CardDescription>Complete la información para crear una nueva cuenta bancaria</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Ingrese el nombre completo"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña para la cuenta"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance">Balance Inicial (Opcional)</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.initialBalance}
                  onChange={(e) => handleInputChange("initialBalance", e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
