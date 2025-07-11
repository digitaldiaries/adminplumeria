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
  adultPrice?: number;
  childPrice?: number;
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
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

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
                                        <p style="padding-bottom: 5px;margin: 0px;">Total Room: <b>${totalPerson}</b></p>
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
  const fetchAccommodationDetails = async (id: string) => {
    try {
      const response = await fetch(`${_BASE_URL}/admin/properties/accommodations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch accommodation details');
      }
      const data = await response.json();
      const accommodation: Accommodation = {
        id: data.id,
        name: data.basicInfo.name,
        description: data.basicInfo.description,
        price: data.basicInfo.price,
        available_rooms: data.basicInfo.rooms,
        amenities: data.amenities,
        address: data.location.address,
        latitude: data.location.coordinates.latitude,
        longitude: data.location.coordinates.longitude,
        adultPrice: data.packages.pricing.adult,
        childPrice: data.packages.pricing.child
      };
      setSelectedAccommodation(accommodation);
    } catch (error) {
      console.error('Error fetching accommodation details:', error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Reset coupon when coupon code changes
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
    // Auto-set check_out to next day when check_in changes
    if (formData.check_in) {
      const nextDay = new Date(formData.check_in);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      
      // Only set if check_out is empty or before/equal to check_in
      if (!formData.check_out || new Date(formData.check_out) <= new Date(formData.check_in)) {
        setFormData(prev => ({ ...prev, check_out: nextDayString }));
      }
    }
  }, [formData.check_in]);

  const calculateDiscount = (totalAmount: string, coupon: Coupon): string => {
    if (!totalAmount || !coupon) return totalAmount;

    const total = parseFloat(totalAmount);
    const discount = parseFloat(coupon.discount);
    const minAmount = coupon.minAmount ? parseFloat(coupon.minAmount) : 0;
    const maxDiscount = coupon.maxDiscount ? parseFloat(coupon.maxDiscount) : Infinity;

    if (total < minAmount) {
      return totalAmount; // Skip discount if min amount not met
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

  // Calculate total whenever relevant values change
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
    const rooms = parseInt(formData.rooms) || 0;

    const adultPrice = (selectedAccommodation.adultPrice || 0) * adults * rooms;
    const childPrice = (selectedAccommodation.childPrice || 0) * children * rooms;
    const total = adultPrice + childPrice;

    let discountedAmount = total;

    // Apply coupon if exists
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
    console.log("Total Guests  ",totalGuests," totalFood  ",totalFood);
     if (totalFood !== totalGuests) {
     alert('Food preferences must match total guests count');
     return;
   }
    if (totalFood > 0 && (totalFood !== totalGuests)) {
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
     
      setBookingSuccess(true);

      // Download PDF would be called here
      // downloadPdf(...);
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