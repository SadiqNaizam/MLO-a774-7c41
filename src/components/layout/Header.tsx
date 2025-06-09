import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, UserCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "MyBank" }) => {
  console.log("Rendering Header");
  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            {/* <Banknote className="h-6 w-6 text-primary" /> Replace with actual logo if available */}
            <span className="hidden font-bold sm:inline-block text-primary">{title}</span>
          </Link>
          {/* <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              to="/dashboard"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Dashboard
            </Link>
             Add other main navigation links here
          </nav> */}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          <Link to="/account-details"> {/* Or profile page */}
            <Button variant="ghost" size="icon" aria-label="User Profile">
              <UserCircle className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;