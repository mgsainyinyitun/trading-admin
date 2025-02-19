import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { tradeSchema } from '@/zodValidate/validate';

const getCorsHeaders = (origin: string) => {
  const headers = {
    "Access-Control-Allow-Methods": `${process.env.ALLOWED_METHODS}`,
    "Access-Control-Allow-Headers": `${process.env.ALLOWED_HEADERS}`,
    "Access-Control-Allow-Origin": `${process.env.DOMAIN_URL}`,
  };

  if (!process.env.ALLOWED_ORIGIN || !origin) return headers;
  const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");
  if (allowedOrigins.includes("*")) {
    headers["Access-Control-Allow-Origin"] = "*";
  } else if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
};


export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
  );
};


export async function POST(request: NextRequest) {
  if (request.method === 'POST') {

    // Parse and validate request body
    const body = await request.json();

    const validatedData = tradeSchema.parse(body);
    const { customerId, tradeType, period, tradeQuantity } = validatedData;


    // Find the account and verify ownership
    const account = await prisma.account.findFirst({
      where: {
        customerId: Number(customerId),
        currency: 'USD',
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found or access denied" },
        { status: 404, headers: getCorsHeaders(request.headers.get("origin") || "") }
      );
    }

    if (!account.isActive) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin") || "") }
      );
    }

    // check balance 
    const balance = account.balance;
    if (balance.toNumber() < tradeQuantity) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400, headers: getCorsHeaders(request.headers.get("origin") || "") }
      );
    }

    try {
      const trade = await prisma.trade.create({
        data: {
          customerId,
          accountId: account.id,
          tradeType,
          period,
          tradingStatus: 'PENDING',
          tradeQuantity,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(trade, { headers: getCorsHeaders(request.headers.get("origin") || "") });
    } catch (error) {
      return NextResponse.json({ error: 'Error creating trade' }, { headers: getCorsHeaders(request.headers.get("origin") || "") });
    }
  }
  return NextResponse.json({ error: 'Method not allowed' }, { headers: getCorsHeaders(request.headers.get("origin") || "") });
}
