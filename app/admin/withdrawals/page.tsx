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
import { Search, Filter, Copy, ExternalLink } from "lucide-react";
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
}

interface ConfirmationDialog {
  isOpen: boolean;
  withdrawalId: string;
  action: 'approve' | 'reject' | 'complete' | null;
}

export default function Withdrawals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog>({
    isOpen: false,
    withdrawalId: "",
    action: null,
  });
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: "1",
      customerId: "C001",
      customerName: "John Doe",
      amount: 0.5,
      status: "pending",
      coinType: "BTC",
      walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      date: "2024-03-20",
      reference: "WD001",
    },
    {
      id: "2",
      customerId: "C002",
      customerName: "Jane Smith",
      amount: 5.2,
      status: "approved",
      coinType: "ETH",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      date: "2024-03-19",
      reference: "WD002",
    },
    {
      id: "3",
      customerId: "C003",
      customerName: "Bob Johnson",
      amount: 100.5,
      status: "completed",
      coinType: "USDT",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      date: "2024-03-18",
      reference: "WD003",
    },
  ]);

  const handleStatusChange = async (withdrawalId: string, newStatus: 'approved' | 'rejected' | 'completed') => {
    try {
      setWithdrawals(withdrawals.map(withdrawal => 
        withdrawal.id === withdrawalId 
          ? { ...withdrawal, status: newStatus }
          : withdrawal
      ));
      
      toast.success(`Withdrawal ${newStatus} successfully`);
      setConfirmDialog({ isOpen: false, withdrawalId: "", action: null });
    } catch (error) {
      toast.error("Failed to update withdrawal status");
    }
  };

  const openConfirmDialog = (withdrawalId: string, action: 'approve' | 'reject' | 'complete') => {
    setConfirmDialog({
      isOpen: true,
      withdrawalId,
      action,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Wallet address copied to clipboard");
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

  const getConfirmationMessage = (action: string) => {
    switch (action) {
      case 'approve':
        return "Are you sure you want to approve this withdrawal? This will allow the withdrawal to proceed.";
      case 'reject':
        return "Are you sure you want to reject this withdrawal? The funds will be returned to the customer's account.";
      case 'complete':
        return "Are you sure you want to mark this withdrawal as completed? This confirms that the funds have been sent.";
      default:
        return "";
    }
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = Object.values(withdrawal).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "all" || withdrawal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Withdrawal Management</h1>
          <p className="text-muted-foreground">
            Review and manage customer withdrawal requests
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Withdrawals</CardTitle>
              <CardDescription>
                View and manage all withdrawal requests
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search withdrawals..."
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
                  <SelectItem value="approved">Approved</SelectItem>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Coin</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">{withdrawal.reference}</TableCell>
                    <TableCell>{withdrawal.customerName}</TableCell>
                    <TableCell>{withdrawal.amount} {withdrawal.coinType}</TableCell>
                    <TableCell>{withdrawal.coinType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {withdrawal.walletAddress.slice(0, 6)}...
                          {withdrawal.walletAddress.slice(-4)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(withdrawal.walletAddress)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(withdrawal.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(withdrawal.status)}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/withdrawals/${withdrawal.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Details
                          </Button>
                        </Link>
                        {withdrawal.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() => openConfirmDialog(withdrawal.id, "approve")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                              onClick={() => openConfirmDialog(withdrawal.id, "reject")}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {withdrawal.status === "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                            onClick={() => openConfirmDialog(withdrawal.id, "complete")}
                          >
                            Mark as Sent
                          </Button>
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
          setConfirmDialog({ isOpen, withdrawalId: "", action: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === "approve" 
                ? "Approve Withdrawal" 
                : confirmDialog.action === "complete"
                ? "Complete Withdrawal"
                : "Reject Withdrawal"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action && getConfirmationMessage(confirmDialog.action)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDialog.action && confirmDialog.withdrawalId) {
                  handleStatusChange(confirmDialog.withdrawalId, confirmDialog.action === "approve" ? "approved" : confirmDialog.action === "complete" ? "completed" : "rejected");
                }
              }}
              className={
                confirmDialog.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : confirmDialog.action === "complete"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmDialog.action === "approve" 
                ? "Approve" 
                : confirmDialog.action === "complete"
                ? "Complete"
                : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}