import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, User, CreditCard, UtensilsCrossed } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

const _BASE_URL = 'https://a.plumeriaretreat.com';

const CreateBooking: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCouponSelect = (coupon: Coupon) => {
    setFormData(prev => ({
      ...prev,
      coupon_code: coupon.code,
      discounted_amount: calculateDiscount(prev.total_amount, coupon)
    }));
    setAvailableCoupons([]);
  };

  const calculateDiscount = (totalAmount: string, coupon: Coupon): string => {
    if (!totalAmount || !coupon) return '';
    
    const total = parseFloat(totalAmount);
    const discount = parseFloat(coupon.discount);
    const minAmount = coupon.minAmount ? parseFloat(coupon.minAmount) : 0;
    const maxDiscount = coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : Infinity;

    if (total < minAmount) {
      alert(`Coupon requires minimum amount of ₹${minAmount}`);
      return '';
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
  const downloadPdf = (
    email: string,
    name: string,
    BookingId: string,
    BookingDate: string,
    CheckoutDate: string,
    totalPrice: number,
    advancePayable: number,
    remainingAmount: number,
    mobile: string,
    totalPerson: number,
    adult: number,
    child: number,
    vegCount: number,
    nonvegCount: number,
    joinCount: number,
    accommodationName: string,
    accommodationAddress: string,
    latitude: string,
    longitude: string) => {
    const html = `<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="date=no" />
  <meta name="format-detection" content="address=no" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet" />
  <title>Booking</title>
  <link rel="shortcut icon" href="images/favicon.png">


  <style type="text/css" media="screen">
    body {
      padding: 0 !important;
      margin: 0 !important;
      display: block !important;
      min-width: 100% !important;
      width: 100% !important;
      background: #ffffff;
      -webkit-text-size-adjust: none
    }

    a {
      color: #000001;
      text-decoration: none
    }

    p {
      margin: 0 !important;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    .mcnPreviewText {
      display: none !important;
    }

    .cke_editable,
    .cke_editable a,
    .cke_editable span,
    .cke_editable a span {
      color: #000001 !important;
    }

    @media only screen and (max-device-width: 480px),
    only screen and (max-width: 480px) {
      .mobile-shell {
        width: 100% !important;
        min-width: 100% !important;
        padding: 0 3px;
      }

      .bg {
        background-size: 100% auto !important;
        -webkit-background-size: 100% auto !important;
      }

      .text-header,
      .m-center {
        text-align: center !important;
      }

      .center {
        margin: 0 auto !important;
      }

      .container {
        padding: 20px 10px !important
      }

      .td {
        width: 100% !important;
        min-width: 100% !important;
      }

      .m-td,
      .m-hide {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        font-size: 0 !important;
        line-height: 0 !important;
        min-height: 0 !important;
      }

      .m-block {
        display: block !important;
      }

      .column,
      .column-dir,
      .column-top,
      .column-empty,
      .column-empty2,
      .column-dir-top {
        float: left !important;
        width: 100% !important;
        display: block !important;
      }

      .column-empty {
        padding-bottom: 30px !important;
      }

      .column-empty2 {
        padding-bottom: 10px !important;
      }

      .content-spacing {
        width: 15px !important;
      }

      @media (max-width:600px) {
        .logoimg {
          padding-top: 5px !important;
        }

        .logoimg img {
          width: 130px !important;
          height: 28px !important;
        }

        .mainhead {
          font-size: 12px !important;
        }

        table th,
        table td {
          font-size: 7px !important;
          line-height: 12px !important;
          padding-bottom: 2px !important;
        }

        table.border-table th {
          padding-top: 2px !important;
        }

        .paypd {
          padding: 0px 2px !important;
          font-size: 7px !important;
          margin-bottom: 4px !important;
        }

        .p30-15 {
          padding: 6px 0px 0 !important;
        }

        .socialimgs td,
        .socialimgs td img {
          width: 24px !important;
          height: 24px !important;
          padding: 0 1px;
        }

        .footertd {
          padding: 12px 0 !;
        }

        .bordr {
          border-top-width: 2px !important;
        }

        .mobheadpb {
          padding-bottom: 8px !important;
        }
      }
    }
  </style>
</head>

<body class="body"
  style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#ffffff; -webkit-text-size-adjust:none;">
  <span class="mcnPreviewText"
    style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;"></span>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
    <tr>
      <td align="center" valign="top">
        <div mc:repeatable="Select" mc:variant="Hero Image">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td class="m-td" valign="top" style="font-size:0pt; line-height:0pt; text-align:left;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" class="border"
                  style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%;">
                  <tr>
                    <td bgcolor="#f4f4f4" height="auto" class="border"
                      style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%;">&nbsp;</td>
                  </tr>
                </table>
              </td>
              <td valign="center" align="center" class="bordr mobile-shell" width="675" bgcolor="#ffffff"
                style="border-bottom: 3px solid #216896;">
                <table width="675" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                  <tr>
                    <td class="td"
                      style="padding-top: 60px; width:675px; min-width:675px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="p30-15" style="padding: 12px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td class="h2 pb25 mainhead"
                                  style="color:#444444; font-family:Lato, Arial ,sans-serif; font-size:22px; font-weight:bold; line-height:24px;padding-bottom:8px;">
                                  <div mc:edit="text_2">${accommodationName} </div>
                                </td>
                              </tr>
                              <tr>
                                <td class="pb25"
                                  style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:15px; padding-bottom:8px;width:100%;padding-right: 6px;">
                                  <div mc:edit="text_3">Booking ID - <b>${BookingId}</b></div>
                                </td>
                              </tr>
                              <tr>
                                <td class="pb25"
                                  style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:14px; line-height:15px; padding-bottom:0;width:100%;padding-right: 5px;">
                                  <div mc:edit="text_3">Booking Date - <span>${BookingDate}</span></div>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td class="fluid-img logoimg"
                            style="font-size:0pt; line-height:0pt; text-align:right;background:#ffffff;padding-right: 6px;">
                            <img src="https://www.pawanaicamping.com/uploads/system/logo_new_color.png" width="auto"
                              height="55" mc:edit="image_2" style="max-height:55px;" border="0" alt="Logo" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td class="m-td" valign="top" style="font-size:0pt; line-height:0pt; text-align:left;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" class="border"
                  style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%;">
                  <tr>
                    <td bgcolor="#f4f4f4" height="auto" class="border"
                      style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>


        <div mc:repeatable="Select" mc:variant="Intro">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">
            <tr>
              <td class="m-td" valign="top" style="font-size:0pt; line-height:0pt; text-align:left;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="border"
                  style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%;">
                  <tr>
                    <td bgcolor="#f4f4f4" height="150" class="border"
                      style="font-size:0pt; line-height:0pt; text-align:center; width:100%; min-width:100%;">&nbsp;</td>
                  </tr>
                </table>
              </td>
              <td valign="top" align="center" class="mobile-shell p0-15" width="675" bgcolor="#ffffff">
                <table width="675" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                  <tr>
                    <td class="td"
                      style="width:675px; min-width:675px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="bbrr" bgcolor="#ffffff" style="border-radius:0px 0px 12px 12px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td class="p30-15" style="padding: 12px;">

                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;width:50%;">
                                        <div mc:edit="text_3"><b>Dear <span>${name}</span>,</b></div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;width:50%;">
                                        <div mc:edit="text_3"><span>${accommodationName} </span> has
                                          received a request for booking of
                                          your Camping as per the details below. The primary guest <span>Vijay</span>
                                          will be
                                          carrying a copy of this e-voucher. </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;width:50%;">
                                        <div mc:edit="text_3">For your reference, Booking ID is
                                          <span><b>${BookingId}</b></span>.</div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;width:50%;">
                                        <div mc:edit="text_3"><b>The amount payable to <span>Plumeria Retreat Pawna lake
                                              AC cottage </span> for this booking
                                            is <span>INR ${advancePayable}</span> as per the details below. Please email us at
                                            <a href="mailto: booking@pawanaicamping.com"
                                              style="color: #216896;">booking@pawanaicamping.com</a> if there is any
                                            discrepancy in this payment
                                            amount.</b></div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;width:100%;">
                                        <div mc:edit="text_3">Kindly consider this e-voucher for booking confirmation
                                          with the
                                          following inclusions and services. </div>
                                      </td>
                                    </tr>
                                  </table>

                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;width:100%;">
                                        <div mc:edit="text_3"><b>Team <span>${accommodationName}
                                            </span></b></div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25"
                                        style="color:#878887; font-family:Lato, Arial,sans-serif; font-size:14px; line-height:22px; padding-bottom:8px;width:100%;text-align:right;">
                                        <div mc:edit="text_3">All prices indicated below are in INR</div>
                                      </td>
                                    </tr>
                                  </table>

                                  <table class="border-table" width="100%"
                                    style="font-family: arial, sans-serif;border-collapse: collapse;width: 100%; margin-bottom: 10px;"
                                    cellspacing="0" cellpadding="0">
                                    <tr>
                                      <th class="bordr"
                                        style="border: 1px solid #dddddd;border-top: 3px solid #216896;text-align: left;padding: 9px 7px 10px;color: #878887;font-family: Lato, Arial,sans-serif;font-size: 13.5px;line-height: 16px;">
                                        BOOKING DETAILS</th>
                                      <th class="bordr"
                                        style="border: 1px solid #dddddd;border-top: 3px solid #216896;text-align: left;padding: 9px 7px 10px;color: #878887;font-family: Lato, Arial,sans-serif;font-size: 13.5px;line-height: 16px;">
                                        PAYMENT BREAKUP</th>
                                    </tr>
                                    <tr>
                                      <td valign="top"
                                        style="border: 1px solid #dddddd;text-align: left;padding: 6px 7px 8px;color: #000000;font-family: Lato, Arial,sans-serif;font-size: 13px;line-height: 15px;">
                                        <p style="padding-bottom: 5px;margin: 0px;">Mobile: <b>${mobile}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Check In: <b>${BookingDate}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Check Out: <b>${CheckoutDate}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Total Person: <b>${totalPerson}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Adult: <b>${adult}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Child: <b>${child}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Veg Count: <b>${vegCount}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Non Veg Count: <b>${nonvegCount}</b></p>
                                        <p style="padding-bottom: 5px;margin: 0px;">Jain Count: <b>${joinCount}</b></p>
                                      </td>
                                      <td
                                        style="border: 1px solid #dddddd;text-align: left;padding: 6px 7px 8px;color: #000000;font-family: Lato, Arial,sans-serif;font-size: 14px;line-height: 16px;">
                                        <table style="width: 100%;">
                                          <tr>
                                            <td valign="top" style="width: 100%;padding-right: 8px;">
                                              <p style="padding-top: 5px;padding-bottom: 10px;margin: 0px;">
                                                <b>TARRIF</b></p>
                                              <p style="padding-bottom: 10px;margin: 0px;">Total Amount: <b
                                                  style="float:right;">${totalPrice}</b></p>
                                              <p style="padding-bottom: 10px;margin: 0px;">Advance Amount: <b
                                                  style="float:right;">${advancePayable}</b></p>
                                              <p style="padding-bottom: 10px;margin: 0px;">Remaining Amount: <b
                                                  style="float:right;">${remainingAmount}</b></p>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>

                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td class="pb25 mobheadpb"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:24px;">
                                        <div mc:edit="text_3"><b>Booking Cancellation Policy:</b> From ${BookingDate},100%
                                          penalty will be
                                          charged. In case of no show : no refund.Booking cannot be
                                          cancelled/modified on or after the booking date and time mentioned in
                                          the Camping Confirmation Voucher. All time mentioned above is in
                                          destination time.</div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25 bordr"
                                        style="color:#216896;border-bottom: 3px solid #216896; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:6px;">
                                        <div mc:edit="text_3"><b>Note</b></div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;padding-top:8px;">
                                        <div mc:edit="text_3">If your contact details have changed, please notify us so
                                          that the
                                          same can be updated in our records.</div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pb25 mobheadpb"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:24px;">
                                        <div mc:edit="text_3">If the booking is cancelled or changed by guest at a later
                                          stage,
                                          you will be notified and this confirmation email & Plumeria Retreat Pawna lake
                                          AC cottage Booking ID will be null and void.</div>
                                      </td>
                                    </tr>
                                  </table>

                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="pb25 bordr"
                                              style="color:#216896;border-bottom: 3px solid #216896; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:6px;">
                                              <div mc:edit="text_3"><b>${accommodationName} Contact
                                                  Info</b></div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td style="padding-top:8px;padding-bottom:8px;width:50%;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="pb25"
                                              style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px;">
                                              <div mc:edit="text_3"><b>${accommodationName} </b></div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td class="pb25"
                                              style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px;">
                                              <div mc:edit="text_3">At- <span>${accommodationAddress}</span></div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td class="pb25"
                                              style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px;">
                                              <div mc:edit="text_3"><span>pawna lake</span></div>
                                            </td>
                                          </tr>
                                          <!--<tr>
																										<td class="pb25" style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px;">
																											<div mc:edit="text_3"><span>Maharashtra</span>, <span>India</span></div>
																										</td>
																									</tr>-->
                                          <tr>
                                            <td class="pb25"
                                              style="color:#216896; font-family:Lato, Arial,sans-serif; font-size:14px; line-height:22px;">
                                              <div mc:edit="text_3">
                                                <a href="http://maps.google.com/maps?q=${latitude},${longitude}"
                                                  style="color: #216896;">Google Maps Link</a>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                      <td style="padding-top:8px;padding-bottom:8px;width:50%;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                          <tr>
                                            <td class="pb25"
                                              style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:14px; line-height:22px;">
                                              <div mc:edit="text_3">
                                                <span><b>Email- </b></span><span><a
                                                    href="mailto: booking@pawanaicamping.com"
                                                    style="color: #164e6f;"><b>booking@pawanaicamping.com</b></a></span>
                                              </div>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td class="pb25"
                                              style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:14px; line-height:22px;">
                                              <div mc:edit="text_3">
                                                <span><b>Contact Number- </b></span>
                                                <span>Babu</span>- <span>9923366051</span>
                                              </div>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>



                                  <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                    style="padding-top: 10px;border-top:1px solid #dddddd;">
                                    <tr>
                                      <td class="pb25"
                                        style="color:#000000; font-family:Lato, Arial,sans-serif; font-size:15px; line-height:22px; padding-bottom:8px;">
                                        <div mc:edit="text_3"><b>Note</b> - Please do not reply to this email. It has
                                          been sent from an
                                          email account that is not monitored. To ensure that you receive
                                          communication related to your booking from Plumeria Retreat Pawna lake AC
                                          cottage , please add <a href="mailto: babukale60@gmail.com"
                                            style="color: #164e6f;"><b>babukale60@gmail.com</b></a> to your contact list
                                          and
                                          address book.</div>
                                      </td>
                                    </tr>
                                  </table>

                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td class="m-td" valign="top" style="font-size:0pt; line-height:0pt; text-align:left;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" class="border"
                  style="font-size:0pt; line-height:0pt; text-align:left; width:100%; min-width:100%;">
                  <tr>
                    <td bgcolor="#f4f4f4" height="150" class="border"
                      style="font-size:0pt; line-height:0pt; text-align:left; width:100%; min-width:100%;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

      </td>
    </tr>
  </table>
</body>

</html>`
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '800px'; // Fixed width to avoid layout issues
    document.body.appendChild(container);

    // Step 2: Convert to canvas
    html2canvas(container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Booking-${BookingId}.pdf`);

      document.body.removeChild(container); // Cleanup
    }).catch(error => {
      console.error("Failed to generate PDF:", error);
      document.body.removeChild(container);
    });


    }
  const calculateTotalAmount = () => {
    const selectedAccommodation = accommodations.find(acc => acc.id === parseInt(formData.accommodation_id));
    
    if (!selectedAccommodation || !formData.check_in || !formData.check_out) return;

    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const total = selectedAccommodation.price * nights * parseInt(formData.rooms);
    
    setFormData(prev => ({ 
      ...prev, 
      total_amount: total.toFixed(2),
      discounted_amount: prev.coupon_code ? calculateDiscount(total.toString(), availableCoupons.find(c => c.code === prev.coupon_code)!) : ''
    }));
  };

  useEffect(() => {
    if (formData.check_in && formData.check_out && formData.accommodation_id) {
      calculateTotalAmount();
    }
  }, [formData.check_in, formData.check_out, formData.accommodation_id, formData.rooms]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Required field check
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

  const adults = parseInt(formData.adults);
  const children = parseInt(formData.children);
  const rooms = parseInt(formData.rooms);
  const food_veg = parseInt(formData.food_veg);
  const food_nonveg = parseInt(formData.food_nonveg);
  const food_jain = parseInt(formData.food_jain);
  const totalGuests = adults + children;
  const totalFood = food_veg + food_nonveg + food_jain;

  if (totalFood > 0 && totalFood !== totalGuests) {
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
      total_amount: parseFloat(formData.total_amount),
      advance_amount: parseFloat(formData.advance_amount || '0'),
    };

    const response = await fetch(`http://localhost:5000/admin/bookings/offline`, {
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
   
          //call in sequence plase
    downloadPdf(
  bookingPayload.guest_email,
  bookingPayload.guest_name,
  result.data.booking.id.toString(),
  bookingPayload.check_in,
  bookingPayload.check_out,
  bookingPayload.total_amount,
  bookingPayload.advance_amount,
  (bookingPayload.total_amount - bookingPayload.advance_amount),
  bookingPayload.guest_phone || '',
  bookingPayload.rooms,
  bookingPayload.adults,
  bookingPayload.children,
  bookingPayload.food_veg,
  bookingPayload.food_nonveg,
  bookingPayload.food_jain,
  accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.name || '',
  accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.address || '',
  (accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.latitude || '').toString(),
  (accommodations.find(acc => acc.id === bookingPayload.accommodation_id)?.longitude || '').toString()
);

    // setBookingData(result.data.booking);
    setBookingSuccess(true);
    navigate('/bookings');
    
  } catch (error) {
    console.error('Error creating booking:', error);
    alert(`Error creating booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setLoading(false);
  }
};


  const generatePDF = () => {
    const input = document.getElementById('booking-confirmation');
    if (!input) return;

    html2canvas(input, {
      scale: 2,
      logging: true,
      useCORS: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`booking_${bookingData.id}.pdf`);
    });
  };

  if (loading && accommodations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (bookingSuccess && bookingData) {
    return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Confirmation</h1>
            <p className="mt-1 text-sm text-gray-500">Booking #{bookingData.id} created successfully</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={generatePDF}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Download PDF
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
            >
              Back to Bookings
            </button>
          </div>
        </div>

        <div id="booking-confirmation" className="bg-white shadow rounded-lg overflow-hidden p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-navy-700">Plumeria Retreat</h2>
            <p className="text-gray-600">Booking Confirmation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Guest Information</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Name:</span> {bookingData.guest_name}</p>
                <p><span className="font-medium">Email:</span> {bookingData.guest_email}</p>
                <p><span className="font-medium">Phone:</span> {bookingData.guest_phone || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Details</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Booking ID:</span> {bookingData.id}</p>
                <p><span className="font-medium">Accommodation:</span> {bookingData.accommodation_name}</p>
                <p><span className="font-medium">Check-in:</span> {new Date(bookingData.check_in).toLocaleDateString()}</p>
                <p><span className="font-medium">Check-out:</span> {new Date(bookingData.check_out).toLocaleDateString()}</p>
                <p><span className="font-medium">Guests:</span> {bookingData.adults} Adults, {bookingData.children} Children</p>
                <p><span className="font-medium">Rooms:</span> {bookingData.rooms}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Food Preferences</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p><span className="font-medium">Veg:</span> {bookingData.food_veg}</p>
              </div>
              <div>
                <p><span className="font-medium">Non-Veg:</span> {bookingData.food_nonveg}</p>
              </div>
              <div>
                <p><span className="font-medium">Jain:</span> {bookingData.food_jain}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Information</h3>
            <div className="space-y-1">
              <p><span className="font-medium">Total Amount:</span> ₹{parseFloat(bookingData.total_amount).toFixed(2)}</p>
              {bookingData.discounted_amount && (
                <p><span className="font-medium">Discounted Amount:</span> ₹{parseFloat(bookingData.discounted_amount).toFixed(2)}</p>
              )}
              <p><span className="font-medium">Advance Paid:</span> ₹{parseFloat(bookingData.advance_amount).toFixed(2)}</p>
              <p><span className="font-medium">Balance Due:</span> ₹{(parseFloat(bookingData.discounted_amount || bookingData.total_amount) - parseFloat(bookingData.advance_amount)).toFixed(2)}</p>
              <p><span className="font-medium">Payment Method:</span> {bookingData.payment_method}</p>
              <p><span className="font-medium">Status:</span> <span className="text-green-600">Confirmed</span></p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Accommodation Address</h3>
            <p>{bookingData.accommodation_address}</p>
          </div>
        </div>
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
                      {acc.name} - ₹{acc.price}/night
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
                  min="1"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  required
                />
              </div>
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
                  value={formData.food_jain}
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

              {formData.discounted_amount && (
                <div>
                  <label htmlFor="discounted_amount" className="block text-sm font-medium text-gray-700">
                    Discounted Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="discounted_amount"
                    name="discounted_amount"
                    step="0.01"
                    value={formData.discounted_amount}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm bg-gray-100"
                  />
                </div>
              )}

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