import React, { useState, useEffect } from 'react';
import { Building2, Image, Coffee, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

// StatCard Component
type StatCardProps = {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
};

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <div className={`flex items-center text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="font-medium">{change}</span>
        </div>
        <span className="text-sm text-gray-500 ml-2">from last month</span>
      </div>
    </div>
  );
};

// RecentBookingsTable Component
type RecentBookingsTableProps = {
  bookings: Array<any>;
  loading: boolean;
};

const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({ bookings, loading }) => {
  interface Booking {
    id: string | number;
    guestName: string;
    email: string;
    accommodation: string;
    checkIn: string;
    amount: string | number;
    status: string;
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  interface FormatDateOptions {
    month: 'short' | 'long' | 'numeric' | '2-digit';
    day: 'numeric' | '2-digit';
    year: 'numeric' | '2-digit';
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    } as FormatDateOptions);
  };

  interface FormatCurrencyProps {
    amount: string | number;
  }

  const formatCurrency = (amount: FormatCurrencyProps['amount']): string => {
    return `₹${parseFloat(amount as string).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading bookings...</p>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        No recent bookings found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Guest
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accommodation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Check-in
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {booking.guestName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {booking.email}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {booking.accommodation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(booking.checkIn)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(booking.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// QuickAccessCard Component
type QuickAccessCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  link: string;
  loading: boolean;
};

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, count, icon, link, loading }) => {
  return (
    <a 
      href={link}
      className="bg-white rounded-lg shadow p-4 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-2">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-8 w-12 rounded mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-blue-900 mt-1">{count}</p>
        )}
      </div>
    </a>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: '0',
    bookingChange: '+0%',
    occupancyRate: '0%',
    occupancyChange: '+0%',
    revenue: '₹0',
    revenueChange: '+0%',
    websiteVisitors: '0',
    visitorsChange: '+0%'
  });
  
  const [quickStats, setQuickStats] = useState({
    accommodations: 0,
    gallery: 0,
    services: 0,
    todayBookings: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const admin_BASE_URL = 'https://plumeriaadminback-production.up.railway.app/admin';

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${admin_BASE_URL}/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats');
    }
  };

  // Fetch quick access stats
  const fetchQuickStats = async () => {
    try {
      const response = await fetch(`${admin_BASE_URL}/dashboard/quick-stats`);
      if (!response.ok) throw new Error('Failed to fetch quick stats');
      const data = await response.json();
      setQuickStats(data);
    } catch (err) {
      console.error('Error fetching quick stats:', err);
      setError('Failed to load quick stats');
    }
  };

  // Fetch recent bookings
  const fetchRecentBookings = async () => {
    try {
      const response = await fetch(`${admin_BASE_URL}/dashboard/recent-bookings`);
      if (!response.ok) throw new Error('Failed to fetch recent bookings');
      const data = await response.json();
      setRecentBookings(data);
    } catch (err) {
      console.error('Error fetching recent bookings:', err);
      setError('Failed to load recent bookings');
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchQuickStats(),
        fetchRecentBookings()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Resort overview and performance metrics</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Bookings" 
          value={loading ? '...' : stats.totalBookings} 
          change={stats.bookingChange} 
          icon={<Calendar className="h-6 w-6 text-blue-600" />} 
          trend="up" 
        />
        <StatCard 
          title="Occupancy Rate" 
          value={loading ? '...' : stats.occupancyRate} 
          change={stats.occupancyChange} 
          icon={<Building2 className="h-6 w-6 text-amber-600" />} 
          trend="up" 
        />
        <StatCard 
          title="Revenue" 
          value={loading ? '...' : stats.revenue} 
          change={stats.revenueChange} 
          icon={<DollarSign className="h-6 w-6 text-green-600" />} 
          trend="up" 
        />
        <StatCard 
          title="Website Visitors" 
          value={loading ? '...' : stats.websiteVisitors} 
          change={stats.visitorsChange} 
          icon={<Users className="h-6 w-6 text-indigo-600" />} 
          trend="up" 
        />
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickAccessCard 
          title="Accommodations" 
          count={quickStats.accommodations} 
          icon={<Building2 className="h-10 w-10 text-blue-600" />} 
          link="/accommodations" 
          loading={loading}
        />
        <QuickAccessCard 
          title="Gallery" 
          count={quickStats.gallery} 
          icon={<Image className="h-10 w-10 text-purple-600" />} 
          link="/gallery" 
          loading={loading}
        />
        <QuickAccessCard 
          title="Services" 
          count={quickStats.services} 
          icon={<Coffee className="h-10 w-10 text-amber-600" />} 
          link="/services" 
          loading={loading}
        />
        <QuickAccessCard 
          title="Today's Bookings" 
          count={quickStats.todayBookings} 
          icon={<Calendar className="h-10 w-10 text-green-600" />} 
          link="/bookings" 
          loading={loading}
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Bookings</h3>
          <p className="mt-1 text-sm text-gray-500">Latest 5 bookings from guests</p>
        </div>
        <RecentBookingsTable bookings={recentBookings} loading={loading} />
      </div>

      {/* Revenue Trend Placeholder */}
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

export default Dashboard;