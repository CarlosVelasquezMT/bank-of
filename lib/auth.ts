import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export async function verifyToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    return decoded
  } catch (error) {
    return null
  }
}
