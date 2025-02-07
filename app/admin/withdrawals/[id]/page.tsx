"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Withdrawal {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  coinType: string;
  walletAddress: string;
  date: string;
  reference: string;
  network: string;
  transactionHash?: string;
  notes?: string;
}

export default function WithdrawalDetail() {
  const params = useParams();
  const id = params.id as string;

  // Mock data - replace with API call
  const withdrawal: Withdrawal = {
    id,
    customerId: "C001",
    customerName: "John Doe",
    amount: 0.5,
    status: "pending",
    coinType: "BTC",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    date: "2024-03-20",
    reference: "WD001",
    network: "Bitcoin Network",
    notes: "Regular withdrawal request"
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/withdrawals">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Withdrawal Details</h1>
            <p className="text-muted-foreground">
              Reference: {withdrawal.reference}
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
              <p className="text-lg">{withdrawal.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
              <p className="text-lg">{withdrawal.customerId}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-lg">{withdrawal.amount} {withdrawal.coinType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusBadge(withdrawal.status)}>
                {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg">{new Date(withdrawal.date).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coin Type</p>
                <p className="text-lg">{withdrawal.coinType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Network</p>
                <p className="text-lg">{withdrawal.network}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-muted p-2 rounded">
                  {withdrawal.walletAddress}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(withdrawal.walletAddress)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {withdrawal.transactionHash && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted p-2 rounded">
                    {withdrawal.transactionHash}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(withdrawal.transactionHash!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            {withdrawal.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-lg">{withdrawal.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}