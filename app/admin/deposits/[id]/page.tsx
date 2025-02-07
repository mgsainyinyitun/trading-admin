"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Deposit {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method: string;
  date: string;
  reference: string;
  proofImage: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  notes?: string;
}

export default function DepositDetail() {
  const params = useParams();
  const id = params.id as string;

  // Mock data - replace with API call
  const deposit: Deposit = {
    id,
    customerId: "C001",
    customerName: "John Doe",
    amount: 1000.00,
    status: "pending",
    method: "Bank Transfer",
    date: "2024-03-20",
    reference: "DEP001",
    proofImage: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1000",
    bankName: "Chase Bank",
    accountNumber: "****1234",
    accountName: "John Doe",
    notes: "Payment for premium subscription"
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/deposits">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deposit Details</h1>
            <p className="text-muted-foreground">
              Reference: {deposit.reference}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
              <p className="text-lg">{deposit.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
              <p className="text-lg">{deposit.customerId}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deposit Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-lg">${deposit.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Method</p>
              <p className="text-lg">{deposit.method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusBadge(deposit.status)}>
                {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg">{new Date(deposit.date).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                <p className="text-lg">{deposit.bankName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                <p className="text-lg">{deposit.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Name</p>
                <p className="text-lg">{deposit.accountName}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Payment Proof</p>
              <img
                src={deposit.proofImage}
                alt="Payment Proof"
                className="rounded-lg max-w-md"
              />
            </div>
            {deposit.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-lg">{deposit.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}