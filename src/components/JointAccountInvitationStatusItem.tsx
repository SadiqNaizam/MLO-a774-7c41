import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, XCircle, CheckCircle2 } from 'lucide-react';

interface JointAccountInvitationStatusItemProps {
  inviteId: string;
  invitedUserEmail: string;
  invitedUserName?: string; // Optional, if available
  invitedUserAvatarUrl?: string;
  status: "pending" | "accepted" | "declined" | "expired";
  onResend?: (inviteId: string) => void;
  onCancel?: (inviteId: string) => void;
}

const JointAccountInvitationStatusItem: React.FC<JointAccountInvitationStatusItemProps> = ({
  inviteId,
  invitedUserEmail,
  invitedUserName,
  invitedUserAvatarUrl,
  status,
  onResend,
  onCancel,
}) => {
  console.log("Rendering JointAccountInvitationStatusItem for:", invitedUserEmail, "Status:", status);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const names = name.split(' ');
      return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  const statusConfig = {
    pending: { text: "Pending", variant: "secondary", icon: <Mail className="h-4 w-4 mr-1" /> },
    accepted: { text: "Accepted", variant: "success", icon: <CheckCircle2 className="h-4 w-4 mr-1" /> },
    declined: { text: "Declined", variant: "destructive", icon: <XCircle className="h-4 w-4 mr-1" /> },
    expired: { text: "Expired", variant: "outline", icon: <XCircle className="h-4 w-4 mr-1" /> },
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={invitedUserAvatarUrl} alt={invitedUserName || invitedUserEmail} />
          <AvatarFallback>{getInitials(invitedUserName, invitedUserEmail)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{invitedUserName || invitedUserEmail}</p>
          {invitedUserName && <p className="text-xs text-muted-foreground">{invitedUserEmail}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={currentStatus.variant as any} className="flex items-center">
          {currentStatus.icon}
          {currentStatus.text}
        </Badge>
        {status === 'pending' && onResend && (
          <Button variant="ghost" size="sm" onClick={() => onResend(inviteId)}>
            Resend
          </Button>
        )}
        {status === 'pending' && onCancel && (
          <Button variant="outline" size="sm" onClick={() => onCancel(inviteId)}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default JointAccountInvitationStatusItem;