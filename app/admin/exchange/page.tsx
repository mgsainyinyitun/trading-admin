"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ExternalLink } from "lucide-react";
import { toast } from "sonner";

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
}

interface ConfirmationDialog {
  isOpen: boolean;
  exchangeId: string;
  action: 'complete' | 'reject' | null;
}

export default function Exchange() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog>({
    isOpen: false,
    exchangeId: "",
    action: null,
  });
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      id: "1",
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
    },
    {
      id: "2",
      customerId: "C002",
      customerName: "Jane Smith",
      fromAmount: 1000,
      fromCoin: "USDT",
      toAmount: 0.5,
      toCoin: "BTC",
      status: "completed",
      date: "2024-03-19",
      reference: "EX002",
      rate: 0.0005,
    },
    {
      id: "3",
      customerId: "C003",
      customerName: "Bob Johnson",
      fromAmount: 10,
      fromCoin: "ETH",
      toAmount: 15000,
      toCoin: "USDT",
      status: "rejected",
      date: "2024-03-18",
      reference: "EX003",
      rate: 1500,
    },
  ]);

  const handleStatusChange = async (exchangeId: string, newStatus: 'completed' | 'rejected') => {
    try {
      setExchanges(exchanges.map(exchange => 
        exchange.id === exchangeId 
          ? { ...exchange, status: newStatus }
          : exchange
      ));
      
      toast.success(`Exchange ${newStatus} successfully`);
      setConfirmDialog({ isOpen: false, exchangeId: "", action: null });
    } catch (error) {
      toast.error("Failed to update exchange status");
    }
  };

  const openConfirmDialog = (exchangeId: string, action: 'complete' | 'reject') => {
    setConfirmDialog({
      isOpen: true,
      exchangeId,
      action,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getConfirmationMessage = (action: string) => {
    switch (action) {
      case 'complete':
        return "Are you sure you want to complete this exchange? This will process the conversion and update the customer's balances.";
      case 'reject':
        return "Are you sure you want to reject this exchange? The original amount will be returned to the customer's account.";
      default:
        return "";
    }
  };

  const filteredExchanges = exchanges.filter(exchange => {
    const matchesSearch = Object.values(exchange).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "all" || exchange.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exchange Management</h1>
          <p className="text-muted-foreground">
            Review and manage customer exchange requests
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exchange Requests</CardTitle>
              <CardDescription>
                View and manage all exchange requests
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search exchanges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExchanges.map((exchange) => (
                  <TableRow key={exchange.id}>
                    <TableCell className="font-medium">{exchange.reference}</TableCell>
                    <TableCell>{exchange.customerName}</TableCell>
                    <TableCell>
                      {exchange.fromAmount} {exchange.fromCoin}
                    </TableCell>
                    <TableCell>
                      {exchange.toAmount} {exchange.toCoin}
                    </TableCell>
                    <TableCell>
                      1 {exchange.fromCoin} = {exchange.rate} {exchange.toCoin}
                    </TableCell>
                    <TableCell>{new Date(exchange.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(exchange.status)}>
                        {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/exchange/${exchange.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Details
                          </Button>
                        </Link>
                        {exchange.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() => openConfirmDialog(exchange.id, "complete")}
                            >
                              Complete
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                              onClick={() => openConfirmDialog(exchange.id, "reject")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog 
        open={confirmDialog.isOpen} 
        onOpenChange={(isOpen) => 
          setConfirmDialog({ isOpen, exchangeId: "", action: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === "complete" 
                ? "Complete Exchange" 
                : "Reject Exchange"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action && getConfirmationMessage(confirmDialog.action)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDialog.action && confirmDialog.exchangeId) {
                  handleStatusChange(confirmDialog.exchangeId, confirmDialog.action);
                }
              }}
              className={
                confirmDialog.action === "complete"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmDialog.action === "complete" ? "Complete" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}