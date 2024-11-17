import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Eye } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://useless-project-klib.onrender.com//calender';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventViewer, setShowEventViewer] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/events/`, {
        params: {
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        }
      });

      const eventsByDate = response.data.reduce((acc, event) => {
        const date = event.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({ id: event.id, title: event.title });
        return acc;
      }, {});

      setEvents(eventsByDate);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleDateClick = (day, e) => {
    if (!day) return;
    
    const dateStr = formatDateForAPI(currentDate, day);
    setSelectedDate(dateStr);

    // If Add Event button is clicked, show event form
    if (e.target.closest('.add-event-btn')) {
      setShowEventForm(true);
      setShowEventViewer(false);
    } else {
      // Otherwise show event viewer if there are events
      const dateEvents = events[dateStr] || [];
      setSelectedEvents(dateEvents);
      setShowEventViewer(true);
      setShowEventForm(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (eventTitle && selectedDate) {
      try {
        const response = await axios.post(`${API_BASE_URL}/events/`, {
          title: eventTitle,
          date: selectedDate
        });
        
        setEvents(prev => ({
          ...prev,
          [selectedDate]: [...(prev[selectedDate] || []), { 
            id: response.data.id,
            title: response.data.title 
          }]
        }));

        setEventTitle('');
        setShowEventForm(false);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
  };

  const handleRemoveEvent = async (date, eventId) => {
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}/`);
      setEvents(prev => ({
        ...prev,
        [date]: prev[date].filter(event => event.id !== eventId)
      }));
      // Update selected events if viewer is open
      if (showEventViewer) {
        setSelectedEvents(prev => prev.filter(event => event.id !== eventId));
      }
    } catch (error) {
      console.error('Error removing event:', error);
    }
  };

  const formatDateForAPI = (date, day) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

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
    <div className="max-w-4xl mx-auto p-6">
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
      
      {loading && (
        <div className="text-center py-4">Loading events...</div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dateStr = day ? formatDateForAPI(currentDate, day) : null;
          const hasEvents = dateStr && events[dateStr]?.length > 0;
          
          return (
            <div
              key={index}
              onClick={(e) => handleDateClick(day, e)}
              className={`
                min-h-24 p-2 border rounded-lg relative
                ${day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'}
                ${hasEvents ? 'border-blue-200' : 'border-gray-200'}
              `}
            >
              {day && (
                <>
                  <div className="flex justify-between items-start">
                    <span className={`text-sm ${hasEvents ? 'font-semibold' : ''}`}>
                      {day}
                    </span>
                    <div className="flex gap-1">
                      {hasEvents && (
                        <button 
                          className="view-event-btn p-1 hover:bg-blue-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateClick(day, e);
                          }}
                        >
                          <Eye className="w-3 h-3 text-blue-500" />
                        </button>
                      )}
                      <button 
                        className="add-event-btn p-1 hover:bg-blue-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDateClick(day, e);
                        }}
                      >
                        <Plus className="w-3 h-3 text-blue-500" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1">
                    {events[dateStr]?.slice(0, 2).map((event) => (
                      <div 
                        key={event.id}
                        className="text-xs bg-blue-100 rounded p-1 mb-1 flex justify-between items-center"
                      >
                        <span className="truncate text-black">{event.title}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEvent(dateStr, event.id);
                          }}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {events[dateStr]?.length > 2 && (
                      <div className="text-xs text-blue-500">
                        +{events[dateStr].length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Viewer Modal */}
      {showEventViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-black">
                Events for {selectedDate && formatDate(selectedDate)}
              </h3>
              <button
                onClick={() => setShowEventViewer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {selectedEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No events for this date</p>
              ) : (
                selectedEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="bg-blue-50 rounded-lg p-3 mb-2 flex justify-between items-center"
                  >
                    <span className="text-black">{event.title}</span>
                    <button
                      onClick={() => handleRemoveEvent(selectedDate, event.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowEventViewer(false);
                  setShowEventForm(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add New Event
              </button>
            </div>
          </div>
        </div>
      )}

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