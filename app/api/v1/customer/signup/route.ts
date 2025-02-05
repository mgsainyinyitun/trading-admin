import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, name, phone, password } = await req.json();

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Customer already exists" },
        { status: 400 }
      );
    }

    // Create new customer
    const customer = await prisma.customer.create({
      data: {
        email,
        name,
        phone,
        password, // Note: In production, hash the password before storing
      },
    });

    // Remove password from response
    const { password: _, ...customerData } = customer;

    return NextResponse.json(
      {
        success: true,
        data: customerData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in customer signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
