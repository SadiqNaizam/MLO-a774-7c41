import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import InteractiveFinancialChart from '@/components/InteractiveFinancialChart';
import UserAvatarGroupDisplay from '@/components/UserAvatarGroupDisplay';
import JointAccountInvitationStatusItem from '@/components/JointAccountInvitationStatusItem';
import PermissionSettingControl from '@/components/PermissionSettingControl'; // Re-using for settings tab
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

// Placeholder data
const jointAccountData: { [key: string]: any } = {
  'acc_joint_family_001': { 
    accountId: 'acc_joint_family_001', 
    accountName: 'Family Expenses', 
    accountType: 'Joint', 
    balance: 5800.00, 
    currency: 'USD', 
    status: 'active' as const,
    members: [
      { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40/FFC0CB/000000?text=AW' },
      { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/40x40/ADD8E6/000000?text=BB' },
    ],
    transactions: [
      { id: 'jtxn_1', date: '2024-07-20', description: 'Groceries - SuperMart', amount: -150.25, member: 'Alice Wonderland' },
      { id: 'jtxn_2', date: '2024-07-18', description: 'Electricity Bill', amount: -85.00, member: 'Bob The Builder' },
    ],
    invitations: [
      { inviteId: 'invite_001', invitedUserEmail: 'charlie@example.com', status: 'pending' as const },
    ],
    permissions: { // Example structure for a member's permissions
      'user2': { // Bob's permissions
        transactionLimit: 1000,
        canInvite: false,
      }
    },
    chartData: [ { date: 'May', value: 1200 }, { date: 'Jun', value: 1500 }, { date: 'Jul', value: 900 }]
  },
  'acc_joint_vacation_002': { 
    accountId: 'acc_joint_vacation_002', 
    accountName: 'Vacation Fund', 
    accountType: 'Joint', 
    balance: 1200.50, 
    currency: 'USD', 
    status: 'pending' as const, // Partner acceptance pending
    members: [
      { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/40x40/FFC0CB/000000?text=AW' },
      { id: 'user_pending', name: 'Invited Partner', isPlaceholder: true },
    ],
    transactions: [],
    invitations: [
        { inviteId: 'invite_002', invitedUserEmail: 'pending.partner@example.com', status: 'pending' as const, invitedUserName: "Pending Partner" },
    ],
    chartData: []
  },
};


const JointAccountDashboardPage: React.FC = () => {
  const { accountId = 'acc_joint_family_001' } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const currentAccount = jointAccountData[accountId];

  console.log(`JointAccountDashboardPage loaded for account: ${accountId}`);

  if (!currentAccount) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Account Not Found" />
        <main className="flex-grow flex items-center justify-center">
          <p>The joint account details could not be found.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">Go to Dashboard</Button>
        </main>
      </div>
    );
  }

  const handleResendInvite = (inviteId: string) => {
    toast.info(`Resending invitation ID: ${inviteId}`);
    // API call logic here
  };

  const handleCancelInvite = (inviteId: string) => {
    toast.warning(`Cancelling invitation ID: ${inviteId}`);
    // API call logic here
  };
  
  // Dummy state for permission control example
  const [memberPermissions, setMemberPermissions] = React.useState(currentAccount.permissions['user2'] || { transactionLimit: 500, canInvite: false });
  const handlePermissionChange = (key: string, value: any) => {
    setMemberPermissions(prev => ({...prev, [key]: value}));
    toast.success(`Permission for ${key} updated to ${value}`);
  }


  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header title={currentAccount.accountName} />
      <ScrollArea className="flex-grow p-4 md:p-6 lg:p-8">
        <main className="space-y-6">
          <AccountSummaryCard {...currentAccount} onViewDetails={() => navigate(`/account-details/${accountId}`)} />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <InteractiveFinancialChart
                data={currentAccount.chartData}
                title="Joint Account Activity"
                description="Spending and saving trends for this account."
                lineColor="#00A8E1" // Bright Cyan
              />
              {/* Other overview widgets */}
              <div className="text-center">
                <Button onClick={() => navigate('/payment')} className="bg-[#0051B4] hover:bg-[#00418A] text-white">Make a Joint Payment</Button>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
               <div className="bg-background rounded-lg border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentAccount.transactions.length > 0 ? currentAccount.transactions.map((tx: any) => (
                        <TableRow key={tx.id}>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell className="font-medium">{tx.description}</TableCell>
                        <TableCell>{tx.member}</TableCell>
                        <TableCell className={`text-right ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.amount > 0 ? '+' : ''}{currentAccount.currency} {Math.abs(tx.amount).toFixed(2)}
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No transactions yet for this joint account.</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
               </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Account Members</h3>
                <Button variant="outline" size="sm" onClick={() => alert("Open invite new member modal/page")}>Invite New Member</Button>
              </div>
              <UserAvatarGroupDisplay users={currentAccount.members} maxDisplayed={5} />
              
              {currentAccount.invitations && currentAccount.invitations.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-2">Pending Invitations</h4>
                  <div className="border rounded-md">
                    {currentAccount.invitations.map((invite: any) => (
                      <JointAccountInvitationStatusItem
                        key={invite.inviteId}
                        {...invite}
                        onResend={handleResendInvite}
                        onCancel={handleCancelInvite}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h3 className="text-lg font-semibold">Account Settings & Permissions</h3>
              {/* Example: Adjusting permissions for one member. In a real app, this would be more dynamic. */}
              {currentAccount.members.find((m:any) => m.id === 'user2') && (
                <Card>
                    <CardHeader>
                        <CardTitle>Permissions for {currentAccount.members.find((m:any) => m.id === 'user2').name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PermissionSettingControl
                            permissionId="transactionLimit"
                            label="Transaction Limit"
                            type="limit"
                            currentValue={memberPermissions.transactionLimit}
                            limitRange={[100, 5000]}
                            onChange={(val) => handlePermissionChange('transactionLimit', val)}
                        />
                         <PermissionSettingControl
                            permissionId="canInvite"
                            label="Can Invite Others"
                            type="toggle"
                            currentValue={memberPermissions.canInvite}
                            onChange={(val) => handlePermissionChange('canInvite', val)}
                        />
                        <Button onClick={() => toast.success("Permissions saved (simulated).")} className="bg-[#0051B4] hover:bg-[#00418A] text-white">Save Permissions</Button>
                    </CardContent>
                </Card>
              )}
               <Button variant="destructive" onClick={() => alert("Prompt for closing joint account")}>Close Joint Account</Button>
            </TabsContent>
          </Tabs>
        </main>
      </ScrollArea>
    </div>
  );
};

export default JointAccountDashboardPage;