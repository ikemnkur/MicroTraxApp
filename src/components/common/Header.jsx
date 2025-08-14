// src/components/common/Header.jsx
import React from 'react';
import { Users, DollarSign } from 'lucide-react';

const Header = ({ user }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Ad System</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded">
              <Users size={16} />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded">
              <DollarSign size={16} />
              <span>{user.credits} Credits</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;