import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, User, CreditCard } from 'lucide-react';

interface Accommodation {
  id: number;
  title: string;
  description: string;
  price: number;
  available_rooms: number;
  amenities: string;
  image_url: string;
}

interface MealPlan {
  id: number;
  title: string;
  description: string;
  price: number;
}
const _BASE_URL = 'https://plumeriaadminback-production.up.railway.app/admin/bookings';

const CreateBooking: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    accommodationId: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    mealPlanId: '',
    totalAmount: '',
    paymentAmount: '',
    paymentMethod: '',
    transactionId: '',
    notes: ''
  });

  const paymentMethods = [
    { id: 'gpay', name: 'Google Pay' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'paytm', name: 'Paytm' },
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'cash', name: 'Cash' },
    { id: 'bank', name: 'Bank Transfer' }
  ];

  // Fetch accommodations and meal plans on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch accommodations
        const accommodationsResponse = await fetch(`${_BASE_URL}/accommodations`);
        if (accommodationsResponse.ok) {
          const accommodationsData = await accommodationsResponse.json();
          setAccommodations(accommodationsData);
        }

        // Fetch meal plans
        const mealPlansResponse = await fetch(`${_BASE_URL}/meal-plans`);
        if (mealPlansResponse.ok) {
          const mealPlansData = await mealPlansResponse.json();
          setMealPlans(mealPlansData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch accommodation and meal plan data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkAvailability = async () => {
    if (!formData.accommodationId || !formData.checkIn || !formData.checkOut) {
      return;
    }

    try {
      const response = await fetch(`${_BASE_URL}/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accommodationId: parseInt(formData.accommodationId),
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          rooms: parseInt(formData.rooms.toString())
        })
      });

      const availability = await response.json();
      
      if (!availability.available) {
        alert(`Sorry, only ${availability.availableRooms} rooms are available for the selected dates. You requested ${availability.requestedRooms} rooms.`);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check availability first
      await checkAvailability();

      // Prepare booking data according to backend 
      const bookingData = {
        guestName: formData.guestName,
        email: formData.email,
        phone: formData.phone,
        accommodationId: parseInt(formData.accommodationId),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: parseInt(formData.adults.toString()),
        children: parseInt(formData.children.toString()),
        rooms: parseInt(formData.rooms.toString()),
        mealPlanId: formData.mealPlanId ? parseInt(formData.mealPlanId) : null,
        totalAmount: parseFloat(formData.totalAmount),
        paymentAmount: formData.paymentAmount ? parseFloat(formData.paymentAmount) : null,
        paymentMethod: formData.paymentMethod || null,
        transactionId: formData.transactionId || null,
        notes: formData.notes
      };

      const response = await fetch(`${_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Booking created successfully!');
        navigate('/bookings');
      } else {
        throw new Error(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(`Error creating booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && accommodations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/bookings')}
              className="mr-2 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Booking</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">Add a new booking manually</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Guest Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-navy-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Guest Information</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="guestName" className="block text-sm font-medium text-gray-700">
                  Guest Name
                </label>
                <input
                  type="text"
                  id="guestName"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-navy-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="accommodationId" className="block text-sm font-medium text-gray-700">
                  Accommodation
                </label>
                <select
                  id="accommodationId"
                  name="accommodationId"
                  value={formData.accommodationId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                >
                  <option value="">Select Accommodation</option>
                  {accommodations.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.title} - ₹{acc.price}/night
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mealPlanId" className="block text-sm font-medium text-gray-700">
                  Meal Plan (Optional)
                </label>
                <select
                  id="mealPlanId"
                  name="mealPlanId"
                  value={formData.mealPlanId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                >
                  <option value="">No Meal Plan</option>
                  {mealPlans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.title} - ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
                  Adults
                </label>
                <input
                  type="number"
                  id="adults"
                  name="adults"
                  min="1"
                  value={formData.adults}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="children" className="block text-sm font-medium text-gray-700">
                  Children
                </label>
                <input
                  type="number"
                  id="children"
                  name="children"
                  min="0"
                  value={formData.children}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  min="1"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
                  Check In Date
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  onBlur={checkAvailability}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
                  Check Out Date
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  onBlur={checkAvailability}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-navy-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  id="totalAmount"
                  name="totalAmount"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  name="paymentAmount"
                  step="0.01"
                  value={formData.paymentAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
                  Transaction ID
                </label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Special Requests / Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBooking;