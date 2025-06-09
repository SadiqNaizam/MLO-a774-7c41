import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";
import JointAccountSetupFlowPage from "./pages/JointAccountSetupFlowPage";
import JointAccountDashboardPage from "./pages/JointAccountDashboardPage";
import PaymentInitiationPage from "./pages/PaymentInitiationPage";
import NotFound from "./pages/NotFound"; // Assuming NotFound.tsx exists in src/pages/

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" /> {/* Added Sonner config */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} /> {/* Assuming Dashboard is the home page */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/account-details/:accountId" element={<AccountDetailsPage />} />
          <Route path="/account-details" element={<AccountDetailsPage />} /> {/* Fallback if no ID */}
          <Route path="/joint-account-setup" element={<JointAccountSetupFlowPage />} />
          <Route path="/joint-account-dashboard/:accountId" element={<JointAccountDashboardPage />} />
          <Route path="/joint-account-dashboard/" element={<JointAccountDashboardPage />} /> {/* Fallback if no ID */}
          <Route path="/payment" element={<PaymentInitiationPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} /> {/* Always Include This Line As It Is. */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;