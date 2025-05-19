import React from 'react';
import { Building2, Image, Coffee, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentBookingsTable from '../components/RecentBookingsTable';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Resort overview and performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Bookings" 
          value="158" 
          change="+12%" 
          icon={<Calendar className="h-6 w-6 text-blue-600" />} 
          trend="up" 
        />
        <StatCard 
          title="Occupancy Rate" 
          value="72%" 
          change="+8%" 
          icon={<Building2 className="h-6 w-6 text-amber-600" />} 
          trend="up" 
        />
        <StatCard 
          title="Revenue" 
          value="₹385,200" 
          change="+15%" 
          icon={<DollarSign className="h-6 w-6 text-green-600" />} 
          trend="up" 
        />
        <StatCard 
          title="Website Visitors" 
          value="2,450" 
          change="+22%" 
          icon={<Users className="h-6 w-6 text-indigo-600" />} 
          trend="up" 
        />
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickAccessCard 
          title="Accommodations" 
          count="12" 
          icon={<Building2 className="h-10 w-10 text-blue-600" />} 
          link="/accommodations" 
        />
        <QuickAccessCard 
          title="Gallery" 
          count="48" 
          icon={<Image className="h-10 w-10 text-purple-600" />} 
          link="/gallery" 
        />
        <QuickAccessCard 
          title="Services" 
          count="8" 
          icon={<Coffee className="h-10 w-10 text-amber-600" />} 
          link="/services" 
        />
        <QuickAccessCard 
          title="Today's Bookings" 
          count="5" 
          icon={<Calendar className="h-10 w-10 text-green-600" />} 
          link="/bookings" 
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Bookings</h3>
          <p className="mt-1 text-sm text-gray-500">Latest 5 bookings from guests</p>
        </div>
        <RecentBookingsTable />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Revenue Trend</h3>
              <p className="mt-1 text-sm text-gray-500">Last 7 days performance</p>
            </div>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <div className="p-4 h-64 flex items-center justify-center">
          <p className="text-gray-500">Revenue chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

const QuickAccessCard: React.FC<{
  title: string;
  count: string;
  icon: React.ReactNode;
  link: string;
}> = ({ title, count, icon, link }) => {
  return (
    <a 
      href={link}
      className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-2">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-2xl font-bold text-blue-900 mt-1">{count}</p>
      </div>
    </a>
  );
};

export default Dashboard;