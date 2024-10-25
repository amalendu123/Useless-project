import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [events, setEvents] = useState({});

  // Get calendar details
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  // Handle date selection and event addition
  const handleDateClick = (day) => {
    if (day) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateStr);
      setShowEventForm(true);
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (eventTitle && selectedDate) {
      setEvents(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), eventTitle]
      }));
      setEventTitle('');
      setShowEventForm(false);
    }
  };

  const handleRemoveEvent = (date, index) => {
    setEvents(prev => ({
      ...prev,
      [date]: prev[date].filter((_, i) => i !== index)
    }));
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto p-10">
    
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

     
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dateStr = day ? 
            `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : 
            null;
          const hasEvents = dateStr && events[dateStr]?.length > 0;
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-24 p-2 border rounded-lg
                ${day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'}
                ${hasEvents ? 'border-blue-200' : 'border-gray-200'}
              `}
            >
              {day && (
                <>
                  <div className="flex justify-between items-start">
                    <span className={`text-sm ${hasEvents ? 'font-semibold ' : ''}`}>
                      {day}
                    </span>
                    {hasEvents && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <div className="mt-1">
                    {events[dateStr]?.map((event, i) => (
                      <div 
                        key={i}
                        className="text-xs bg-blue-100 rounded p-1 mb-1 flex justify-between items-center"
                      >
                        <span className="truncate text-black">{event}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEvent(dateStr, i);
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Add Event for {selectedDate && formatDate(selectedDate)}
            </h3>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
                className="w-full p-2 border rounded mb-4 text-black"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventForm(false);
                    setEventTitle('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;