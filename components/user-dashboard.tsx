"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  LogOut,
  CreditCard,
  Banknote,
  TrendingUp,
  TrendingDown,
  QrCode,
  Send,
  Smartphone,
  FileText,
  Receipt,
  Shield,
  Award,
} from "lucide-react"
import type { Account as BankAccount, User } from "@/types/bank"
import { formatCurrency } from "@/lib/utils"
import TransferForm from "./transfer-form"
import QRPayment from "./qr-payment"
import RechargeService from "./recharge-service"
import PazYSalvoService from "./paz-y-salvo-service"
import CertificatesService from "./certificates-service"
import WithdrawService from "./withdraw-service"
import PaymentService from "./payment-service"

interface UserDashboardProps {
  currentUser: User
  accounts: BankAccount[]
  onUpdateAccounts: (accounts: BankAccount[]) => void
  onLogout: () => void
}

export default function UserDashboard({ currentUser, accounts, onUpdateAccounts, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showTransfer, setShowTransfer] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showRecharge, setShowRecharge] = useState(false)
  const [showPazYSalvo, setShowPazYSalvo] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const totalCredits = currentUser.credits.reduce((sum, credit) => sum + credit.amount, 0)
  const totalLoans = currentUser.loans.reduce((sum, loan) => sum + loan.remainingBalance, 0)
  const recentMovements = currentUser.movements.slice(-5).reverse()

  const news = [
    {
      id: "1",
      title: "Nueva función de pagos QR disponible",
      description: "Ahora puedes realizar pagos escaneando códigos QR de forma rápida y segura.",
      date: "2024-01-15",
      type: "feature",
    },
    {
      id: "2",
      title: "Tasas preferenciales para préstamos",
      description: "Aprovecha nuestras tasas especiales para préstamos personales este mes.",
      date: "2024-01-10",
      type: "promotion",
    },
    {
      id: "3",
      title: "Mantenimiento programado",
      description: "El sistema estará en mantenimiento el domingo de 2:00 AM a 4:00 AM.",
      date: "2024-01-08",
      type: "maintenance",
    },
  ]

  const services = [
    {
      icon: Send,
      name: "Transferir",
      description: "Envía dinero a otras cuentas",
      action: () => setShowTransfer(true),
    },
    {
      icon: Smartphone,
      name: "Recargas",
      description: "Recarga tu celular",
      action: () => setShowRecharge(true),
    },
    {
      icon: Shield,
      name: "Paz y Salvo",
      description: "Solicita certificados",
      action: () => setShowPazYSalvo(true),
    },
    {
      icon: FileText,
      name: "Certificados",
      description: "Descarga certificados",
      action: () => setShowCertificates(true),
    },
    {
      icon: Banknote,
      name: "Retirar sin Tarjeta",
      description: "Retira dinero sin tarjeta",
      action: () => setShowWithdraw(true),
    },
    {
      icon: Receipt,
      name: "Pagar",
      description: "Paga servicios y facturas",
      action: () => setShowPayment(true),
    },
  ]

  if (showTransfer) {
    return (
      <TransferForm
        currentUser={currentUser}
        accounts={accounts}
        onUpdateAccounts={onUpdateAccounts}
        onBack={() => setShowTransfer(false)}
      />
    )
  }

  if (showQR) {
    return <QRPayment currentUser={currentUser} onBack={() => setShowQR(false)} />
  }

  if (showRecharge) {

  }

  if (showPazYSalvo) {
    return <PazYSalvoService currentUser={currentUser} onBack={() => setShowPazYSalvo(false)} />
  }

  if (showCertificates) {
    return <CertificatesService currentUser={currentUser} onBack={() => setShowCertificates(false)} />
  }

  if (showWithdraw) {
    return <WithdrawService currentUser={currentUser} onBack={() => setShowWithdraw(false)} accounts={accounts} onUpdateAccounts={onUpdateAccounts} />
  }
  if (showPayment) {
    return <PaymentService currentUser={currentUser} accounts={accounts} onUpdateAccounts={onUpdateAccounts} onBack={() => setShowPayment(false)} />
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
                <p className="text-sm text-gray-600">Banca en Línea</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bienvenido, {currentUser.fullName}</span>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Inicio</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="news">Novedades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mi Cuenta Principal</span>
                  <Badge variant="default">Activa</Badge>
                </CardTitle>
                <CardDescription>Cuenta: {currentUser.accountNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Saldo Disponible</p>
                  <p className="text-4xl font-bold text-black mb-4">{formatCurrency(currentUser.balance)}</p>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={() => setShowTransfer(true)} className="bg-red-600 hover:bg-red-700">
                      <Send className="h-4 w-4 mr-2" />
                      Transferir
                    </Button>
                    <Button variant="outline" onClick={() => setShowQR(true)}>
                      <QrCode className="h-4 w-4 mr-2" />
                      Pago QR
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mis Créditos</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{formatCurrency(totalCredits)}</div>
                  <p className="text-xs text-muted-foreground">{currentUser.credits.length} crédito(s) activo(s)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Préstamos</CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{formatCurrency(totalLoans)}</div>
                  <p className="text-xs text-muted-foreground">{currentUser.loans.length} préstamo(s) activo(s)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Movimientos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{currentUser.movements.length}</div>
                  <p className="text-xs text-muted-foreground">Transacciones realizadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Movements */}
            <Card>
              <CardHeader>
                <CardTitle>Movimientos Recientes</CardTitle>
                <CardDescription>Últimas transacciones en tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMovements.map((movement) => (
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
                      </div>
                    </div>
                  ))}
                  {recentMovements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay movimientos recientes</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Credits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Mis Créditos
                  </CardTitle>
                  <CardDescription>Créditos disponibles y activos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentUser.credits.map((credit) => (
                      <div key={credit.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              Crédito <span className="text-black">{formatCurrency(credit.amount)}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Límite: <span className="text-black">{formatCurrency(credit.limit)}</span>
                            </p>
                          </div>
                          <Badge variant={credit.status === "active" ? "default" : "secondary"}>
                            {credit.status === "active" ? "Activo" : credit.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Tasa: {credit.interestRate}%</p>
                      </div>
                    ))}
                    {currentUser.credits.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No tienes créditos asignados</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Loans */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Banknote className="h-5 w-5 mr-2" />
                    Mis Préstamos
                  </CardTitle>
                  <CardDescription>Préstamos activos y pagos pendientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentUser.loans.map((loan) => (
                      <div key={loan.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              Préstamo <span className="text-black">{formatCurrency(loan.amount)}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Cuota: <span className="text-black">{formatCurrency(loan.monthlyPayment)}</span>
                            </p>
                          </div>
                          <Badge variant={loan.status === "active" ? "default" : "secondary"}>
                            {loan.status === "active" ? "Activo" : loan.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Saldo restante: <span className="text-black">{formatCurrency(loan.remainingBalance)}</span>
                        </p>
                        <p className="text-sm text-gray-600">Plazo: {loan.term} meses</p>
                      </div>
                    ))}
                    {currentUser.loans.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No tienes préstamos activos</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Balance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
                <CardDescription>Vista general de tus productos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Saldo Disponible</p>
                    <p className="text-2xl font-bold text-black">{formatCurrency(currentUser.balance)}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total en Créditos</p>
                    <p className="text-2xl font-bold text-black">{formatCurrency(totalCredits)}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Deuda en Préstamos</p>
                    <p className="text-2xl font-bold text-black">{formatCurrency(totalLoans)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Servicios Destacados</CardTitle>
                <CardDescription>Accede rápidamente a nuestros servicios más utilizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={service.action}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-red-100 rounded-full">
                          <service.icon className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="h-5 w-5 mr-2" />
                    Pago QR
                  </CardTitle>
                  <CardDescription>Realiza pagos escaneando códigos QR</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowQR(true)} className="w-full bg-red-600 hover:bg-red-700">
                    <QrCode className="h-4 w-4 mr-2" />
                    Abrir Escáner QR
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Transferir Ahora
                  </CardTitle>
                  <CardDescription>Envía dinero de forma rápida y segura</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowTransfer(true)} className="w-full bg-red-600 hover:bg-red-700">
                    <Send className="h-4 w-4 mr-2" />
                    Hacer Transferencia
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Novedades y Promociones
                </CardTitle>
                <CardDescription>Mantente al día con las últimas noticias y ofertas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {news.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge
                          variant={
                            item.type === "feature" ? "default" : item.type === "promotion" ? "secondary" : "outline"
                          }
                        >
                          {item.type === "feature"
                            ? "Nueva Función"
                            : item.type === "promotion"
                              ? "Promoción"
                              : "Mantenimiento"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Promotional Banner */}
            <Card className="bg-gradient-to-r from-red-600 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">¡Aprovecha nuestras promociones!</h3>
                    <p className="text-red-100">
                      Tasas preferenciales en préstamos y créditos especiales para clientes frecuentes.
                    </p>
                  </div>
                  <div className="text-right">
                    <Button variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
                      Ver Ofertas
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
