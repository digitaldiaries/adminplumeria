import React, { useState } from 'react';
import { X, DollarSign, CreditCard, Smartphone, Tag } from 'lucide-react';

interface Booking {
  id: number;
  bookingId: string;
  guest: string;
  email: string;
  phone: string;
  accommodation: string;
  amount: string;
  paidAmount: string;
  paymentStatus: string;
}

interface AddPaymentModalProps {
  booking: Booking;
  onClose: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ booking, onClose }) => {
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would be an API call
    console.log('Payment submitted:', {
      bookingId: booking.id,
      paymentType,
      paymentMethod,
      amount,
      transactionId,
      notes,
    });
    onClose();
  };

  // Extract numeric value from formatted price string (e.g., "₹38,500" -> 38500)
  const getTotalAmount = () => {
    const numericString = booking.amount.replace(/[^\d]/g, '');
    return parseInt(numericString, 10);
  };

  const getPaidAmount = () => {
    const numericString = booking.paidAmount.replace(/[^\d]/g, '');
    return parseInt(numericString, 10);
  };

  const getRemainingAmount = () => {
    return getTotalAmount() - getPaidAmount();
  };

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
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                    Add Payment for {booking.bookingId}
                  </h3>
                  <button
                    onClick={onClose}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-2 mb-4">
                  <p className="text-sm text-gray-500">
                    Guest: <span className="font-medium text-gray-700">{booking.guest}</span>
                  </p>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      Total: <span className="font-medium text-gray-700">{booking.amount}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Paid: <span className="font-medium text-gray-700">{booking.paidAmount}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Remaining: <span className="font-medium text-green-600">₹{getRemainingAmount().toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Payment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Type
                    </label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="full-payment"
                          name="payment-type"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={paymentType === 'full'}
                          onChange={() => setPaymentType('full')}
                        />
                        <label htmlFor="full-payment" className="ml-2 block text-sm text-gray-700">
                          Full Payment (₹{getRemainingAmount().toLocaleString()})
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="partial-payment"
                          name="payment-type"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          checked={paymentType === 'partial'}
                          onChange={() => setPaymentType('partial')}
                        />
                        <label htmlFor="partial-payment" className="ml-2 block text-sm text-gray-700">
                          Partial Payment
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Payment Method</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="gpay">Google Pay</option>
                      <option value="phonepe">PhonePe</option>
                      <option value="paytm">Paytm</option>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  {/* Amount (for partial payment) */}
                  {paymentType === 'partial' && (
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        max={getRemainingAmount()}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required={paymentType === 'partial'}
                      />
                    </div>
                  )}

                  {/* Transaction ID */}
                  <div>
                    <label htmlFor="transaction-id" className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction ID/Reference
                    </label>
                    <input
                      type="text"
                      id="transaction-id"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Record Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;