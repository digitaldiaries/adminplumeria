import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Download, Filter, Search, XCircle, DollarSign, Calendar, CreditCard, User, Plus } from 'lucide-react';
import BookingDetailsModal from '../components/BookingDetailsModal';
import AddPaymentModal from '../components/AddPaymentModal';

interface ApiBooking {
  id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  food_veg: number;
  food_nonveg: number;
  food_jain: number;
  accommodation_name: string | null;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rooms: number;
  total_amount: string;
  advance_amount: string;
  payment_status: string;
  payment_txn_id: string | null;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data: ApiBooking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface Booking {
  id: number;
  bookingId: string;
  guest: string;
  email: string;
  phone: string;
  veg: number;
  nonVeg:number;
  jainCount: number;
  accommodation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  rooms: number;
  amount: string;
  paidAmount: string;
  remainingAmount: string; // Added remaining amount
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'Pending';
  bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
  paymentTxnId: string | null;
  createdAt: string;
  rawData?: ApiBooking;
}

interface FilterOptions {
  search?: string;
  status?: string;
  payment_status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
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

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1
  });

  const API_BASE_URL = 'https://a.plumeriaretreat.com/admin';

  const mapApiBookingToBooking = (apiBooking: ApiBooking): Booking => {
    let paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'Pending' = 'Pending';
    
    // Handle empty payment_status as Pending
    switch (apiBooking.payment_status) {
      case 'success':
        paymentStatus = 'Paid';
        break;
      case 'partial':
        paymentStatus = 'Partial';
        break;
      case 'failed':
        paymentStatus = 'Unpaid';
        break;
      case '':
      default:
        paymentStatus = 'Pending';
    }

    const bookingStatus = 'Confirmed';
    
    const totalAmount = parseFloat(apiBooking.total_amount);
    const paidAmount = parseFloat(apiBooking.advance_amount);
    const remainingAmount = totalAmount - paidAmount;

    return {
      id: apiBooking.id,
      bookingId: `BK-${apiBooking.id.toString().padStart(4, '0')}`,
      guest: apiBooking.guest_name,
      email: apiBooking.guest_email,
      phone: apiBooking.guest_phone,
      veg: apiBooking.food_veg,
      nonVeg: apiBooking.food_nonveg,
      jainCount: apiBooking.food_jain,
      accommodation: apiBooking.accommodation_name || 'Not specified',
      checkIn: new Date(apiBooking.check_in).toLocaleDateString('en-IN'),
      checkOut: new Date(apiBooking.check_out).toLocaleDateString('en-IN'),
      guests: apiBooking.adults + apiBooking.children,
      adults: apiBooking.adults,
      children: apiBooking.children,
      rooms: apiBooking.rooms,
      amount: `₹${totalAmount.toLocaleString('en-IN')}`,
      paidAmount: `₹${paidAmount.toLocaleString('en-IN')}`,
      remainingAmount: `₹${remainingAmount.toLocaleString('en-IN')}`, // Added remaining amount
      paymentStatus,
      bookingStatus,
      paymentTxnId: apiBooking.payment_txn_id,
      createdAt: new Date(apiBooking.created_at).toLocaleString('en-IN'),
      rawData: apiBooking
    };
  };

  const fetchBookings = async (filterParams: FilterOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...filterParams,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/bookings`, { params });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        const mappedBookings = response.data.data.map(mapApiBookingToBooking);
        setBookings(mappedBookings);
        setPagination(response.data.pagination);
      } else {
        console.warn('Unexpected API response structure', response.data);
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, [pagination.page, pagination.limit]);

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

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleOpenDetails = (id: number) => {
    setSelectedBooking(id);
  };

  const handleOpenPaymentModal = (id: number) => {
    setBookingForPayment(id);
    setPaymentModalOpen(true);
  };

  const handlePaymentAdded = () => {
    fetchBookings(filters);
  };

  const exportToCSV = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/export/csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
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

  // Create a compatible booking object for the modal
  const getModalCompatibleBooking = (booking: Booking) => {
    return {
      ...booking,
      paymentStatus: booking.paymentStatus === 'Pending' ? 'Unpaid' : booking.paymentStatus
    };
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
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
    );
  }

  return (
  <div className="flex flex-col h-screen">
    {/* Header */}
    <div className="bg-white shadow-sm z-10">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Showing {bookings.length} of {pagination.total} bookings
            </p>
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
      </div>
    </div>

    {/* Main Content - Scrollable Area */}
    <div className="flex-1 overflow-y-auto overflow-x-auto">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
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
          <div className="bg-white p-4 rounded-md shadow space-y-4 mb-6">
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
                  <option value="success">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="failed">Unpaid</option>
                  <option value="">Pending</option>
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
          <div className="text-center py-2 mb-6">
            <div className="inline-flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-navy-600 mr-2"></div>
              Loading...
            </div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food Preference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Accommodation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                      <button>{booking.bookingId}</button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{booking.guest}</span>
                        <span className="text-xs text-gray-500">{booking.email}</span>
                        <span className="text-xs text-gray-500">{booking.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>Adult guests: <span>{booking.adults}</span></span>
                        <span>Chilldren guests: <span>{booking.children}</span></span>
                        <span>Veg Count: <span>{booking.veg}</span></span>
                        <span>Non-Veg Count: <span>{booking.nonVeg}</span></span>
                        <span>Jain Count: <span>{booking.jainCount}</span></span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {booking.accommodation}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                      {booking.checkIn}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {booking.checkOut}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {booking.paidAmount}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <span
                        className={
                          booking.paymentStatus === 'Paid'
                            ? 'text-green-600'
                            : booking.paymentStatus === 'Partial'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }
                      >
                        {booking.remainingAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.paymentStatus === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : booking.paymentStatus === 'Partial'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.paymentStatus === 'Pending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenPaymentModal(booking.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Add Payment"
                        >
                          <DollarSign className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">First</span>
                    &laquo;
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    &lsaquo;
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'z-10 bg-navy-50 border-navy-500 text-navy-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    &rsaquo;
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Last</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

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
    </div>

    {/* Modals */}
    {selectedBooking !== null && bookings.find((b) => b.id === selectedBooking) && (
      <BookingDetailsModal
        booking={getModalCompatibleBooking(bookings.find((b) => b.id === selectedBooking)!)}
        onClose={() => setSelectedBooking(null)}
      />
    )}

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