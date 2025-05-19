import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Filter, Search, XCircle, DollarSign, Calendar, CreditCard, User, Plus } from 'lucide-react';
import BookingDetailsModal from '../components/BookingDetailsModal';
import AddPaymentModal from '../components/AddPaymentModal';

const Bookings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [bookingForPayment, setBookingForPayment] = useState<number | null>(null);

  const bookings = [
    {
      id: 1,
      bookingId: 'B12345',
      guest: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      accommodation: 'Lake View Villa',
      checkIn: '2025-05-22',
      checkOut: '2025-05-25',
      guests: 2,
      amount: '₹38,500',
      paidAmount: '₹19,250',
      paymentStatus: 'Partial',
      bookingStatus: 'Confirmed',
    },
    {
      id: 2,
      bookingId: 'B12346',
      guest: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 87654 32109',
      accommodation: 'Garden Suite',
      checkIn: '2025-05-23',
      checkOut: '2025-05-27',
      guests: 2,
      amount: '₹25,200',
      paidAmount: '₹0',
      paymentStatus: 'Unpaid',
      bookingStatus: 'Pending',
    },
    {
      id: 3,
      bookingId: 'B12347',
      guest: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '+91 76543 21098',
      accommodation: 'Mountain View Cottage',
      checkIn: '2025-05-24',
      checkOut: '2025-05-26',
      guests: 3,
      amount: '₹18,900',
      paidAmount: '₹18,900',
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
    },
    {
      id: 4,
      bookingId: 'B12348',
      guest: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 65432 10987',
      accommodation: 'Family Bungalow',
      checkIn: '2025-05-25',
      checkOut: '2025-05-30',
      guests: 5,
      amount: '₹52,000',
      paidAmount: '₹52,000',
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
    },
    {
      id: 5,
      bookingId: 'B12349',
      guest: 'Vikram Mehta',
      email: 'vikram.mehta@example.com',
      phone: '+91 54321 09876',
      accommodation: 'Luxury Tent',
      checkIn: '2025-05-26',
      checkOut: '2025-05-28',
      guests: 2,
      amount: '₹22,000',
      paidAmount: '₹5,000',
      paymentStatus: 'Partial',
      bookingStatus: 'Pending',
    },
    {
      id: 6,
      bookingId: 'B12350',
      guest: 'Anjali Desai',
      email: 'anjali.desai@example.com',
      phone: '+91 43210 98765',
      accommodation: 'Lake View Villa',
      checkIn: '2025-05-27',
      checkOut: '2025-05-29',
      guests: 2,
      amount: '₹28,500',
      paidAmount: '₹28,500',
      paymentStatus: 'Paid',
      bookingStatus: 'Confirmed',
    },
    {
      id: 7,
      bookingId: 'B12351',
      guest: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91 32109 87654',
      accommodation: 'Garden Suite',
      checkIn: '2025-05-28',
      checkOut: '2025-05-31',
      guests: 2,
      amount: '₹22,500',
      paidAmount: '₹0',
      paymentStatus: 'Unpaid',
      bookingStatus: 'Cancelled',
    },
    {
      id: 8,
      bookingId: 'B12352',
      guest: 'Sonia Verma',
      email: 'sonia.verma@example.com',
      phone: '+91 21098 76543',
      accommodation: 'Mountain View Cottage',
      checkIn: '2025-05-29',
      checkOut: '2025-06-01',
      guests: 3,
      amount: '₹24,500',
      paidAmount: '₹12,250',
      paymentStatus: 'Partial',
      bookingStatus: 'Confirmed',
    },
  ];

  const filteredBookings = bookings.filter(booking =>
    booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.accommodation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetails = (id: number) => {
    setSelectedBooking(id);
  };

  const handleOpenPaymentModal = (id: number) => {
    setBookingForPayment(id);
    setPaymentModalOpen(true);
  };

  const exportToCSV = () => {
    console.log('Exporting bookings to CSV');
    // Implementation would go here in real application
  };

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
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="From"
                />
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="To"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Status</label>
              <select className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply
            </button>
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
              {filteredBookings.map((booking) => (
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

        {filteredBookings.length === 0 && (
          <div className="text-center py-10">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking !== null && (
        <BookingDetailsModal
          booking={bookings.find(b => b.id === selectedBooking)!}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* Add Payment Modal */}
      {paymentModalOpen && bookingForPayment !== null && (
        <AddPaymentModal
          booking={bookings.find(b => b.id === bookingForPayment)!}
          onClose={() => {
            setPaymentModalOpen(false);
            setBookingForPayment(null);
          }}
        />
      )}
    </div>
  );
};

export default Bookings;