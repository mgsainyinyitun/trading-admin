// fetch available balance (usd) of customer
import { authenticateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // Verify customer token and get customer data
    const customer = await authenticateRequest(req);
    if (!customer) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    // find account
    const account = await prisma.account.findFirst({
        where: {
            customerId: Number(customer.id),
            currency: 'USD',
        }
    });

    if (!account) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    return NextResponse.json({ balance: account.balance });
}