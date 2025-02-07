import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

// Validation function for email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate unique account number
function generateAccountNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${timestamp}${random}`;
}

export async function POST(req: Request) {
  try {
    const { 
      email, 
      name, 
      phone, 
      password,
      socialSecurityNumber 
    } = await req.json();

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
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

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new customer with a default account
    const customer = await prisma.$transaction(async (tx) => {
      // Create customer
      const newCustomer = await tx.customer.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
          socialSecurityNumber,
          active: true,
          isActivated: false, // Requires email verification
          accounts: {
            create: {
              accountNo: generateAccountNumber(),
              balance: 0,
              currency: "USD",
              isActive: true
            }
          }
        },
        include: {
          accounts: true
        }
      });

      return newCustomer;
    });

    // Remove password from response
    const { password: _, ...customerData } = customer;

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email for activation.",
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
