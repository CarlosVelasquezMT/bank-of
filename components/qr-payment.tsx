"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, QrCode, Camera } from "lucide-react"
import type { User } from "@/types/bank"

interface QRPaymentProps {
  currentUser: User
  onBack: () => void
}

export default function QRPayment({ currentUser, onBack }: QRPaymentProps) {
  const [showScanner, setShowScanner] = useState(false)
  const [showMyQR, setShowMyQR] = useState(false)

  const generateQRData = () => {
    return {
      accountNumber: currentUser.accountNumber,
      name: currentUser.fullName,
      bankCode: "BOA",
      timestamp: Date.now(),
    }
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
                <p className="text-sm text-gray-600">Pagos QR</p>
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
        <div className="space-y-6">
          {/* Balance Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Saldo Disponible</p>
                <p className="text-3xl font-bold text-green-600">${currentUser.balance.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* QR Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowScanner(true)}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-red-100 rounded-full">
                    <Camera className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <CardTitle>Escanear QR</CardTitle>
                <CardDescription>Escanea un código QR para realizar un pago</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowMyQR(true)}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <QrCode className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle>Mi Código QR</CardTitle>
                <CardDescription>Muestra tu código QR para recibir pagos</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Scanner View */}
          {showScanner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Escáner QR
                </CardTitle>
                <CardDescription>Apunta la cámara hacia el código QR para realizar el pago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Cámara QR</p>
                    <p className="text-sm text-gray-500">Función disponible próximamente</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowScanner(false)} className="w-full">
                  Cerrar Escáner
                </Button>
              </CardContent>
            </Card>
          )}

          {/* My QR View */}
          {showMyQR && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Mi Código QR
                </CardTitle>
                <CardDescription>Comparte este código para recibir pagos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <QrCode className="h-32 w-32 text-gray-800 mx-auto mb-4" />
                    <p className="text-sm font-medium">{currentUser.fullName}</p>
                    <p className="text-xs text-gray-600">{currentUser.accountNumber}</p>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">Comparte este código QR para que otros puedan enviarte dinero</p>
                  <Button variant="outline" onClick={() => setShowMyQR(false)} className="w-full">
                    Cerrar Código QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {!showScanner && !showMyQR && (
            <Card>
              <CardHeader>
                <CardTitle>¿Cómo usar los pagos QR?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Para pagar</p>
                      <p className="text-sm text-gray-600">
                        Usa "Escanear QR" para leer el código del comercio o persona
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Para recibir dinero</p>
                      <p className="text-sm text-gray-600">
                        Muestra "Mi Código QR" para que otros puedan enviarte dinero
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Seguridad</p>
                      <p className="text-sm text-gray-600">
                        Todas las transacciones QR son seguras y se procesan instantáneamente
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
