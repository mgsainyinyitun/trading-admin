import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { tradeSchema } from '@/zodValidate/validate';

export async function POST(request: NextRequest) {
  if (request.method === 'POST') {

    // Parse and validate request body
    const body = await request.json();

    const validatedData = tradeSchema.parse(body);
    const { customerId, accountId, tradeType, period, accountNo, tradeQuantity } = validatedData;

    // Find the account and verify ownership
    const account = await prisma.account.findUnique({
      where: {
        accountNo: accountNo,
        customerId: Number(customerId)
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found or access denied" },
        { status: 404 }
      );
    }

    if (!account.isActive) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 400 }
      );
    }

    // check balance 
    const balance = account.balance;
    if (balance.toNumber() < tradeQuantity) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    try {
      const trade = await prisma.trade.create({
        data: {
          customerId,
          accountId,
          tradeType,
          period,
          tradingStatus: 'PENDING',
          tradeQuantity,
        },
      });
      return NextResponse.json(trade);
    } catch (error) {
      return NextResponse.json({ error: 'Error creating trade' });
    }
  }
  return NextResponse.json({ error: 'Method not allowed' });
}
