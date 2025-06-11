"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building2, Shield, CheckCircle } from "lucide-react"
import type { User } from "@/types/bank"

interface PazYSalvoServiceProps {
  currentUser: User
  onBack: () => void
}

export default function PazYSalvoService({ currentUser, onBack }: PazYSalvoServiceProps) {
  const [formData, setFormData] = useState({
    certificateType: "",
    deliveryEmail: currentUser.email,
    purpose: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)

  const certificateTypes = [
    { id: "account_status", name: "Estado de Cuenta" },
    { id: "no_debt", name: "Certificado de No Deuda" },
    { id: "credit_status", name: "Estado de Créditos" },
    { id: "loan_status", name: "Estado de Préstamos" },
    { id: "general", name: "Certificado General" },
  ]

  const purposes = [
    { id: "personal", name: "Uso Personal" },
    { id: "visa", name: "Trámite de Visa" },
    { id: "mortgage", name: "Hipoteca" },
    { id: "employment", name: "Empleo" },
    { id: "other", name: "Otro" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.certificateType || !formData.deliveryEmail || !formData.purpose) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }

    if (!formData.deliveryEmail.includes("@")) {
      setError("Por favor ingrese un email válido")
      setLoading(false)
      return
    }

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const certificateName =
      certificateTypes.find((type) => type.id === formData.certificateType)?.name || formData.certificateType

    setSuccess(
      `Solicitud de "${certificateName}" enviada correctamente. Recibirá el certificado en su correo ${formData.deliveryEmail} en las próximas 24 horas.`,
    )
    setRequestSubmitted(true)
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
                <p className="text-sm text-gray-600">Certificados de Paz y Salvo</p>
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
              <Shield className="h-5 w-5 mr-2" />
              Solicitud de Certificados
            </CardTitle>
            <CardDescription>Solicite certificados de paz y salvo y otros documentos bancarios</CardDescription>
          </CardHeader>
          <CardContent>
            {requestSubmitted ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">¡Solicitud Enviada!</h3>
                <p className="text-gray-600 mb-6">{success}</p>
                <Button onClick={onBack} className="bg-red-600 hover:bg-red-700">
                  Volver al Dashboard
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="certificateType">Tipo de Certificado</Label>
                  <Select
                    value={formData.certificateType}
                    onValueChange={(value) => handleInputChange("certificateType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo de certificado" />
                    </SelectTrigger>
                    <SelectContent>
                      {certificateTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryEmail">Email de Entrega</Label>
                  <Input
                    id="deliveryEmail"
                    type="email"
                    placeholder="Ingresa el email donde recibirás el certificado"
                    value={formData.deliveryEmail}
                    onChange={(e) => handleInputChange("deliveryEmail", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Propósito del Certificado</Label>
                  <Select value={formData.purpose} onValueChange={(value) => handleInputChange("purpose", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el propósito" />
                    </SelectTrigger>
                    <SelectContent>
                      {purposes.map((purpose) => (
                        <SelectItem key={purpose.id} value={purpose.id}>
                          {purpose.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={loading}>
                    {loading ? "Enviando solicitud..." : "Solicitar Certificado"}
                  </Button>
                  <Button type="button" variant="outline" onClick={onBack}>
                    Cancelar
                  </Button>
                </div>

                <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">Información importante:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Los certificados se enviarán al email proporcionado en un plazo de 24 horas hábiles.</li>
                    <li>Los certificados tienen validez de 30 días desde su emisión.</li>
                    <li>Este servicio no tiene costo adicional para clientes del banco.</li>
                  </ul>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
