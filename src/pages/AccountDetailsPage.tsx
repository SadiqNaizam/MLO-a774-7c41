import React, { useState, useMemo } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Header from '@/components/layout/Header';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Download, Filter, Search } from 'lucide-react';

// Placeholder data
const sampleTransactions = [
  { id: 'txn_1', date: '2024-07-20', description: 'Online Shopping - Tech Gadget', amount: -129.99, type: 'Debit', status: 'Completed' },
  { id: 'txn_2', date: '2024-07-19', description: 'Salary Deposit - July', amount: 2500.00, type: 'Credit', status: 'Completed' },
  { id: 'txn_3', date: '2024-07-18', description: 'Restaurant - Dinner with Friends', amount: -45.50, type: 'Debit', status: 'Completed' },
  { id: 'txn_4', date: '2024-07-17', description: 'Pending Payment - Utility Bill', amount: -75.00, type: 'Debit', status: 'Pending' },
  { id: 'txn_5', date: '2024-07-15', description: 'ATM Withdrawal', amount: -100.00, type: 'Debit', status: 'Completed' },
];

const accountData: { [key: string]: any } = {
  'acc_personal_savings_001': { accountId: 'acc_personal_savings_001', accountName: 'Everyday Savings', accountType: 'Savings', balance: 12500.75, currency: 'USD', status: 'active' as const },
  'acc_personal_checking_002': { accountId: 'acc_personal_checking_002', accountName: 'Primary Checking', accountType: 'Checking', balance: 3450.20, currency: 'USD', status: 'active' as const },
};


const AccountDetailsPage: React.FC = () => {
  const { accountId = 'acc_personal_checking_002' } = useParams<{ accountId: string }>(); // Default for direct access
  const [searchTerm, setSearchTerm] = useState('');
  console.log(`AccountDetailsPage loaded for account: ${accountId}`);

  const currentAccount = accountData[accountId] || {
    accountId: 'unknown',
    accountName: 'Unknown Account',
    accountType: 'N/A',
    balance: 0,
    currency: 'USD',
    status: 'closed' as const
  };

  const filteredTransactions = useMemo(() => {
    return sampleTransactions.filter(tx =>
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header title={currentAccount.accountName} />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><RouterLink to="/dashboard">Dashboard</RouterLink></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{currentAccount.accountName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <AccountSummaryCard {...currentAccount} />

          <section>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0 md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full"
                    />
                </div>
                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Statement</Button>
              </div>
            </div>
            <div className="bg-background rounded-lg border">
              <Table>
                <TableCaption>A list of recent transactions for {currentAccount.accountName}.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? filteredTransactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>
                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                           {tx.status}
                         </span>
                      </TableCell>
                      <TableCell className={`text-right ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{currentAccount.currency} {Math.abs(tx.amount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">No transactions found matching your criteria.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </main>
      </ScrollArea>
    </div>
  );
};

export default AccountDetailsPage;