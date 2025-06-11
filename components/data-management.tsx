"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Download, Upload, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface DataManagementProps {
  onClearData: () => void
  onExportData: () => void
  onImportData: (data: any) => void
}

export default function DataManagement({ onClearData, onExportData, onImportData }: DataManagementProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClearData = () => {
    if (showConfirm) {
      onClearData()
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
      setTimeout(() => setShowConfirm(false), 5000) // Auto-hide after 5 seconds
    }
  }

  const handleExportData = () => {
    try {
      const accounts = localStorage.getItem("bank_accounts")
      if (accounts) {
        const dataStr = JSON.stringify(JSON.parse(accounts), null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `bank_data_${new Date().toISOString().split("T")[0]}.json`
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error exporting data:", error)
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          onImportData(data)
        } catch (error) {
          console.error("Error importing data:", error)
          alert("Error al importar los datos. Verifique que el archivo sea válido.")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Gestión de Datos
        </CardTitle>
        <CardDescription>Administre los datos almacenados localmente en su navegador</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" onClick={handleExportData} className="flex items-center justify-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="w-full flex items-center justify-center">
              <Upload className="h-4 w-4 mr-2" />
              Importar Datos
            </Button>
          </div>

          <Button
            variant={showConfirm ? "destructive" : "outline"}
            onClick={handleClearData}
            className="flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {showConfirm ? "¿Confirmar?" : "Limpiar Datos"}
          </Button>
        </div>

        {showConfirm && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              ¿Está seguro de que desea eliminar todos los datos? Esta acción no se puede deshacer. Haga clic nuevamente
              en "¿Confirmar?" para proceder.
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription>
            <strong>Información:</strong> Los datos se almacenan localmente en su navegador y persisten entre sesiones.
            Use las opciones de exportar/importar para hacer respaldos o transferir datos entre dispositivos.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
