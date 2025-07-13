// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Calendar, Building2, User, CreditCard, UtensilsCrossed } from 'lucide-react';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// interface Accommodation {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   available_rooms: number;
//   amenities: string;
//   address: string;
//   latitude: number;
//   longitude: number;
//   adultPrice?: number;
//   childPrice?: number;
// }

// interface Coupon {
//   id: number;
//   code: string;
//   discount: string;
//   discountType: 'percentage' | 'fixed';
//   minAmount?: string;
//   maxDiscount?: string;
//   active: boolean;
// }

// const _BASE_URL = 'https://a.plumeriaretreat.com';

// const CreateBooking: React.FC = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
//   const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
//   const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [bookingData, setBookingData] = useState<any>(null);
//   const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

//   const [formData, setFormData] = useState({
//     guest_name: '',
//     guest_email: '',
//     guest_phone: '',
//     accommodation_id: '',
//     check_in: '',
//     check_out: '',
//     adults: '1',
//     children: '0',
//     rooms: '1',
//     food_veg: '0',
//     food_nonveg: '0',
//     food_jain: '0',
//     total_amount: '',
//     discounted_amount: '',
//     advance_amount: '0',
//     payment_method: 'cash',
//     coupon_code: '',
//     notes: ''
//   });

//   const paymentMethods = [
//     { id: 'cash', name: 'Cash' },
//     { id: 'bank', name: 'Bank Transfer' },
//     { id: 'card', name: 'Credit/Debit Card' },
//     { id: 'gpay', name: 'Google Pay' },
//     { id: 'phonepe', name: 'PhonePe' },
//     { id: 'paytm', name: 'Paytm' }
//   ];

//   useEffect(() => {
//     const fetchAccommodations = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${_BASE_URL}/admin/properties/accommodations`);
//         const data = await response.json();

//         const accommodationsData = data.data || [];
//         if (Array.isArray(accommodationsData)) {
//           setAccommodations(accommodationsData);
//         } else {
//           console.error('Unexpected accommodations data format:', data);
//           setAccommodations([]);
//         }
//       } catch (error) {
//         console.error('Error fetching accommodations:', error);
//         alert('Failed to load accommodations');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccommodations();
//   }, []);

//   useEffect(() => {
//     if (formData.coupon_code && formData.coupon_code.length >= 3) {
//       const fetchCoupons = async () => {
//         try {
//           const response = await fetch(
//             `${_BASE_URL}/admin/coupons?search=${formData.coupon_code}`
//           );
//           const data = await response.json();

//           if (data.success && Array.isArray(data.data)) {
//             setAvailableCoupons(data.data.filter((c: Coupon) => c.active));
//           } else {
//             setAvailableCoupons([]);
//           }
//         } catch (error) {
//           console.error('Error fetching coupons:', error);
//           setAvailableCoupons([]);
//         }
//       };

//       const debounceTimer = setTimeout(fetchCoupons, 500);
//       return () => clearTimeout(debounceTimer);
//     } else {
//       setAvailableCoupons([]);
//     }
//   }, [formData.coupon_code]);
//   const fetchAccommodationDetails = async (id: string) => {
//     try {
//       const response = await fetch(`${_BASE_URL}/admin/properties/accommodations/${id}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch accommodation details');
//       }
//       const data = await response.json();
//       const accommodation: Accommodation = {
//         id: data.id,
//         name: data.basicInfo.name,
//         description: data.basicInfo.description,
//         price: data.basicInfo.price,
//         available_rooms: data.basicInfo.rooms,
//         amenities: data.amenities,
//         address: data.location.address,
//         latitude: data.location.coordinates.latitude,
//         longitude: data.location.coordinates.longitude,
//         adultPrice: data.packages.pricing.adult,
//         childPrice: data.packages.pricing.child
//       };
//       setSelectedAccommodation(accommodation);
//     } catch (error) {
//       console.error('Error fetching accommodation details:', error);
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;

//     // Reset coupon when coupon code changes
//     if (name === 'coupon_code') {
//       setAppliedCoupon(null);
//     }

//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCouponSelect = (coupon: Coupon) => {
//     setAppliedCoupon(coupon);
//     setFormData(prev => ({
//       ...prev,
//       coupon_code: coupon.code
//     }));
//     setAvailableCoupons([]);
//   };
//   useEffect(() => {
//     // Auto-set check_out to next day when check_in changes
//     if (formData.check_in) {
//       const nextDay = new Date(formData.check_in);
//       nextDay.setDate(nextDay.getDate() + 1);
//       const nextDayString = nextDay.toISOString().split('T')[0];

//       // Only set if check_out is empty or before/equal to check_in
//       if (!formData.check_out || new Date(formData.check_out) <= new Date(formData.check_in)) {
//         setFormData(prev => ({ ...prev, check_out: nextDayString }));
//       }
//     }
//   }, [formData.check_in]);

//   const calculateDiscount = (totalAmount: string, coupon: Coupon): string => {
//     if (!totalAmount || !coupon) return totalAmount;

//     const total = parseFloat(totalAmount);
//     const discount = parseFloat(coupon.discount);
//     const minAmount = coupon.minAmount ? parseFloat(coupon.minAmount) : 0;
//     const maxDiscount = coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : Infinity;

//     if (total < minAmount) {
//       return totalAmount; // Skip discount if min amount not met
//     }

//     let discountedAmount = total;

//     if (coupon.discountType === 'percentage') {
//       const discountValue = total * (discount / 100);
//       const finalDiscount = Math.min(discountValue, maxDiscount);
//       discountedAmount = total - finalDiscount;
//     } else {
//       discountedAmount = total - discount;
//     }

//     return discountedAmount.toFixed(2);
//   };

//   // Calculate total whenever relevant values change
//   useEffect(() => {
//     if (!selectedAccommodation) {
//       setFormData(prev => ({
//         ...prev,
//         total_amount: '',
//         discounted_amount: ''
//       }));
//       return;
//     }

//     const adults = parseInt(formData.adults) || 0;
//     const children = parseInt(formData.children) || 0;
//     const rooms = parseInt(formData.rooms) || 0;

//     const adultPrice = (selectedAccommodation.adultPrice || 0) * adults * rooms;
//     const childPrice = (selectedAccommodation.childPrice || 0) * children * rooms;
//     const total = adultPrice + childPrice;

//     let discountedAmount = total;

//     // Apply coupon if exists
//     if (appliedCoupon) {
//       discountedAmount = parseFloat(calculateDiscount(total.toString(), appliedCoupon));
//     }

//     setFormData(prev => ({
//       ...prev,
//       total_amount: total.toFixed(2),
//       discounted_amount: discountedAmount.toFixed(2)
//     }));
//   }, [
//     selectedAccommodation,
//     formData.adults,
//     formData.children,
//     formData.rooms,
//     appliedCoupon
//   ]);

//   useEffect(() => {
//     if (formData.accommodation_id) {
//       fetchAccommodationDetails(formData.accommodation_id);
//     }
//   }, [formData.accommodation_id]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Required field check
//     if (
//       !formData.guest_name ||
//       !formData.guest_email ||
//       !formData.accommodation_id ||
//       !formData.check_in ||
//       !formData.check_out ||
//       !formData.total_amount
//     ) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     const adults = parseInt(formData.adults);
//     const children = parseInt(formData.children);
//     const rooms = parseInt(formData.rooms);
//     const food_veg = parseInt(formData.food_veg);
//     const food_nonveg = parseInt(formData.food_nonveg);
//     const food_jain = parseInt(formData.food_jain);
//     const totalGuests = adults + children;
//     const totalFood = food_veg + food_nonveg + food_jain;
//     console.log("Total Guests  ",totalGuests," totalFood  ",totalFood);
//      if (totalFood !== totalGuests) {
//      alert('Food preferences must match total guests count');
//      return;
//    }
//     if (totalFood > 0 && (totalFood !== totalGuests)) {
//       alert('Food preferences must match total guests count');
//       return;
//     }

//     if (new Date(formData.check_in) >= new Date(formData.check_out)) {
//       alert('Check-out must be after check-in');
//       return;
//     }

//     if (adults < 1 || rooms < 1) {
//       alert('Must have at least 1 adult and 1 room');
//       return;
//     }

//     setLoading(true);
//     try {
//       const bookingPayload = {
//         guest_name: formData.guest_name,
//         guest_email: formData.guest_email,
//         guest_phone: formData.guest_phone || null,
//         accommodation_id: parseInt(formData.accommodation_id),
//         check_in: formData.check_in,
//         check_out: formData.check_out,
//         adults,
//         children,
//         rooms,
//         food_veg,
//         food_nonveg,
//         food_jain,
//         total_amount: parseFloat(formData.discounted_amount || formData.total_amount),
//         advance_amount: parseFloat(formData.advance_amount || '0'),
//       };

//       const response = await fetch(`${_BASE_URL}/admin/bookings/offline`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookingPayload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create booking');
//       }

//       const result = await response.json();

//       setBookingSuccess(true);

//       // Download PDF would be called here
//       // downloadPdf(...);
//       // downloadPdf(
//       //   bookingPayload.guest_email,
//       //   bookingPayload.guest_name,
//       //   result.data.booking.id.toString(),
//       //   bookingPayload.check_in,
//       //   bookingPayload.check_out,
//       //   bookingPayload.total_amount,
//       //   bookingPayload.advance_amount,
//       //   (bookingPayload.total_amount - bookingPayload.advance_amount),
//       //   bookingPayload.guest_phone || '',

//       //   bookingPayload.rooms,
//       //   bookingPayload.adults,
//       //   bookingPayload.children,
//       //   bookingPayload.food_veg,
//       //   bookingPayload.food_nonveg,
//       //   bookingPayload.food_jain,
//       //   accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.name || '',
//       //   accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.address || '',
//       //   (accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.latitude || '').toString(),
//       //   (accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.longitude || '').toString()
//       // );
//       alert('Booking created successfully!');
//       navigate('/bookings');

//     } catch (error) {
//       console.error('Error creating booking:', error);
//       alert(`Error creating booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && accommodations.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-gray-500">Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 pb-16 md:pb-0">
//       <div className="sm:flex sm:items-center sm:justify-between">
//         <div>
//           <div className="flex items-center">
//             <button
//               onClick={() => navigate('/bookings')}
//               className="mr-2 text-gray-400 hover:text-gray-500"
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </button>
//             <h1 className="text-2xl font-bold text-gray-900">Create New Booking</h1>
//           </div>
//           <p className="mt-1 text-sm text-gray-500">Add a new booking manually</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-8">
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="p-6 space-y-6">
//             <div className="flex items-center mb-4">
//               <User className="h-5 w-5 text-navy-600 mr-2" />
//               <h2 className="text-lg font-medium text-gray-900">Guest Information</h2>
//             </div>

//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700">
//                   Guest Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="guest_name"
//                   name="guest_name"
//                   value={formData.guest_name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   id="guest_email"
//                   name="guest_email"
//                   value={formData.guest_email}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="guest_phone" className="block text-sm font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   id="guest_phone"
//                   name="guest_phone"
//                   value={formData.guest_phone}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="p-6 space-y-6">
//             <div className="flex items-center mb-4">
//               <Building2 className="h-5 w-5 text-navy-600 mr-2" />
//               <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
//             </div>

//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="accommodation_id" className="block text-sm font-medium text-gray-700">
//                   Accommodation *
//                 </label>
//                 <select
//                   id="accommodation_id"
//                   name="accommodation_id"
//                   value={formData.accommodation_id}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   required
//                 >
//                   <option value="">Select Accommodation</option>
//                   {accommodations.map(acc => (
//                     <option key={acc.id} value={acc.id}>
//                       {acc.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="check_in" className="block text-sm font-medium text-gray-700">
//                   Check In Date *
//                 </label>
//                 <input
//                   type="date"
//                   id="check_in"
//                   name="check_in"
//                   value={formData.check_in}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="check_out" className="block text-sm font-medium text-gray-700">
//                   Check Out Date *
//                 </label>
//                 <input
//                   type="date"
//                   id="check_out"
//                   name="check_out"
//                   value={formData.check_out}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
//                   Adults *
//                 </label>
//                 <input
//                   type="number"
//                   id="adults"
//                   name="adults"
//                   min="1"
//                   value={formData.adults}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="children" className="block text-sm font-medium text-gray-700">
//                   Children
//                 </label>
//                 <input
//                   type="number"
//                   id="children"
//                   name="children"
//                   min="0"
//                   value={formData.children}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
//                   Number of Rooms *
//                 </label>
//                 <input
//                   type="number"
//                   id="rooms"
//                   name="rooms"
//                   min="1"
//                   value={formData.rooms}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="p-6 space-y-6">
//             <div className="flex items-center mb-4">
//               <UtensilsCrossed className="h-5 w-5 text-navy-600 mr-2" />
//               <h2 className="text-lg font-medium text-gray-900">Food Preference</h2>
//             </div>

//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//               <div>
//                 <label htmlFor="food_veg" className="block text-sm font-medium text-gray-700">
//                   Veg Count
//                 </label>
//                 <input
//                   type="number"
//                   id="food_veg"
//                   name="food_veg"
//                   min="0"
//                   value={formData.food_veg}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="food_nonveg" className="block text-sm font-medium text-gray-700">
//                   Non-Veg Count
//                 </label>
//                 <input
//                   type="number"
//                   id="food_nonveg"
//                   name="food_nonveg"
//                   min="0"
//                   value={formData.food_nonveg}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="food_jain" className="block text-sm font-medium text-gray-700">
//                   Jain Count
//                 </label>
//                 <input
//                   type="number"
//                   id="food_jain"
//                   name="food_jain"
//                   min="0"
//                   value={formData.food_jain}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <div className="p-6 space-y-6">
//             <div className="flex items-center mb-4">
//               <CreditCard className="h-5 w-5 text-navy-600 mr-2" />
//               <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
//             </div>

//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">
//                   Total Amount (₹) *
//                 </label>
//                 <input
//                   type="number"
//                   id="total_amount"
//                   name="total_amount"
//                   step="0.01"
//                   value={formData.total_amount}
//                   readOnly
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm bg-gray-100"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="coupon_code" className="block text-sm font-medium text-gray-700">
//                   Coupon Code
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="coupon_code"
//                     name="coupon_code"
//                     value={formData.coupon_code}
//                     onChange={handleChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   />
//                   {availableCoupons.length > 0 && (
//                     <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                       {availableCoupons.map(coupon => (
//                         <div
//                           key={coupon.id}
//                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handleCouponSelect(coupon)}
//                         >
//                           {coupon.code} - {coupon.discountType === 'percentage'
//                             ? `${coupon.discount}% off`
//                             : `₹${coupon.discount} off`}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="advance_amount" className="block text-sm font-medium text-gray-700">
//                   Advance Amount (₹)
//                 </label>
//                 <input
//                   type="number"
//                   id="advance_amount"
//                   name="advance_amount"
//                   step="0.01"
//                   min="0"
//                   value={formData.advance_amount}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
//                   Payment Method
//                 </label>
//                 <select
//                   id="payment_method"
//                   name="payment_method"
//                   value={formData.payment_method}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                 >
//                   {paymentMethods.map(method => (
//                     <option key={method.id} value={method.id}>{method.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
//                   Notes (Optional)
//                 </label>
//                 <textarea
//                   id="notes"
//                   name="notes"
//                   value={formData.notes}
//                   onChange={handleChange}
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
//                   rows={3}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={() => navigate('/bookings')}
//             className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? 'Creating...' : 'Create Booking'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateBooking;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, User, CreditCard, UtensilsCrossed } from 'lucide-react';

interface Accommodation {
  id: number;
  name: string;
  description: string;
  price: number;
  available_rooms: number;
  amenities: string;
  address: string;
  latitude: number;
  longitude: number;
  adultPrice?: number;
  childPrice?: number;
  capacity: number;
}

interface Coupon {
  id: number;
  code: string;
  discount: string;
  discountType: 'percentage' | 'fixed';
  minAmount?: string;
  maxDiscount?: string;
  active: boolean;
}

interface BlockedDate {
  id: number;
  accommodation_id: number;
  blocked_date: string;
  rooms_blocked: number;
}

const _BASE_URL = 'https://a.plumeriaretreat.com';

const CreateBooking: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [availableRooms, setAvailableRooms] = useState<number>(0);
  const [bookedRooms, setBookedRooms] = useState<number>(0);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const [showRoomAvailability, setShowRoomAvailability] = useState(false);
  const [blockedRoomsCount, setBlockedRoomsCount] = useState<number>(0);

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    accommodation_id: '',
    check_in: '',
    check_out: '',
    adults: '1',
    children: '0',
    rooms: '1',
    food_veg: '0',
    food_nonveg: '0',
    food_jain: '0',
    total_amount: '',
    discounted_amount: '',
    advance_amount: '0',
    payment_method: 'cash',
    coupon_code: '',
    notes: ''
  });

  const paymentMethods = [
    { id: 'cash', name: 'Cash' },
    { id: 'bank', name: 'Bank Transfer' },
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'gpay', name: 'Google Pay' },
    { id: 'phonepe', name: 'PhonePe' },
    { id: 'paytm', name: 'Paytm' }
  ];

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${_BASE_URL}/admin/properties/accommodations`);
        const data = await response.json();

        const accommodationsData = data.data || [];
        if (Array.isArray(accommodationsData)) {
          setAccommodations(accommodationsData);
        } else {
          console.error('Unexpected accommodations data format:', data);
          setAccommodations([]);
        }
      } catch (error) {
        console.error('Error fetching accommodations:', error);
        alert('Failed to load accommodations');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await fetch(`${_BASE_URL}/admin/calendar/blocked-dates`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setBlockedDates(data.data);
        }
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
      }
    };

    fetchBlockedDates();
  }, []);

  useEffect(() => {
    if (formData.coupon_code && formData.coupon_code.length >= 3) {
      const fetchCoupons = async () => {
        try {
          const response = await fetch(
            `${_BASE_URL}/admin/coupons?search=${formData.coupon_code}`
          );
          const data = await response.json();

          if (data.success && Array.isArray(data.data)) {
            setAvailableCoupons(data.data.filter((c: Coupon) => c.active));
          } else {
            setAvailableCoupons([]);
          }
        } catch (error) {
          console.error('Error fetching coupons:', error);
          setAvailableCoupons([]);
        }
      };

      const debounceTimer = setTimeout(fetchCoupons, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setAvailableCoupons([]);
    }
  }, [formData.coupon_code]);
  
  const fetchAccommodationDetails = async (id: string) => {
    try {
      const response = await fetch(`${_BASE_URL}/admin/properties/accommodations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch accommodation details');
      }
      const data = await response.json();
      const accommodation: Accommodation = {
        id: data.id,
        name: data.basicInfo?.name || 'Unnamed Accommodation',
        description: data.basicInfo?.description || '',
        price: data.basicInfo?.price || 0,
        available_rooms: data.basicInfo?.rooms || 0,
        amenities: data.amenities || '',
        address: data.location?.address || '',
        latitude: data.location?.coordinates?.latitude || 0,
        longitude: data.location?.coordinates?.longitude || 0,
        adultPrice: data.packages?.pricing?.adult || 0,
        childPrice: data.packages?.pricing?.child || 0,
        capacity: data.basicInfo?.capacity || 4
      };
      setSelectedAccommodation(accommodation);
      setAvailableRooms(0);
      setShowRoomAvailability(false);
    } catch (error) {
      console.error('Error fetching accommodation details:', error);
    }
  }

  const fetchBookedRooms = async (accommodationId: number, checkInDate: string) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/bookings/room-occupancy?check_in=${checkInDate}&id=${accommodationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch booked rooms');
      }
      const data = await response.json();
      return data.total_rooms || 0;
    } catch (error) {
      console.error('Error fetching booked rooms:', error);
      return 0;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'coupon_code') {
      setAppliedCoupon(null);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCouponSelect = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    setFormData(prev => ({
      ...prev,
      coupon_code: coupon.code
    }));
    setAvailableCoupons([]);
  };
  
  useEffect(() => {
    if (formData.check_in) {
      const nextDay = new Date(formData.check_in);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      
      if (!formData.check_out || new Date(formData.check_out) <= new Date(formData.check_in)) {
        setFormData(prev => ({ ...prev, check_out: nextDayString }));
      }
      
      validateDates(formData.check_in, nextDayString);
    }
  }, [formData.check_in]);

  useEffect(() => {
    const calculateAvailableRooms = async () => {
      // Only calculate if we have all required data
      if (!formData.accommodation_id || !formData.check_in || !selectedAccommodation) {
        setAvailableRooms(0);
        return;
      }
      
      const accommodationId = parseInt(formData.accommodation_id);
      const booked = await fetchBookedRooms(accommodationId, formData.check_in);
      setBookedRooms(booked);
      
      const blockedForDate = blockedDates.find(
        b => b.accommodation_id === accommodationId && b.blocked_date === formData.check_in
      );
      const blockedRooms = blockedForDate ? blockedForDate.rooms_blocked : 0;
      setBlockedRoomsCount(blockedRooms);

      // Use selectedAccommodation which has the available_rooms value
      const totalRooms = selectedAccommodation.available_rooms || 0;
      const bookedCount = booked || 0;
      const blockedCount = blockedRooms || 0;
      
      const available = totalRooms - bookedCount - blockedCount;
      const availableRoomsValue = Math.max(available, 0);
      setAvailableRooms(availableRoomsValue);
      setShowRoomAvailability(true);
      
      if (parseInt(formData.rooms) > availableRoomsValue) {
        setFormData(prev => ({
          ...prev,
          rooms: availableRoomsValue > 0 ? availableRoomsValue.toString() : '0'
        }));
      }
    };

    calculateAvailableRooms();
  }, [formData.accommodation_id, formData.check_in, blockedDates, selectedAccommodation]);

  const validateDates = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return;
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const accommodationId = parseInt(formData.accommodation_id);
    
    if (!accommodationId) return;
    
    const accommodationBlockedDates = blockedDates.filter(
      date => date.accommodation_id === accommodationId
    );
    
    let errorDate: string | null = null;
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      
      const isBlocked = accommodationBlockedDates.some(
        blocked => blocked.blocked_date === dateString
      );
      
      if (isBlocked) {
        errorDate = dateString;
        break;
      }
    }
    
    setDateError(errorDate ? `The date ${errorDate} is blocked for this accommodation` : null);
  };

  const calculateDiscount = (totalAmount: string, coupon: Coupon): string => {
    if (!totalAmount || !coupon) return totalAmount;

    const total = parseFloat(totalAmount);
    const discount = parseFloat(coupon.discount);
    const minAmount = coupon.minAmount ? parseFloat(coupon.minAmount) : 0;
    const maxDiscount = coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : Infinity;

    if (total < minAmount) {
      return totalAmount;
    }

    let discountedAmount = total;

    if (coupon.discountType === 'percentage') {
      const discountValue = total * (discount / 100);
      const finalDiscount = Math.min(discountValue, maxDiscount);
      discountedAmount = total - finalDiscount;
    } else {
      discountedAmount = total - discount;
    }

    return discountedAmount.toFixed(2);
  };

  useEffect(() => {
    if (!selectedAccommodation) {
      setFormData(prev => ({
        ...prev,
        total_amount: '',
        discounted_amount: ''
      }));
      return;
    }

    const adults = parseInt(formData.adults) || 0;
    const children = parseInt(formData.children) || 0;
    const adultPrice = (selectedAccommodation.adultPrice || 0) * adults;
    const childPrice = (selectedAccommodation.childPrice || 0) * children;
    const total = adultPrice + childPrice;

    let discountedAmount = total;

    if (appliedCoupon) {
      discountedAmount = parseFloat(calculateDiscount(total.toString(), appliedCoupon));
    }

    setFormData(prev => ({
      ...prev,
      total_amount: total.toFixed(2),
      discounted_amount: discountedAmount.toFixed(2)
    }));
  }, [
    selectedAccommodation,
    formData.adults,
    formData.children,
    formData.rooms,
    appliedCoupon
  ]);

  useEffect(() => {
    if (formData.accommodation_id) {
      fetchAccommodationDetails(formData.accommodation_id);
    }
  }, [formData.accommodation_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.guest_name ||
      !formData.guest_email ||
      !formData.accommodation_id ||
      !formData.check_in ||
      !formData.check_out ||
      !formData.total_amount
    ) {
      alert('Please fill in all required fields');
      return;
    }

    if (availableRooms === 0) {
      alert('This accommodation is fully booked for the selected date. Please choose another date or accommodation.');
      return;
    }

    const adults = parseInt(formData.adults);
    const children = parseInt(formData.children);
    const rooms = parseInt(formData.rooms);
    const food_veg = parseInt(formData.food_veg);
    const food_nonveg = parseInt(formData.food_nonveg);
    const food_jain = parseInt(formData.food_jain);
    const totalGuests = adults + children;
    const totalFood = food_veg + food_nonveg + food_jain;
    
    if (selectedAccommodation) {
      const maxGuestsPerRoom = selectedAccommodation.capacity;
      if (totalGuests > rooms * maxGuestsPerRoom) {
        alert(`Maximum ${maxGuestsPerRoom} guests per room. You have ${totalGuests} guests for ${rooms} room(s).`);
        return;
      }
    }
    
    if (totalFood !== totalGuests) {
      alert('Food preferences must match total guests count');
      return;
    }

    if (new Date(formData.check_in) >= new Date(formData.check_out)) {
      alert('Check-out must be after check-in');
      return;
    }

    if (adults < 1 || rooms < 1) {
      alert('Must have at least 1 adult and 1 room');
      return;
    }
    
    if (rooms > availableRooms) {
      alert(`Only ${availableRooms} room(s) available for this accommodation`);
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone || null,
        accommodation_id: parseInt(formData.accommodation_id),
        check_in: formData.check_in,
        check_out: formData.check_out,
        adults,
        children,
        rooms,
        food_veg,
        food_nonveg,
        food_jain,
        total_amount: parseFloat(formData.discounted_amount || formData.total_amount),
        advance_amount: parseFloat(formData.advance_amount || '0'),
      };

      const response = await fetch(`${_BASE_URL}/admin/bookings/offline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const result = await response.json();
      alert('Booking created successfully!');
      navigate('/bookings');

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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-navy-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Guest Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700">
                  Guest Name *
                </label>
                <input
                  type="text"
                  id="guest_name"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="guest_email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  id="guest_email"
                  name="guest_email"
                  value={formData.guest_email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="guest_phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="guest_phone"
                  name="guest_phone"
                  value={formData.guest_phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-navy-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="accommodation_id" className="block text-sm font-medium text-gray-700">
                  Accommodation *
                </label>
                <select
                  id="accommodation_id"
                  name="accommodation_id"
                  value={formData.accommodation_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                >
                  <option value="">Select Accommodation</option>
                  {accommodations.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="check_in" className="block text-sm font-medium text-gray-700">
                  Check In Date *
                </label>
                <input
                  type="date"
                  id="check_in"
                  name="check_in"
                  value={formData.check_in}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="check_out" className="block text-sm font-medium text-gray-700">
                  Check Out Date *
                </label>
                <input
                  type="date"
                  id="check_out"
                  name="check_out"
                  value={formData.check_out}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>

              {dateError && (
                <div className="sm:col-span-2">
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                    {dateError}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
                  Adults *
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
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  min={availableRooms > 0 ? 1 : 0}
                  max={availableRooms}
                  value={formData.rooms}
                  onChange={handleChange}
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm ${
                    availableRooms <= 0 ? 'bg-gray-100 text-gray-500' : ''
                  }`}
                  required
                  disabled={availableRooms <= 0}
                />
                <div className="mt-1 text-sm text-gray-500">
                  {showRoomAvailability ? (
                    availableRooms <= 0 ? (
                      <span className="text-red-600 font-medium">
                        All rooms booked for the selected date
                      </span>
                    ) : (
                      `${availableRooms} room(s) available (Total: ${
                        selectedAccommodation?.available_rooms || 0
                      }, Booked: ${bookedRooms}, Blocked: ${blockedRoomsCount})`
                    )
                  ) : formData.accommodation_id && !formData.check_in ? (
                    'Select a date to see availability'
                  ) : null}
                </div>
              </div>

              {selectedAccommodation && (
                <div className="sm:col-span-2">
                  <div className="text-sm text-gray-700">
                    <strong>Room Capacity:</strong> Max {selectedAccommodation.capacity} guests per room
                  </div>
                  <div className="text-sm text-gray-700 mt-1">
                    <strong>Current Guests:</strong> {parseInt(formData.adults) + parseInt(formData.children)} 
                    {' '}guests for {formData.rooms} room(s) - 
                    {' '}Max allowed: {parseInt(formData.rooms) * selectedAccommodation.capacity}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <UtensilsCrossed className="h-5 w-5 text-navy-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Food Preference</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="food_veg" className="block text-sm font-medium text-gray-700">
                  Veg Count
                </label>
                <input
                  type="number"
                  id="food_veg"
                  name="food_veg"
                  min="0"
                  max={parseInt(formData.adults) + parseInt(formData.children)}
                  value={formData.food_veg}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="food_nonveg" className="block text-sm font-medium text-gray-700">
                  Non-Veg Count
                </label>
                <input
                  type="number"
                  id="food_nonveg"
                  name="food_nonveg"
                  min="0"
                  max={parseInt(formData.adults) + parseInt(formData.children)}
                  value={formData.food_nonveg}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="food_jain" className="block text-sm font-medium text-gray-700">
                  Jain Count
                </label>
                <input
                  type="number"
                  id="food_jain"
                  name="food_jain"
                  min="0"
                  max={parseInt(formData.adults) + parseInt(formData.children)}
                  value={formData.food_jain}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-3">
                <div className="text-sm text-gray-700">
                  <strong>Food Preferences:</strong> Veg: {formData.food_veg}, 
                  Non-Veg: {formData.food_nonveg}, Jain: {formData.food_jain}
                  {' '} | Total: {parseInt(formData.food_veg) + parseInt(formData.food_nonveg) + parseInt(formData.food_jain)}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <strong>Total Guests:</strong> {parseInt(formData.adults) + parseInt(formData.children)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-navy-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">
                  Total Amount (₹) *
                </label>
                <input
                  type="number"
                  id="total_amount"
                  name="total_amount"
                  step="0.01"
                  value={formData.total_amount}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm bg-gray-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="coupon_code" className="block text-sm font-medium text-gray-700">
                  Coupon Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="coupon_code"
                    name="coupon_code"
                    value={formData.coupon_code}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  />
                  {availableCoupons.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {availableCoupons.map(coupon => (
                        <div
                          key={coupon.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleCouponSelect(coupon)}
                        >
                          {coupon.code} - {coupon.discountType === 'percentage'
                            ? `${coupon.discount}% off`
                            : `₹${coupon.discount} off`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="advance_amount" className="block text-sm font-medium text-gray-700">
                  Advance Amount (₹)
                </label>
                <input
                  type="number"
                  id="advance_amount"
                  name="advance_amount"
                  step="0.01"
                  min="0"
                  value={formData.advance_amount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                >
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>{method.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

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