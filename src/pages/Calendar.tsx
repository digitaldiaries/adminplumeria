import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X, Trash2, Edit2, AlertCircle, CheckCircle } from 'lucide-react';

const admin_BASE_URL = 'https://plumeriaadminback-production.up.railway.app/admin';

const Calendar = () => {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingDate, setEditingDate] = useState<BlockedDate | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch blocked dates from backend
  const fetchBlockedDates = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${admin_BASE_URL}/blocked-dates`);
      const data = await response.json();
      
      if (data.success) {
        setBlockedDates(data.data);
      } else {
        setError('Failed to fetch blocked dates');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  interface BlockedDate {
    id: number;
    blocked_date: string;
    reason?: string;
  }

  const handleDayClick = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const isBlocked = blockedDates.some((blocked: BlockedDate) => blocked.blocked_date === dayStr);
    
    if (isBlocked) {
      // If clicking on a blocked date, allow editing
      const blockedDate = blockedDates.find((blocked: BlockedDate) => blocked.blocked_date === dayStr);
      if (blockedDate) {
        setEditingDate(blockedDate);
        setReason(blockedDate.reason || '');
        setShowForm(true);
      }
      return;
    }

    const isSelected = selectedDays.some(
      (selectedDay: Date) => format(selectedDay, 'yyyy-MM-dd') === dayStr
    );

    if (isSelected) {
      setSelectedDays(selectedDays.filter(
        (selectedDay: Date) => format(selectedDay, 'yyyy-MM-dd') !== dayStr
      ));
    } else {
      setSelectedDays([...selectedDays, day]);
      setShowForm(true);
    }
  };

  const handleSaveBlockedDates = async () => {
    if (selectedDays.length === 0 && !editingDate) {
      setError('Please select at least one date');
      return;
    }

    try {
      setLoading(true);
      
      if (editingDate) {
        // Update existing blocked date
        const response = await fetch(`${admin_BASE_URL}/blocked-dates/${editingDate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason }),
        });

        const data = await response.json();
        
        if (data.success) {
          setSuccess('Blocked date updated successfully');
          await fetchBlockedDates();
        } else {
          setError(data.message || 'Failed to update blocked date');
        }
      } else {
        // Add new blocked dates
        const dates = selectedDays.map(day => format(day, 'yyyy-MM-dd'));
        
        const response = await fetch(`${admin_BASE_URL}/blocked-dates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dates, reason }),
        });

        const data = await response.json();
        
        if (data.success) {
          const insertedCount = data.data.inserted.length;
          const duplicateCount = data.data.duplicates.length;
          
          let message = `Successfully blocked ${insertedCount} date(s)`;
          if (duplicateCount > 0) {
            message += ` (${duplicateCount} date(s) were already blocked)`;
          }
          
          setSuccess(message);
          setSelectedDays([]);
          await fetchBlockedDates();
        } else {
          setError(data.message || 'Failed to save blocked dates');
        }
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
      setShowForm(false);
      setEditingDate(null);
      setReason('');
    }
  };

  const handleRemoveBlockedDate = async (date: BlockedDate) => {
    if (!confirm(`Are you sure you want to unblock ${format(new Date(date.blocked_date), 'MMMM d, yyyy')}?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${admin_BASE_URL}/blocked-dates/${date.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Blocked date removed successfully');
        await fetchBlockedDates();
      } else {
        setError(data.message || 'Failed to remove blocked date');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedDays([]);
    setReason('');
    setEditingDate(null);
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedDates.some(blocked => blocked.blocked_date === dateStr);
  };

  const isDateSelected = (date: Date) => {
    return selectedDays.some(selected => format(selected, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
  };

  const getDayClassName = (date: Date) => {
    let className = 'calendar-day';
    
    if (isDateBlocked(date)) {
      className += ' blocked-date';
    } else if (isDateSelected(date)) {
      className += ' selected-date';
    }
    
    return className;
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  interface NavigateMonthProps {
    direction: number;
  }

  const navigateMonth = (direction: number): void => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const calendarDays = generateCalendarDays();
  const monthYear = format(currentDate, 'MMMM yyyy');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Calendar</h1>
        <p className="mt-2 text-gray-600">Block dates when the resort is unavailable</p>
      </div>

      {/* Alerts */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
              Select Dates to Block
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                ←
              </button>
              <span className="text-lg font-medium min-w-[140px] text-center">
                {monthYear}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const blocked = isDateBlocked(day);
              const selected = isDateSelected(day);
              
              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day)}
                  disabled={loading}
                  className={`
                    p-2 text-sm rounded-md transition-colors
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    ${blocked ? 'bg-red-100 text-red-700 font-semibold' : ''}
                    ${selected ? 'bg-blue-100 text-blue-700 font-semibold' : ''}
                    ${!blocked && !selected ? 'hover:bg-gray-100' : ''}
                    ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
              <span>Blocked dates</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
              <span>Selected dates</span>
            </div>
          </div>
        </div>

        {/* Form and Blocked Dates List */}
        <div className="space-y-6">
          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingDate ? 'Edit Blocked Date' : 'Block Selected Dates'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingDate ? 'Selected Date' : 'Selected Dates'}
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                    {editingDate
                      ? format(new Date(editingDate.blocked_date), 'MMMM d, yyyy')
                      : selectedDays.map(day => format(day, 'MMMM d, yyyy')).join(', ')
                    }
                  </div>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Blocking
                  </label>
                  <textarea
                    id="reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter reason for blocking these dates..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBlockedDates}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingDate ? 'Update' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Blocked Dates List */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Currently Blocked Dates ({blockedDates.length})
            </h3>
            
            {blockedDates.length === 0 ? (
              <p className="text-gray-500 text-sm">No dates are currently blocked.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {blockedDates.map((date) => (
                  <div
                    key={date.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {format(new Date(date.blocked_date), 'MMMM d, yyyy')}
                      </div>
                      {date.reason && (
                        <div className="text-xs text-gray-600 mt-1">
                          {date.reason}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingDate(date);
                          setReason(date.reason || '');
                          setShowForm(true);
                        }}
                        disabled={loading}
                        className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveBlockedDate(date)}
                        disabled={loading}
                        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;