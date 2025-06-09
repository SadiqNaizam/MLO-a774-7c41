import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

const paymentSchema = z.object({
  sourceAccount: z.string().min(1, "Please select a source account"),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientAccount: z.string().regex(/^\d{8,12}$/, "Enter a valid account number (8-12 digits)"),
  amount: z.coerce.number().positive("Amount must be positive"),
  reference: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const availableAccounts = [
  { id: 'acc_personal_checking_002', name: 'Primary Checking (Balance: $3,450.20)', balance: 3450.20 },
  { id: 'acc_joint_family_001', name: 'Family Expenses (Balance: $5,800.00)', balance: 5800.00 },
];

const PaymentInitiationPage: React.FC = () => {
  const [step, setStep] = useState(1); // 1 for form, 2 for review
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { reference: "Online Payment" }
  });

  const paymentData = watch();

  console.log('PaymentInitiationPage loaded');

  const onSubmitForm: SubmitHandler<PaymentFormData> = (data) => {
    console.log('Payment form data:', data);
    const selectedAccount = availableAccounts.find(acc => acc.id === data.sourceAccount);
    if (selectedAccount && data.amount > selectedAccount.balance) {
        toast.error("Insufficient funds in selected account.");
        return;
    }
    setStep(2); // Move to review step
  };

  const handleConfirmPayment = () => {
    console.log('Payment confirmed:', paymentData);
    setShowConfirmationDialog(true);
    // Actual API call would happen here
  };
  
  const selectedAccountName = availableAccounts.find(acc => acc.id === paymentData.sourceAccount)?.name || 'N/A';

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header title="Make a Payment" />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 flex-grow">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>{step === 1 ? 'Payment Details' : 'Review Your Payment'}</CardTitle>
            {step === 1 && <CardDescription>Enter the details for your payment or transfer.</CardDescription>}
            {step === 2 && <CardDescription>Please check the details carefully before confirming.</CardDescription>}
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                <div>
                  <Label htmlFor="sourceAccount">From Account</Label>
                  <Controller
                    name="sourceAccount"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="sourceAccount">
                          <SelectValue placeholder="Select source account" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAccounts.map(acc => (
                            <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.sourceAccount && <p className="text-sm text-red-500 mt-1">{errors.sourceAccount.message}</p>}
                </div>

                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Controller
                    name="recipientName"
                    control={control}
                    render={({ field }) => <Input id="recipientName" placeholder="John Doe" {...field} />}
                  />
                  {errors.recipientName && <p className="text-sm text-red-500 mt-1">{errors.recipientName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="recipientAccount">Recipient Account Number</Label>
                  <Controller
                    name="recipientAccount"
                    control={control}
                    render={({ field }) => <Input id="recipientAccount" placeholder="1234567890" {...field} />}
                  />
                  {errors.recipientAccount && <p className="text-sm text-red-500 mt-1">{errors.recipientAccount.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => <Input id="amount" type="number" step="0.01" placeholder="0.00" {...field} />}
                  />
                  {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <Label htmlFor="reference">Reference (Optional)</Label>
                   <Controller
                    name="reference"
                    control={control}
                    render={({ field }) => <Input id="reference" placeholder="e.g., Rent Payment" {...field} />}
                  />
                </div>
                <Button type="submit" className="w-full bg-[#0051B4] hover:bg-[#00418A] text-white">Continue to Review</Button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                    <p><strong>From:</strong> {selectedAccountName}</p>
                    <p><strong>To:</strong> {paymentData.recipientName} ({paymentData.recipientAccount})</p>
                    <p><strong>Amount:</strong> USD {paymentData.amount?.toFixed(2)}</p>
                    <p><strong>Reference:</strong> {paymentData.reference || 'N/A'}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Edit Details
                    </Button>
                    <Button onClick={handleConfirmPayment} className="w-full sm:flex-1 bg-[#0051B4] hover:bg-[#00418A] text-white">Confirm Payment</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Successful!</DialogTitle>
            <DialogDescription>
              Your payment of USD {paymentData.amount?.toFixed(2)} to {paymentData.recipientName} has been processed.
              A confirmation email has been sent.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button onClick={() => {
                    navigate('/dashboard');
                    toast.success("Payment processed successfully!");
                }} className="bg-[#0051B4] hover:bg-[#00418A] text-white">
                Done
                </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentInitiationPage;