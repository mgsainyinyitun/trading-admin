import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { tradeSuccessSchema } from '@/zodValidate/validate';
import { calculateIsSuccess } from '@/lib/utils';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    // Parse and validate request body

    const body = await req.json();

    const validatedData = tradeSuccessSchema.parse(body);
    const { customerId, tradeId } = validatedData;

    // Find trade & verify by customerId & tradeId
    const trade = await prisma.trade.findUnique({
      where: {
        id: tradeId,
        customerId: Number(customerId)
      },
    });

    if (!trade) {
      return NextResponse.json(
        { error: "Trade not found or access denied" },
        { status: 404 }
      );
    }

    let windRateDefined = 0.5;
    // get win rate for customer
    const winRate = await prisma.winRate.findFirst({
      where: {
        customerId: Number(customerId)
      },
    });

    if (winRate) {
      windRateDefined = winRate.winRate;
    }

    // Get trading setting by second & type
    const tradingSetting = await prisma.tradingSetting.findFirst({
      where: {
        seconds: trade.period,
        tradingType: trade.tradeType
      },
    })

    if (!tradingSetting) {
      return NextResponse.json(
        { error: "Something went wrong. Please try again" },
        { status: 404 }
      )
    }

    // calculate isSuccess or not based on winRate
    const isSuccess = calculateIsSuccess(windRateDefined, tradingSetting?.winRate);
    let profit = 0;

    // if(success) calculate profile base on tradeQuantity & winRate
    if (isSuccess) {
      profit = trade.tradeQuantity * (tradingSetting.percentage/100);
    } else {
      profit = -1 * trade.tradeQuantity;
    }

    try {
      await prisma.$transaction(async (prisma) => {
        // Update the first table
        await prisma.trade.update({
          where: {
            id: tradeId,
            customerId: Number(customerId)
          },
          data: {
            tradingStatus: 'PENDING',
            isSuccess: isSuccess,
          }
        });
        // Update the second table
        await prisma.account.update({
          where: {
            id: trade.accountId
          },
          data: {
            balance: {
              increment: profit
            }
          }
        });
      });
      return NextResponse.json({ success: true,profit:profit });
    } catch (error) {
      console.error('An error occurred, rolling back the transaction:', error);
      return NextResponse.json({ error: 'Error trading this time! Please try again' });
    }
  }
  return NextResponse.json({ error: 'Method not allowed' });
}
