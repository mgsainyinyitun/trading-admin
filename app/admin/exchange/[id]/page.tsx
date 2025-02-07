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

interface Exchange {
  id: string;
  customerId: string;
  customerName: string;
  fromAmount: number;
  fromCoin: string;
  toAmount: number;
  toCoin: string;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
  reference: string;
  rate: number;
  notes?: string;
}

export default function ExchangeDetail() {
  const params = useParams();
  const id = params.id as string;

  // Mock data - replace with API call
  const exchange: Exchange = {
    id,
    customerId: "C001",
    customerName: "John Doe",
    fromAmount: 1.5,
    fromCoin: "BTC",
    toAmount: 25.5,
    toCoin: "ETH",
    status: "pending",
    date: "2024-03-20",
    reference: "EX001",
    rate: 17,
    notes: "Market order exchange"
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/exchange">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exchange Details</h1>
            <p className="text-muted-foreground">
              Reference: {exchange.reference}
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
              <p className="text-lg">{exchange.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer ID</p>
              <p className="text-lg">{exchange.customerId}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exchange Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusBadge(exchange.status)}>
                {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg">{new Date(exchange.date).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Exchange Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">From</p>
                  <p className="text-lg">
                    {exchange.fromAmount} {exchange.fromCoin}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">To</p>
                  <p className="text-lg">
                    {exchange.toAmount} {exchange.toCoin}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exchange Rate</p>
                  <p className="text-lg">
                    1 {exchange.fromCoin} = {exchange.rate} {exchange.toCoin}
                  </p>
                </div>
              </div>
            </div>
            {exchange.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-lg">{exchange.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}