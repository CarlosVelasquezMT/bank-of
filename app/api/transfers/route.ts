import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { toAccountNumber, amount, description } = await request.json()

    // Obtener cuenta del usuario
    const fromAccount = await prisma.account.findUnique({
      where: { userId: user.userId },
    })

    if (!fromAccount) {
      return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 })
    }

    // Verificar saldo suficiente
    if (fromAccount.balance < amount) {
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 })
    }

    // Buscar cuenta destino
    const toAccount = await prisma.account.findUnique({
      where: { accountNumber: toAccountNumber },
    })

    if (!toAccount) {
      return NextResponse.json({ error: "Cuenta destino no encontrada" }, { status: 404 })
    }

    if (fromAccount.id === toAccount.id) {
      return NextResponse.json({ error: "No puedes transferir a tu misma cuenta" }, { status: 400 })
    }

    // Realizar transferencia en transacción
    const reference = `TRF${Date.now()}`

    const result = await prisma.$transaction(async (tx) => {
      // Actualizar balances
      await tx.account.update({
        where: { id: fromAccount.id },
        data: { balance: { decrement: amount } },
      })

      await tx.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: amount } },
      })

      // Crear registro de transferencia
      const transfer = await tx.transfer.create({
        data: {
          amount,
          description: description || `Transferencia a ${toAccount.fullName}`,
          reference,
          fromAccountId: fromAccount.id,
          toAccountId: toAccount.id,
        },
      })

      // Crear movimientos
      await tx.movement.create({
        data: {
          type: "TRANSFER_OUT",
          amount,
          description: `Transferencia a ${toAccount.fullName}`,
          reference,
          accountId: fromAccount.id,
        },
      })

      await tx.movement.create({
        data: {
          type: "TRANSFER_IN",
          amount,
          description: `Transferencia de ${fromAccount.fullName}`,
          reference,
          accountId: toAccount.id,
        },
      })

      return transfer
    })

    return NextResponse.json({
      success: true,
      reference: result.reference,
      message: "Transferencia realizada exitosamente",
    })
  } catch (error) {
    console.error("Error en transferencia:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
