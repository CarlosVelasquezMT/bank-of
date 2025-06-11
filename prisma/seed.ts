import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed de la base de datos Neon...")

  try {
    // Verificar conexión
    await prisma.$connect()
    console.log("✅ Conectado a Neon Database")

    // Limpiar datos existentes en orden correcto
    console.log("🧹 Limpiando datos existentes...")
    await prisma.withdrawal.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.recharge.deleteMany()
    await prisma.transfer.deleteMany()
    await prisma.loan.deleteMany()
    await prisma.credit.deleteMany()
    await prisma.movement.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
    await prisma.bankConfig.deleteMany()

    // Crear configuración del banco
    console.log("⚙️ Creando configuración del banco...")
    await prisma.bankConfig.createMany({
      data: [
        { key: "bank_name", value: "Bank of America" },
        { key: "daily_transfer_limit", value: "50000" },
        { key: "daily_withdrawal_limit", value: "10000" },
        { key: "min_balance", value: "0" },
        { key: "interest_rate_savings", value: "2.5" },
        { key: "interest_rate_credit", value: "18.5" },
      ],
    })

    // Crear usuario administrador
    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = await prisma.user.create({
      data: {
        email: "admin@bankofamerica.com",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    console.log("✅ Usuario administrador creado")

    // Crear usuarios de prueba con cuentas
    const users = [
      {
        email: "juan.perez@email.com",
        fullName: "Juan Carlos Pérez",
        balance: 15000.0,
        accountNumber: "1001234567",
      },
      {
        email: "maria.garcia@email.com",
        fullName: "María García López",
        balance: 25000.5,
        accountNumber: "1001234568",
      },
      {
        email: "carlos.rodriguez@email.com",
        fullName: "Carlos Rodríguez Martínez",
        balance: 8500.75,
        accountNumber: "1001234569",
      },
      {
        email: "ana.martinez@email.com",
        fullName: "Ana Martínez Silva",
        balance: 32000.25,
        accountNumber: "1001234570",
      },
      {
        email: "luis.gonzalez@email.com",
        fullName: "Luis González Herrera",
        balance: 12750.0,
        accountNumber: "1001234571",
      },
    ]

    for (const userData of users) {
      const userPassword = await bcrypt.hash("123456", 10)

      // Crear usuario
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: userPassword,
          role: "USER",
        },
      })

      // Crear cuenta asociada
      const account = await prisma.account.create({
        data: {
          accountNumber: userData.accountNumber,
          fullName: userData.fullName,
          email: userData.email,
          password: userPassword,
          balance: userData.balance,
          userId: user.id,
        },
      })

      // Crear movimientos de ejemplo
      await prisma.movement.createMany({
        data: [
          {
            accountId: account.id,
            type: "DEPOSIT",
            amount: userData.balance,
            description: "Depósito inicial",
            reference: `DEP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
          {
            accountId: account.id,
            type: "PAYMENT",
            amount: -150.0,
            description: "Pago de servicios públicos",
            reference: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
          {
            accountId: account.id,
            type: "RECHARGE",
            amount: -50.0,
            description: "Recarga celular",
            reference: `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
        ],
      })

      // Crear crédito de ejemplo
      await prisma.credit.create({
        data: {
          accountId: account.id,
          amount: Math.floor(userData.balance * 0.3),
          limit: userData.balance * 2,
          interestRate: 18.5,
          status: "ACTIVE",
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      // Crear préstamo de ejemplo (solo para algunos usuarios)
      if (userData.balance > 20000) {
        await prisma.loan.create({
          data: {
            accountId: account.id,
            amount: 50000.0,
            remaining: 35000.0,
            interestRate: 12.5,
            monthlyPayment: 1250.0,
            term: 48,
            status: "ACTIVE",
            startDate: new Date(),
          },
        })
      }

      console.log(`✅ Usuario ${userData.fullName} creado con cuenta ${userData.accountNumber}`)
    }

    // Crear algunas transferencias entre cuentas
    const accounts = await prisma.account.findMany()
    if (accounts.length >= 2) {
      const transferAmount = 500.0
      const reference = `TRF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      await prisma.transfer.create({
        data: {
          fromAccountId: accounts[0].id,
          toAccountId: accounts[1].id,
          amount: transferAmount,
          description: "Transferencia de prueba",
          reference: reference,
          status: "COMPLETED",
        },
      })

      // Actualizar balances
      await prisma.account.update({
        where: { id: accounts[0].id },
        data: { balance: { decrement: transferAmount } },
      })

      await prisma.account.update({
        where: { id: accounts[1].id },
        data: { balance: { increment: transferAmount } },
      })

      // Crear movimientos para la transferencia
      await prisma.movement.createMany({
        data: [
          {
            accountId: accounts[0].id,
            type: "TRANSFER_OUT",
            amount: -transferAmount,
            description: `Transferencia a ${accounts[1].accountNumber}`,
            reference: `TRF-OUT-${Date.now()}`,
          },
          {
            accountId: accounts[1].id,
            type: "TRANSFER_IN",
            amount: transferAmount,
            description: `Transferencia de ${accounts[0].accountNumber}`,
            reference: `TRF-IN-${Date.now()}`,
          },
        ],
      })

      console.log("✅ Transferencia de ejemplo creada")
    }

    console.log("🎉 Seed completado exitosamente en Neon Database!")
    console.log("\n📋 Credenciales de acceso:")
    console.log("👨‍💼 Administrador:")
    console.log("   Email: admin@bankofamerica.com")
    console.log("   Password: admin123")
    console.log("\n👤 Usuarios de prueba (password: 123456):")
    users.forEach((user) => {
      console.log(`   ${user.fullName}: ${user.email}`)
    })
  } catch (error) {
    console.error("❌ Error durante el seed:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
