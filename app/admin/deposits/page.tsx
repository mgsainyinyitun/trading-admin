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

interface Deposit {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  method: string;
  date: string;
  reference: string;
}

interface ConfirmationDialog {
  isOpen: boolean;
  depositId: string;
  action: 'approve' | 'reject' | null;
}

export default function Deposits() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog>({
    isOpen: false,
    depositId: "",
    action: null,
  });
  const [deposits, setDeposits] = useState<Deposit[]>([
    {
      id: "1",
      customerId: "C001",
      customerName: "John Doe",
      amount: 1000.00,
      status: "pending",
      method: "Bank Transfer",
      date: "2024-03-20",
      reference: "DEP001",
    },
    {
      id: "2",
      customerId: "C002",
      customerName: "Jane Smith",
      amount: 500.00,
      status: "approved",
      method: "Credit Card",
      date: "2024-03-19",
      reference: "DEP002",
    },
    {
      id: "3",
      customerId: "C003",
      customerName: "Bob Johnson",
      amount: 750.00,
      status: "rejected",
      method: "PayPal",
      date: "2024-03-18",
      reference: "DEP003",
    },
  ]);

  const handleStatusChange = async (depositId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setDeposits(deposits.map(deposit => 
        deposit.id === depositId 
          ? { ...deposit, status: newStatus }
          : deposit
      ));
      
      toast.success(`Deposit ${newStatus} successfully`);
      setConfirmDialog({ isOpen: false, depositId: "", action: null });
    } catch (error) {
      toast.error("Failed to update deposit status");
    }
  };

  const openConfirmDialog = (depositId: string, action: 'approve' | 'reject') => {
    setConfirmDialog({
      isOpen: true,
      depositId,
      action,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = Object.values(deposit).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === "all" || deposit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deposit Management</h1>
          <p className="text-muted-foreground">
            Review and manage customer deposits
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Deposits</CardTitle>
              <CardDescription>
                View and manage all deposit requests
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search deposits..."
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
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="font-medium">{deposit.reference}</TableCell>
                    <TableCell>{deposit.customerName}</TableCell>
                    <TableCell>${deposit.amount.toFixed(2)}</TableCell>
                    <TableCell>{deposit.method}</TableCell>
                    <TableCell>{new Date(deposit.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(deposit.status)}>
                        {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/deposits/${deposit.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Details
                          </Button>
                        </Link>
                        {deposit.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() => openConfirmDialog(deposit.id, "approve")}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                              onClick={() => openConfirmDialog(deposit.id, "reject")}
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
          setConfirmDialog({ isOpen, depositId: "", action: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === "approve" 
                ? "Approve Deposit" 
                : "Reject Deposit"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === "approve"
                ? "Are you sure you want to approve this deposit? This action cannot be undone."
                : "Are you sure you want to reject this deposit? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDialog.action && confirmDialog.depositId) {
                  handleStatusChange(confirmDialog.depositId, confirmDialog.action);
                }
              }}
              className={
                confirmDialog.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmDialog.action === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}