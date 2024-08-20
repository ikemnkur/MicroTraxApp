import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transaction History', path: '/transactions' },
    { name: 'Send Money', path: '/send' },
    { name: 'Received Payments', path: '/received' },
    { name: 'Reload Wallet', path: '/reload' },
    { name: 'Withdraw', path: '/withdraw' },
    { name: 'Search User', path: '/search' },
    { name: 'Share Wallet', path: '/share' },
    { name: 'Messages', path: '/messages' },
    { name: 'Account', path: '/account' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">MicroPay</h1>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <nav className="bg-secondary hidden md:block">
        <div className="container mx-auto">
          <ul className="flex space-x-4 p-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="text-secondary-foreground hover:text-primary">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-secondary text-secondary-foreground p-4">
        <div className="container mx-auto text-center">
          © 2024 MicroPay. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
