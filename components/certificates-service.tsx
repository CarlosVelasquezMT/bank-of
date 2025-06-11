"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building2, FileText, Download, Eye } from "lucide-react"
import type { User } from "@/types/bank"

interface CertificatesServiceProps {
  currentUser: User
  onBack: () => void
}

export default function CertificatesService({ currentUser, onBack }: CertificatesServiceProps) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [viewing, setViewing] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Simulate certificates available for the user
  const certificates = [
    {
      id: "cert_001",
      name: "Estado de Cuenta - Enero 2024",
      type: "account_statement",
      date: "2024-01-31",
      size: "245 KB",
    },
    {
      id: "cert_002",
      name: "Certificado de No Deuda",
      type: "no_debt",
      date: "2024-02-15",
      size: "128 KB",
    },
    {
      id: "cert_003",
      name: "Resumen Anual 2023",
      type: "annual_summary",
      date: "2024-01-10",
      size: "1.2 MB",
    },
    {
      id: "cert_004",
      name: "Comprobante de Pago - Préstamo",
      type: "payment_receipt",
      date: "2024-02-05",
      size: "156 KB",
    },
  ]

  const handleDownload = async (certificateId: string) => {
    setDownloading(certificateId)
    setError("")

    // Simulate download delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const certificate = certificates.find((cert) => cert.id === certificateId)
    if (certificate) {
      // In a real app, this would trigger a file download
      console.log(`Downloading certificate: ${certificate.name}`)
      // Simulate successful download
      alert(`Certificado "${certificate.name}" descargado correctamente.`)
    } else {
      setError("No se pudo descargar el certificado. Intente nuevamente.")
    }

    setDownloading(null)
  }

  const handleView = (certificateId: string) => {
    setViewing(certificateId)
  }

  const closeViewer = () => {
    setViewing(null)
  }

  const getCertificateTypeIcon = (type: string) => {
    switch (type) {
      case "account_statement":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "no_debt":
        return <FileText className="h-5 w-5 text-green-600" />
      case "annual_summary":
        return <FileText className="h-5 w-5 text-purple-600" />
      case "payment_receipt":
        return <FileText className="h-5 w-5 text-orange-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
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
                <p className="text-sm text-gray-600">Certificados y Documentos</p>
              </div>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Mis Certificados y Documentos
            </CardTitle>
            <CardDescription>Descargue certificados y documentos relacionados con su cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            {viewing ? (
              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-bold">{certificates.find((cert) => cert.id === viewing)?.name}</h3>
                      <p className="text-sm text-gray-600">
                        Fecha: {certificates.find((cert) => cert.id === viewing)?.date}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={closeViewer}>
                      Cerrar
                    </Button>
                  </div>

                  <div className="border rounded-lg p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[400px]">
                    <FileText className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Vista previa del documento</p>
                    <p className="text-sm text-gray-500 mb-6">
                      Este es un simulador de vista previa del certificado seleccionado.
                    </p>
                    <Button
                      onClick={() => handleDownload(viewing)}
                      disabled={downloading === viewing}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {downloading === viewing ? (
                        "Descargando..."
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar Documento
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Button variant="outline" onClick={closeViewer} className="w-full">
                  Volver a la lista de certificados
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Documento</th>
                        <th className="text-left py-3 px-4">Fecha</th>
                        <th className="text-left py-3 px-4">Tamaño</th>
                        <th className="text-right py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((certificate) => (
                        <tr key={certificate.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {getCertificateTypeIcon(certificate.type)}
                              <span className="ml-2">{certificate.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{certificate.date}</td>
                          <td className="py-3 px-4">{certificate.size}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleView(certificate.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(certificate.id)}
                                disabled={downloading === certificate.id}
                              >
                                {downloading === certificate.id ? (
                                  "Descargando..."
                                ) : (
                                  <>
                                    <Download className="h-4 w-4 mr-1" />
                                    Descargar
                                  </>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {certificates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No hay certificados disponibles para descargar.</div>
                )}

                <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-2">Información importante:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Los certificados están en formato PDF y requieren un lector compatible.</li>
                    <li>
                      Si necesita un certificado que no aparece en la lista, puede solicitarlo en la sección de "Paz y
                      Salvo".
                    </li>
                    <li>Los documentos están disponibles por un período de 12 meses.</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
