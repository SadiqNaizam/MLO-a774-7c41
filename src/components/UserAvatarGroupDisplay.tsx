import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  isPlaceholder?: boolean; // For invited but not yet joined users
}

interface UserAvatarGroupDisplayProps {
  users: User[];
  maxDisplayed?: number;
}

const UserAvatarGroupDisplay: React.FC<UserAvatarGroupDisplayProps> = ({ users, maxDisplayed = 3 }) => {
  console.log("Rendering UserAvatarGroupDisplay for users:", users.length);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayedUsers = users.slice(0, maxDisplayed);
  const remainingCount = users.length - displayedUsers.length;

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {displayedUsers.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className={`border-2 ${user.isPlaceholder ? 'border-dashed border-muted-foreground' : 'border-background'}`}>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className={user.isPlaceholder ? 'text-muted-foreground' : ''}>
                  {user.isPlaceholder ? '?' : getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.isPlaceholder ? "Invited" : user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-background">
                <AvatarFallback>+{remainingCount}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{remainingCount} more member(s)</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default UserAvatarGroupDisplay;