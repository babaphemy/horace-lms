import conn from "@/utils/connect"
import { NextRequest, NextResponse } from "next/server"
import SetUpPayment from "../../../model/payment"
export async function POST(req: NextRequest) {
  try {
    await conn()
    const payment = await req.json()
    const std = await SetUpPayment.create(payment)

    return NextResponse.json({
      data: std,
      message: `${std} created successfully!`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: `Request failed! : ${error} `,
      },
      {
        status: 500,
      }
    )
  }
}
