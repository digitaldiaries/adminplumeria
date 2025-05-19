import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';

const Calendar: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleDayClick = (day: Date) => {
    const isSelected = selectedDays.some(
      (selectedDay) => format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    if (isSelected) {
      setSelectedDays(selectedDays.filter(
        (selectedDay) => format(selectedDay, 'yyyy-MM-dd') !== format(day, 'yyyy-MM-dd')
      ));
    } else {
      setSelectedDays([...selectedDays, day]);
      setShowForm(true);
    }
  };

  const handleSaveBlockedDates = () => {
    // In a real application, this would save to a database
    console.log('Blocked dates:', {
      dates: selectedDays,
      reason: reason
    });
    setShowForm(false);
    setReason('');
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">Block dates when the resort is unavailable</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-6 w-6 text-navy-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Select Dates to Block</h2>
          </div>
          <DayPicker
            mode="multiple"
            selected={selectedDays}
            onDayClick={handleDayClick}
            className="custom-calendar"
            modifiersStyles={{
              selected: {
                backgroundColor: '#1e3a8a',
                color: 'white'
              }
            }}
          />
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Block Date Details</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selected Dates
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedDays.map((day) => format(day, 'MMMM d, yyyy')).join(', ')}
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Blocking
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-navy-500 focus:border-navy-500 sm:text-sm"
                  placeholder="Enter reason for blocking these dates..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBlockedDates}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500"
                >
                  Save Blocked Dates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;