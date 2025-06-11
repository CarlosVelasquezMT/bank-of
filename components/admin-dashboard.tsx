"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, Plus, LogOut, Eye, Edit, Trash2, CreditCard, Banknote } from "lucide-react"
import type { Account, User } from "@/types/bank"
import { formatCurrency } from "@/lib/utils"
import CreateAccountForm from "./create-account-form"
import EditAccountForm from "./edit-account-form"
import AccountDetails from "./account-details"
import DataManagement from "./data-management"

interface AdminDashboardProps {
  currentUser: User
  accounts: Account[]
  onUpdateAccounts: (accounts: Account[]) => void
  onLogout: () => void
}

export default function AdminDashboard({ currentUser, accounts, onUpdateAccounts, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [viewingAccount, setViewingAccount] = useState<Account | null>(null)

  const userAccounts = accounts.filter((acc) => acc.role === "user")
  const totalBalance = userAccounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalCredits = userAccounts.reduce(
    (sum, acc) => sum + acc.credits.reduce((creditSum, credit) => creditSum + credit.amount, 0),
    0,
  )
  const totalLoans = userAccounts.reduce(
    (sum, acc) => sum + acc.loans.reduce((loanSum, loan) => loanSum + loan.remainingBalance, 0),
    0,
  )

  const handleDeleteAccount = (accountId: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta cuenta?")) {
      const updatedAccounts = accounts.filter((acc) => acc.id !== accountId)
      onUpdateAccounts(updatedAccounts)
    }
  }

  const handleCreateAccount = (newAccount: Account) => {
    onUpdateAccounts([...accounts, newAccount])
    setShowCreateForm(false)
  }

  const handleUpdateAccount = (updatedAccount: Account) => {
    const updatedAccounts = accounts.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc))
    onUpdateAccounts(updatedAccounts)
    setEditingAccount(null)
  }

  const handleClearData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleExportData = () => {
    // La función se maneja en el componente DataManagement
  }

  const handleImportData = (data: any) => {
    try {
      localStorage.setItem("bank_accounts", JSON.stringify(data))
      window.location.reload()
    } catch (error) {
      console.error("Error importing data:", error)
    }
  }

  if (showCreateForm) {
    return (
      <CreateAccountForm
        onCreateAccount={handleCreateAccount}
        onCancel={() => setShowCreateForm(false)}
        existingAccounts={accounts}
      />
    )
  }

  if (editingAccount) {
    return (
      <EditAccountForm
        account={editingAccount}
        onUpdateAccount={handleUpdateAccount}
        onCancel={() => setEditingAccount(null)}
      />
    )
  }

  if (viewingAccount) {
    return (
      <AccountDetails
        account={viewingAccount}
        onBack={() => setViewingAccount(null)}
        onUpdateAccount={handleUpdateAccount}
      />
    )
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
                <p className="text-sm text-gray-600">Panel de Administración</p>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="accounts">Gestión de Cuentas</TabsTrigger>
            <TabsTrigger value="data">Gestión de Datos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cuentas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{userAccounts.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{formatCurrency(totalBalance)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Créditos Activos</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{formatCurrency(totalCredits)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Préstamos Activos</CardTitle>
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{formatCurrency(totalLoans)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Cuentas Recientes</CardTitle>
                <CardDescription>Últimas cuentas creadas en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userAccounts.slice(-5).map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{account.fullName}</p>
                        <p className="text-sm text-gray-600">Cuenta: {account.accountNumber}</p>
                        <p className="text-sm text-gray-600">
                          Balance: <span className="text-black font-medium">{formatCurrency(account.balance)}</span>
                        </p>
                      </div>
                      <Badge variant="secondary">Usuario</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Cuentas</h2>
              <Button onClick={() => setShowCreateForm(true)} className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Nueva Cuenta
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Todas las Cuentas de Usuario</CardTitle>
                <CardDescription>Gestione todas las cuentas de usuario del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{account.fullName}</p>
                            <p className="text-sm text-gray-600">Cuenta: {account.accountNumber}</p>
                            <p className="text-sm text-gray-600">Email: {account.email}</p>
                            <p className="text-sm text-gray-600">Balance: {formatCurrency(account.balance)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setViewingAccount(account)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingAccount(account)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {userAccounts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No hay cuentas de usuario creadas aún.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataManagement
              onClearData={handleClearData}
              onExportData={handleExportData}
              onImportData={handleImportData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
