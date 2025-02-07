"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, Calendar, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive";
  avatar?: string;
  totalDeposits: number;
  totalWithdrawals: number;
  lastLogin: string;
  country: string;
  kycStatus: "verified" | "pending" | "unverified";
  referralCode: string;
  notes?: string;
}

export default function CustomerDetail() {
  const params = useParams();
  const id = params.id as string;

  // Mock data - replace with API call
  const customer: Customer = {
    id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234-567-8901",
    joinDate: "2024-01-15",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    totalDeposits: 25000,
    totalWithdrawals: 15000,
    lastLogin: "2024-03-20T10:30:00",
    country: "United States",
    kycStatus: "verified",
    referralCode: "JOHN123",
    notes: "Premium customer with high trading volume"
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const getKycStatusBadge = (status: string) => {
    const styles = {
      verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      unverified: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
            <p className="text-muted-foreground">
              Customer ID: {customer.id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Customer</Button>
          <Button variant="destructive">Deactivate Account</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>
                  <UserCircle className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{customer.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Badge className={getStatusBadge(customer.status)}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </Badge>
                  <Badge className={getKycStatusBadge(customer.kycStatus)}>
                    KYC {customer.kycStatus.charAt(0).toUpperCase() + customer.kycStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(customer.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Deposits</p>
                <p className="text-2xl font-bold">${customer.totalDeposits.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Withdrawals</p>
                <p className="text-2xl font-bold">${customer.totalWithdrawals.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Balance</p>
                <p className="text-2xl font-bold">
                  ${(customer.totalDeposits - customer.totalWithdrawals).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
              <p className="text-lg">{customer.country}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Login</p>
              <p className="text-lg">
                {new Date(customer.lastLogin).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Referral Code</p>
              <p className="text-lg">{customer.referralCode}</p>
            </div>
          </CardContent>
        </Card>

        {customer.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{customer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}