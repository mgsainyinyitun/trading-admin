import { z } from "zod";

// Validation schema for deposit request
export const depositSchema = z.object({
    accountNo: z.string().min(1, "Account number is required"),
    amount: z.string().or(z.number()).transform((val) => {
        const amount = typeof val === "string" ? parseFloat(val) : val;
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Amount must be a positive number");
        }
        return amount;
    }),
    description: z.string().optional(),
});

// Validation schema for withdrawal request
export const withdrawalSchema = z.object({
    accountNo: z.string().min(1, "Account number is required"),
    amount: z.string().or(z.number()).transform((val) => {
        const amount = typeof val === "string" ? parseFloat(val) : val;
        if (isNaN(amount) || amount <= 0) {
            throw new Error("Amount must be a positive number");
        }
        return amount;
    }),
    description: z.string().optional(),
});


// Validation schema for trade request
export const tradeSchema = z.object({
    customerId: z.number().int().positive(),
    accountId: z.number().int().positive(),
    tradeType: z.enum(['SHORT', 'LONG']),
    period: z.number().int().positive(),
    accountNo: z.string(),
    tradeQuantity: z.number().int().positive()
});


// Validation schema for trade request
export const tradeSuccessSchema = z.object({
    customerId: z.number().int().positive(),
    tradeId: z.number().int().positive(),
});
