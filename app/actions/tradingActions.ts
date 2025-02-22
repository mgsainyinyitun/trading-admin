"use server"

import { prisma } from "@/lib/prisma";
import { TradingHistory } from "@/type";

export async function getAllTrading(): Promise<TradingHistory[]> {
    const tradingHistory = await prisma.trade.findMany({
        include: {
            account: true,
            customer: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return tradingHistory.map(history => ({
        id: history.id,
        customerId: history.customerId.toString(),
        customerName: history.customer.name,
        accountId: history.accountId,
        accountNumber: history.account.accountNo,
        createdAt: history.createdAt.toISOString(),
        updatedAt: history.updatedAt.toISOString(),
        tradeType: history.tradeType,
        period: history.period,
        loginId: history.customer.loginId,
        tradingStatus: history.tradingStatus,
        isSuccess: history.isSuccess ?? false,
        tradeQuantity: history.tradeQuantity,
    }));
}

