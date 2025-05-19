import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 md:ml-0 text-lg md:text-xl font-semibold text-gray-800">
              Lakeview Resort Admin
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-600 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="hidden md:block text-sm font-medium text-gray-700">
                Admin User
              </span>
              <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;