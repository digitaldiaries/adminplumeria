import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, Search, XCircle, DollarSign, Calendar, CreditCard, User, Plus } from 'lucide-react';
import BookingDetailsModal from '../components/BookingDetailsModal';
import AddPaymentModal from '../components/AddPaymentModal';

// Define types based on the backend response
interface Booking {
  id: number;
  bookingId: string;
  guest: string;
  email: string;
  phone: string;
  accommodation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  rooms: number;
  amount: string;
  paidAmount: string;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
  rawData?: any;
}

interface FilterOptions {
  search?: string;
  status?: string;
  payment_status?: string;
  start_date?: string;
  end_date?: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [bookingForPayment, setBookingForPayment] = useState<number | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('');

  // API base URL - adjust this to match your backend
  const API_BASE_URL = 'https://plumeriaadminback-production.up.railway.app/admin';

  // Fetch bookings from API
  const fetchBookings = async (filterParams: FilterOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      
      if (filterParams.search) queryParams.append('search', filterParams.search);
      if (filterParams.status) queryParams.append('status', filterParams.status.toLowerCase());
      if (filterParams.payment_status) queryParams.append('payment_status', filterParams.payment_status.toLowerCase());
      if (filterParams.start_date) queryParams.append('start_date', filterParams.start_date);
      if (filterParams.end_date) queryParams.append('end_date', filterParams.end_date);
      
      const url = `${API_BASE_URL}/bookings${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, []);

  // Apply filters with debounce for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        fetchBookings({ ...filters, search: searchTerm });
      } else {
        fetchBookings(filters);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleApplyFilters = () => {
    const newFilters: FilterOptions = {};
    
    if (startDate) newFilters.start_date = startDate;
    if (endDate) newFilters.end_date = endDate;
    if (paymentStatusFilter) newFilters.payment_status = paymentStatusFilter;
    if (bookingStatusFilter) newFilters.status = bookingStatusFilter;
    if (searchTerm) newFilters.search = searchTerm;
    
    setFilters(newFilters);
    fetchBookings(newFilters);
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setPaymentStatusFilter('');
    setBookingStatusFilter('');
    setSearchTerm('');
    setFilters({});
    fetchBookings();
  };

  const handleOpenDetails = (id: number) => {
    setSelectedBooking(id);
  };

  const handleOpenPaymentModal = (id: number) => {
    setBookingForPayment(id);
    setPaymentModalOpen(true);
  };

  const handlePaymentAdded = () => {
    // Refresh bookings after payment is added
    fetchBookings(filters);
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/export/csv`);
      
      if (!response.ok) {
        throw new Error('Failed to export bookings');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bookings.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting bookings:', err);
      alert('Failed to export bookings. Please try again.');
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
        </div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div className="text-center py-10">
          <div className="mx-auto h-12 w-12 text-red-400">
            <XCircle className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading bookings</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button 
            onClick={() => fetchBookings()}
            className="mt-4 px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage all bookings and reservations</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/bookings/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Link>
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white p-4 rounded-md shadow space-y-4">
          <h3 className="font-medium text-gray-700">Filter Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="To"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select 
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Status</label>
              <select 
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator for filtering */}
      {loading && bookings.length > 0 && (
        <div className="text-center py-2">
          <div className="inline-flex items-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy-600 mr-2"></div>
            Loading...
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Booking ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Guest
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Accommodation
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Check In
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                >
                  Check Out
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-blue-600">
                    <button 
                      onClick={() => handleOpenDetails(booking.id)} 
                      className="hover:underline"
                    >
                      {booking.bookingId}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {booking.guest}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {booking.accommodation}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    {booking.checkIn}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    {booking.checkOut}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {booking.amount}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : booking.paymentStatus === 'Partial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.bookingStatus === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.bookingStatus === 'Pending'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <button
                      onClick={() => handleOpenPaymentModal(booking.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Add Payment"
                    >
                      <span className="sr-only">Add Payment</span>
                      <DollarSign className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && !loading && (
          <div className="text-center py-10">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.keys(filters).length > 0 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating your first booking.'}
            </p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking !== null && bookings.find((b) => b.id === selectedBooking) && (
        <BookingDetailsModal
          booking={bookings.find((b) => b.id === selectedBooking)!}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* Add Payment Modal */}
      {paymentModalOpen && bookingForPayment !== null && (
        <AddPaymentModal
          booking={bookings.find((b) => b.id === bookingForPayment)!}
          onClose={() => {
            setPaymentModalOpen(false);
            setBookingForPayment(null);
          }}
          onPaymentAdded={handlePaymentAdded}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
};

export default Bookings;