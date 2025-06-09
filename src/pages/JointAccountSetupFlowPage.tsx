import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import UserAvatarGroupDisplay from '@/components/UserAvatarGroupDisplay';
import PermissionSettingControl from '@/components/PermissionSettingControl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from "sonner";

const steps = [
  { id: 1, name: 'Account Details' },
  { id: 2, name: 'Invite Partner' },
  { id: 3, name: 'Set Permissions' },
  { id: 4, name: 'Review & Confirm' },
];

const accountDetailsSchema = z.object({
  jointAccountName: z.string().min(3, "Account name must be at least 3 characters"),
});
const invitePartnerSchema = z.object({
  partnerEmail: z.string().email("Invalid email address"),
});
// Permissions schema could be more complex, for now let's assume direct state management

type AccountDetailsFormData = z.infer<typeof accountDetailsSchema>;
type InvitePartnerFormData = z.infer<typeof invitePartnerSchema>;

const JointAccountSetupFlowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jointAccountName: '',
    partnerEmail: '',
    permissions: {
      canWithdraw: true,
      transactionLimit: 500,
      accessLevel: 'full_access',
    }
  });

  const { control: accountDetailsControl, handleSubmit: handleAccountDetailsSubmit, formState: { errors: accountDetailsErrors } } = useForm<AccountDetailsFormData>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues: { jointAccountName: formData.jointAccountName }
  });
  const { control: invitePartnerControl, handleSubmit: handleInvitePartnerSubmit, formState: { errors: invitePartnerErrors } } = useForm<InvitePartnerFormData>({
    resolver: zodResolver(invitePartnerSchema),
    defaultValues: { partnerEmail: formData.partnerEmail }
  });

  console.log(`JointAccountSetupFlowPage loaded, current step: ${currentStep}`);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step submission
      console.log('Submitting joint account setup:', formData);
      setShowConfirmationDialog(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const onAccountDetailsSubmit: SubmitHandler<AccountDetailsFormData> = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    handleNext();
  };

  const onInvitePartnerSubmit: SubmitHandler<InvitePartnerFormData> = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    toast.success(`Invitation sent to ${data.partnerEmail}`);
    handleNext();
  };

  const handlePermissionChange = (permissionId: string, value: boolean | string | number) => {
    setFormData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [permissionId]: value },
    }));
  };

  const progressValue = (currentStep / steps.length) * 100;

  const invitedUsers = formData.partnerEmail ? [
    { id: 'user_self', name: 'You', avatarUrl: 'https://placehold.co/40x40/E0E0E0/7F7F7F?text=Me' },
    { id: 'user_invited', name: formData.partnerEmail, avatarUrl: 'https://placehold.co/40x40/D3D3D3/A9A9A9?text=?', isPlaceholder: true },
  ] : [{ id: 'user_self', name: 'You', avatarUrl: 'https://placehold.co/40x40/E0E0E0/7F7F7F?text=Me' }];


  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header title="Setup New Joint Account" />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].name}</CardTitle>
            <Progress value={progressValue} className="w-full mt-2" />
            <CardDescription className="mt-2">
              {currentStep === 1 && "Let's start with a name for your shared account."}
              {currentStep === 2 && "Invite someone to share this account with."}
              {currentStep === 3 && "Define how you and your partner will use this account."}
              {currentStep === 4 && "Please review the details before creating the account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <form onSubmit={handleAccountDetailsSubmit(onAccountDetailsSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="jointAccountName">Joint Account Name</Label>
                  <Controller
                    name="jointAccountName"
                    control={accountDetailsControl}
                    render={({ field }) => <Input id="jointAccountName" placeholder="e.g., Holiday Fund, Household Expenses" {...field} />}
                  />
                  {accountDetailsErrors.jointAccountName && <p className="text-sm text-red-500 mt-1">{accountDetailsErrors.jointAccountName.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-[#0051B4] hover:bg-[#00418A] text-white">Next</Button>
              </form>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleInvitePartnerSubmit(onInvitePartnerSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="partnerEmail">Partner's Email Address</Label>
                   <Controller
                    name="partnerEmail"
                    control={invitePartnerControl}
                    render={({ field }) => <Input id="partnerEmail" type="email" placeholder="partner@example.com" {...field} />}
                  />
                  {invitePartnerErrors.partnerEmail && <p className="text-sm text-red-500 mt-1">{invitePartnerErrors.partnerEmail.message}</p>}
                </div>
                {formData.partnerEmail && (
                    <div className="mt-4">
                        <Label>Account Members</Label>
                        <UserAvatarGroupDisplay users={invitedUsers} />
                    </div>
                )}
                <Button type="submit" className="w-full bg-[#0051B4] hover:bg-[#00418A] text-white">Send Invitation & Next</Button>
              </form>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <PermissionSettingControl
                  permissionId="canWithdraw"
                  label="Allow partner to make withdrawals"
                  type="toggle"
                  currentValue={formData.permissions.canWithdraw}
                  onChange={(value) => handlePermissionChange('canWithdraw', value as boolean)}
                  activeColor="#00A8E1"
                />
                <PermissionSettingControl
                  permissionId="transactionLimit"
                  label="Partner's individual transaction limit"
                  type="limit"
                  currentValue={formData.permissions.transactionLimit}
                  limitRange={[50, 2000]}
                  onChange={(value) => handlePermissionChange('transactionLimit', value as number)}
                  activeColor="#00A8E1"
                />
                <PermissionSettingControl
                  permissionId="accessLevel"
                  label="Partner's access level"
                  type="role"
                  currentValue={formData.permissions.accessLevel}
                  options={[
                    { value: 'full_access', label: 'Full Access (View, Transact, Manage)' },
                    { value: 'transact_only', label: 'Transact Only (View, Transact)' },
                    { value: 'view_only', label: 'View Only' },
                  ]}
                  onChange={(value) => handlePermissionChange('accessLevel', value as string)}
                  activeColor="#00A8E1"
                />
                 <Button onClick={handleNext} className="w-full bg-[#0051B4] hover:bg-[#00418A] text-white">Next</Button>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Review Your Selections:</h3>
                <p><strong>Account Name:</strong> {formData.jointAccountName}</p>
                <p><strong>Invited Partner:</strong> {formData.partnerEmail}</p>
                <h4 className="font-medium mt-2">Permissions for Partner:</h4>
                <ul className="list-disc list-inside ml-4 text-sm">
                  <li>Withdrawals Allowed: {formData.permissions.canWithdraw ? 'Yes' : 'No'}</li>
                  <li>Transaction Limit: ${formData.permissions.transactionLimit.toLocaleString()}</li>
                  <li>Access Level: {formData.permissions.accessLevel.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</li>
                </ul>
                <Button onClick={handleNext} className="w-full bg-[#0051B4] hover:bg-[#00418A] text-white">Create Joint Account</Button>
              </div>
            )}
            
            {currentStep > 1 && currentStep <= steps.length && (
              <Button variant="outline" onClick={handlePrev} className="w-full mt-4">
                Previous
              </Button>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Joint Account Setup Initiated!</DialogTitle>
            <DialogDescription>
              Your joint account "{formData.jointAccountName}" has been initiated.
              An invitation has been sent to {formData.partnerEmail}. The account will become fully active once your partner accepts the invitation and completes any required steps.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setShowConfirmationDialog(false);
              navigate('/dashboard'); // Or to a specific joint account pending page
              toast.success("Joint account setup process completed!");
            }} className="bg-[#0051B4] hover:bg-[#00418A] text-white">
              Return to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JointAccountSetupFlowPage;