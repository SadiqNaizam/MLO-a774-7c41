import React from 'react';
import Header from '@/components/layout/Header';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import InteractiveFinancialChart from '@/components/InteractiveFinancialChart';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Send, Home, CreditCard, Users, Settings } from 'lucide-react';

// Placeholder data
const personalAccounts = [
  { accountId: 'acc_personal_savings_001', accountName: 'Everyday Savings', accountType: 'Savings', balance: 12500.75, currency: 'USD', status: 'active' as const },
  { accountId: 'acc_personal_checking_002', accountName: 'Primary Checking', accountType: 'Checking', balance: 3450.20, currency: 'USD', status: 'active' as const },
];

const jointAccounts = [
  { accountId: 'acc_joint_family_001', accountName: 'Family Expenses', accountType: 'Joint', balance: 5800.00, currency: 'USD', status: 'active' as const },
  { accountId: 'acc_joint_vacation_002', accountName: 'Vacation Fund', accountType: 'Joint', balance: 1200.50, currency: 'USD', status: 'pending' as const },
];

const chartData = [
  { date: 'Jan', value: 1500 },
  { date: 'Feb', value: 1800 },
  { date: 'Mar', value: 1200 },
  { date: 'Apr', value: 2100 },
  { date: 'May', value: 1700 },
  { date: 'Jun', value: 2500 },
];

const DashboardPage: React.FC = () => {
  console.log('DashboardPage loaded');
  const navigate = useNavigate();

  const handleViewDetails = (accountId: string) => {
    // Differentiate between personal and joint account dashboards if routes differ
    if (accountId.includes('joint')) {
      navigate(`/joint-account-dashboard/${accountId}`);
    } else {
      navigate(`/account-details/${accountId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header title="MyBank Dashboard" />
      <ScrollArea className="flex-grow p-4 md:p-6 lg:p-8">
        <main className="space-y-8 mb-20"> {/* mb-20 for bottom nav space */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Personal Accounts</h2>
              <Button onClick={() => alert('Navigate to open new account page/modal')} className="bg-[#0051B4] hover:bg-[#00418A] text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Open New Account
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {personalAccounts.map(acc => (
                <AccountSummaryCard key={acc.accountId} {...acc} onViewDetails={() => handleViewDetails(acc.accountId)} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Joint Accounts</h2>
              <Button onClick={() => navigate('/joint-account-setup')} className="bg-[#0051B4] hover:bg-[#00418A] text-white">
                <Users className="mr-2 h-4 w-4" /> Setup Joint Account
              </Button>
            </div>
            {jointAccounts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jointAccounts.map(acc => (
                  <AccountSummaryCard key={acc.accountId} {...acc} onViewDetails={() => handleViewDetails(acc.accountId)} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No joint accounts yet. Start by setting one up!</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Financial Overview</h2>
            <InteractiveFinancialChart
              data={chartData}
              title="Monthly Spending Summary"
              description="Overview of your spending habits over the past 6 months."
              lineColor="#0051B4"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex space-x-4">
              <Button onClick={() => navigate('/payment')} variant="outline" size="lg">
                <Send className="mr-2 h-4 w-4" /> Make a Payment
              </Button>
              <Button onClick={() => alert('Navigate to statements page')} variant="outline" size="lg">
                View Statements
              </Button>
            </div>
          </section>
        </main>
      </ScrollArea>

      {/* Bottom Tab Bar Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/40 p-2 md:hidden">
        <div className="flex justify-around items-center">
          <Link to="/dashboard" className="flex flex-col items-center text-primary p-2 rounded-md hover:bg-muted">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/payment" className="flex flex-col items-center text-muted-foreground p-2 rounded-md hover:bg-muted">
            <Send className="h-6 w-6" />
            <span className="text-xs">Pay</span>
          </Link>
          <Link to="/account-details/acc_personal_checking_002" className="flex flex-col items-center text-muted-foreground p-2 rounded-md hover:bg-muted">
             {/* Placeholder to a specific account, or a general accounts list page */}
            <CreditCard className="h-6 w-6" />
            <span className="text-xs">Accounts</span>
          </Link>
          <button onClick={() => alert("Settings page")} className="flex flex-col items-center text-muted-foreground p-2 rounded-md hover:bg-muted">
            <Settings className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardPage;