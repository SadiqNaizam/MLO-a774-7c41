import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface AccountSummaryCardProps {
  accountId: string;
  accountName: string;
  accountType: string; // e.g., "Savings", "Checking", "Joint"
  balance: number;
  currency?: string;
  status?: "active" | "pending" | "closed";
  onViewDetails?: (accountId: string) => void;
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  accountId,
  accountName,
  accountType,
  balance,
  currency = "USD",
  status,
  onViewDetails,
}) => {
  console.log("Rendering AccountSummaryCard for:", accountName);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{accountName}</CardTitle>
            <CardDescription>{accountType} Account</CardDescription>
          </div>
          {status && (
            <Badge variant={status === 'pending' ? 'secondary' : 'default'}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
        <p className="text-sm text-muted-foreground">Available Balance</p>
      </CardContent>
      {onViewDetails && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => onViewDetails(accountId)}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AccountSummaryCard;