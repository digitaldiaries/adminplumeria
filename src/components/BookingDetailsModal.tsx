import React from 'react';
import { X, Calendar, User, Building2, CreditCard, Clock } from 'lucide-react';

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
  amount: string;
  paidAmount: string;
  paymentStatus: string;
  bookingStatus: string;
}

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {booking.bookingId} - Booking Details
                  </h3>
                  <button
                    onClick={onClose}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-4 space-y-6">
                  {/* Guest Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <User className="h-4 w-4 mr-1" /> Guest Information
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-900">{booking.guest}</p>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                      <p className="text-sm text-gray-500">{booking.phone}</p>
                    </div>
                  </div>

                  {/* Accommodation Details */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Building2 className="h-4 w-4 mr-1" /> Accommodation
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-900">{booking.accommodation}</p>
                      <p className="text-sm text-gray-500">Guests: {booking.guests}</p>
                    </div>
                  </div>

                  {/* Stay Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" /> Stay Details
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Check In</p>
                        <p className="text-sm font-medium text-gray-900">{booking.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Check Out</p>
                        <p className="text-sm font-medium text-gray-900">{booking.checkOut}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" /> Payment Details
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="text-sm font-medium text-gray-900">{booking.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Paid Amount</p>
                          <p className="text-sm font-medium text-gray-900">{booking.paidAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <p className={`text-sm font-medium ${
                            booking.paymentStatus === 'Paid' 
                              ? 'text-green-600' 
                              : booking.paymentStatus === 'Partial' 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }`}>
                            {booking.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Booking Status
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.bookingStatus === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.bookingStatus === 'Pending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;