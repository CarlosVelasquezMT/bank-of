"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const success = await onLogin(email, password)
      if (success) {
        router.push("/dashboard") // Cambia esta ruta si es necesario
      } else {
        setError("Credenciales incorrectas. Verifique su email y contraseña.")
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Intente nuevamente.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Bank of America</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder a su cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="su-email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>
              <strong>Credenciales de prueba:</strong>
            </p>
            <p>Admin: admin@bankofamerica.com / admin123</p>
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
              <p className="font-medium text-blue-800">💡 Datos persistentes</p>
              <p className="text-blue-700">
                Tus datos se guardan automáticamente y permanecen después de recargar la página
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
