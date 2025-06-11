"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Receipt, CheckCircle, Search, Lightbulb, Wifi } from "lucide-react"
import type { User, Account, Movement } from "@/types/bank"

interface PaymentServiceProps {
  currentUser: User
  accounts: Account[]
  onUpdateAccounts: (accounts: Account[]) => void
  onBack: () => void
}

export default function PaymentService({ currentUser, accounts, onUpdateAccounts, onBack }: PaymentServiceProps) {
  const [activeTab, setActiveTab] = useState("services")
  const [formData, setFormData] = useState({
    serviceType: "",
    serviceProvider: "",
    accountNumber: "",
    amount: "",
    reference: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const serviceTypes = [
    { id: "electricity", name: "Electricidad", icon: Lightbulb },
    { id: "water", name: "Agua", icon: Wifi },
    { id: "internet", name: "Internet", icon: Wifi },
    { id: "phone", name: "Teléfono", icon: Wifi },
    { id: "cable", name: "Cable TV", icon: Wifi },
  ]

  const serviceProviders = {
    electricity: [
      { id: "edison", name: "Edison Electric" },
      { id: "power", name: "Power Company" },
      { id: "energy", name: "Energy Services" },
    ],
    water: [
      { id: "aqua", name: "Aqua Services" },
      { id: "citywater", name: "City Water" },
      { id: "h2o", name: "H2O Utilities" },
    ],
    internet: [
      { id: "comcast", name: "Comcast" },
      { id: "att", name: "AT&T" },
      { id: "verizon", name: "Verizon" },
    ],
    phone: [
      { id: "tmobile", name: "T-Mobile" },
      { id: "sprint", name: "Sprint" },
      { id: "att", name: "AT&T" },
    ],
    cable: [
      { id: "directv", name: "DirecTV" },
      { id: "dish", name: "Dish Network" },
      { id: "spectrum", name: "Spectrum" },
    ],
  }

  const handleSearch = async () => {
    if (!formData.serviceType || !formData.serviceProvider || !formData.accountNumber) {
      setError("Por favor complete todos los campos de búsqueda")
      return
    }

    setSearching(true)
    setError("")
    setSearchResults([])

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock search results
    const mockBill = {
      id: `bill_${Date.now()}`,
      serviceType: formData.serviceType,
      serviceProvider: formData.serviceProvider,
      accountNumber: formData.accountNumber,
      amount: Math.floor(Math.random() * 200) + 50,
      dueDate: new Date(Date.now() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
    }

    setSearchResults([mockBill])
    setFormData((prev) => ({ ...prev, amount: mockBill.amount.toString() }))
    setSearching(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (activeTab === "services") {
      if (!formData.serviceType || !formData.serviceProvider || !formData.accountNumber || !formData.amount) {
        setError("Todos los campos son obligatorios")
        setLoading(false)
        return
      }
    } else if (activeTab === "cards") {
      if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvv || !formData.amount) {
        setError("Todos los campos son obligatorios")
        setLoading(false)
        return
      }

      if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
        setError("El número de tarjeta debe tener 16 dígitos")
        setLoading(false)
        return
      }

      if (formData.cardCvv.length < 3) {
        setError("El CVV debe tener al menos 3 dígitos")
        setLoading(false)
        return
      }
    }

    const amount = Number.parseFloat(formData.amount)
    if (amount <= 0) {
      setError("El monto debe ser mayor a cero")
      setLoading(false)
      return
    }

    if (amount > currentUser.balance) {
      setError("Saldo insuficiente para realizar el pago")
      setLoading(false)
      return
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create movement
    const paymentId = Date.now().toString()
    const currentDate = new Date().toISOString()

    let description = ""
    if (activeTab === "services") {
      const providerName =
        serviceProviders[formData.serviceType as keyof typeof serviceProviders]?.find(
          (p) => p.id === formData.serviceProvider,
        )?.name || formData.serviceProvider
      description = `Pago de ${
        serviceTypes.find((s) => s.id === formData.serviceType)?.name || formData.serviceType
      } - ${providerName} - Cuenta: ${formData.accountNumber}`
    } else {
      description = `Pago a tarjeta terminada en ${formData.cardNumber.slice(-4)}`
    }

    const paymentMovement: Movement = {
      id: paymentId,
      type: "withdrawal",
      amount: amount,
      description,
      date: currentDate,
      balance: currentUser.balance - amount,
    }

    // Update accounts
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === currentUser.id) {
        return {
          ...acc,
          balance: acc.balance - amount,
          movements: [...acc.movements, paymentMovement],
        }
      }
      return acc
    })

    onUpdateAccounts(updatedAccounts)
    setPaymentCompleted(true)
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    handleInputChange("cardNumber", formatted)
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
                <p className="text-sm text-gray-600">Pagos de Servicios</p>
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
              <Receipt className="h-5 w-5 mr-2" />
              Pagos
            </CardTitle>
            <CardDescription>Pague sus servicios y facturas de forma rápida y segura</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentCompleted ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">¡Pago Exitoso!</h3>
                <p className="text-gray-600 mb-2">
                  Se ha realizado un pago por ${Number.parseFloat(formData.amount).toLocaleString()}
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-1">Número de confirmación:</p>
                  <p className="text-xl font-bold tracking-widest">{Date.now().toString().slice(-8)}</p>
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="services">Servicios</TabsTrigger>
                    <TabsTrigger value="cards">Tarjetas</TabsTrigger>
                  </TabsList>

                  <TabsContent value="services">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="serviceType">Tipo de Servicio</Label>
                            <Select
                              value={formData.serviceType}
                              onValueChange={(value) => {
                                handleInputChange("serviceType", value)
                                handleInputChange("serviceProvider", "")
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {serviceTypes.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="serviceProvider">Proveedor</Label>
                            <Select
                              value={formData.serviceProvider}
                              onValueChange={(value) => handleInputChange("serviceProvider", value)}
                              disabled={!formData.serviceType}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {formData.serviceType &&
                                  serviceProviders[formData.serviceType as keyof typeof serviceProviders]?.map(
                                    (provider) => (
                                      <SelectItem key={provider.id} value={provider.id}>
                                        {provider.name}
                                      </SelectItem>
                                    ),
                                  )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="accountNumber">Número de Cuenta</Label>
                            <Input
                              id="accountNumber"
                              placeholder="Ingrese el número de cuenta"
                              value={formData.accountNumber}
                              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={handleSearch}
                            disabled={
                              searching || !formData.serviceType || !formData.serviceProvider || !formData.accountNumber
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {searching ? (
                              "Buscando..."
                            ) : (
                              <>
                                <Search className="h-4 w-4 mr-2" />
                                Buscar Factura
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {searchResults.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-medium">Facturas Encontradas</h3>
                          {searchResults.map((bill) => (
                            <div key={bill.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <p className="font-medium">
                                    {serviceTypes.find((s) => s.id === bill.serviceType)?.name || bill.serviceType} -{" "}
                                    {serviceProviders[bill.serviceType as keyof typeof serviceProviders]?.find(
                                      (p) => p.id === bill.serviceProvider,
                                    )?.name || bill.serviceProvider}
                                  </p>
                                  <p className="text-sm text-gray-600">Cuenta: {bill.accountNumber}</p>
                                  <p className="text-sm text-gray-600">Vencimiento: {bill.dueDate}</p>
                                </div>
                                <p className="font-bold">${bill.amount.toLocaleString()}</p>
                              </div>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="reference">Referencia (opcional)</Label>
                                  <Input
                                    id="reference"
                                    placeholder="Número de referencia o comentario"
                                    value={formData.reference}
                                    onChange={(e) => handleInputChange("reference", e.target.value)}
                                  />
                                </div>

                                {error && (
                                  <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                  </Alert>
                                )}

                                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                                  {loading ? "Procesando pago..." : "Pagar Factura"}
                                </Button>
                              </form>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.length === 0 && !searching && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Busque una factura para continuar con el pago</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="cards">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                          <Input
                            id="cardName"
                            placeholder="Nombre como aparece en la tarjeta"
                            value={formData.cardName}
                            onChange={(e) => handleInputChange("cardName", e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Fecha de Expiración (MM/AA)</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/AA"
                              value={formData.cardExpiry}
                              onChange={(e) => handleInputChange("cardExpiry", e.target.value)}
                              maxLength={5}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvv">CVV</Label>
                            <Input
                              id="cardCvv"
                              type="password"
                              placeholder="123"
                              value={formData.cardCvv}
                              onChange={(e) => handleInputChange("cardCvv", e.target.value)}
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Monto a Pagar</Label>
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

                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                          {loading ? "Procesando pago..." : "Realizar Pago"}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
