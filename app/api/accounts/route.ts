import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const accounts = await prisma.account.findMany({
      include: {
        movements: { orderBy: { createdAt: "desc" }, take: 5 },
        credits: true,
        loans: true,
        _count: {
          select: {
            movements: true,
            credits: true,
            loans: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error obteniendo cuentas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { fullName, email, password, initialBalance = 0 } = await request.json()

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
    }

    // Generar número de cuenta único
    const accountNumber = `4000${Date.now().toString().slice(-8)}`

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario y cuenta en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "USER",
        },
      })

      const newAccount = await tx.account.create({
        data: {
          accountNumber,
          fullName,
          email,
          password: hashedPassword,
          balance: initialBalance,
          userId: newUser.id,
        },
      })

      // Crear movimiento inicial si hay balance
      if (initialBalance > 0) {
        await tx.movement.create({
          data: {
            type: "DEPOSIT",
            amount: initialBalance,
            description: "Depósito inicial",
            accountId: newAccount.id,
          },
        })
      }

      return { user: newUser, account: newAccount }
    })

    return NextResponse.json(result.account)
  } catch (error) {
    console.error("Error creando cuenta:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
