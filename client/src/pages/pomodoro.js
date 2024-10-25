import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, MessageSquare, Youtube, Twitter, Instagram, Mail } from 'lucide-react';

const notifications = [
  {
    type: 'message',
    icon: MessageSquare,
    title: 'New Message',
    messages: [
      'Hey, want to grab lunch?',
      'Meeting in 10 minutes!',
      'Did you see the project update?',
      'Can we discuss the new features?'
    ]
  },
  {
    type: 'youtube',
    icon: Youtube,
    title: 'YouTube',
    messages: [
      'New video from your favorite creator!',
      'Your subscribed channel just went live',
      'Trending: "The Best Productivity Tips"',
      'New upload: "How to Stay Focused"'
    ]
  },
  {
    type: 'twitter',
    icon: Twitter,
    title: 'Twitter',
    messages: [
      'Your tweet is going viral!',
      'New mentions in your feed',
      'Breaking news in your network',
      'Your friend just posted something'
    ]
  },
  {
    type: 'instagram',
    icon: Instagram,
    title: 'Instagram',
    messages: [
      'New followers on Instagram',
      'Your post received 100 likes',
      'Someone mentioned you in their story',
      'New direct message received'
    ]
  },
  {
    type: 'email',
    icon: Mail,
    title: 'Email',
    messages: [
      'Important: Project deadline reminder',
      'New client proposal received',
      'Team meeting schedule updated',
      'Weekly newsletter arrived'
    ]
  }
];

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [activeNotifications, setActiveNotifications] = useState([]);


  const generateNotification = () => {
    const notificationType = notifications[Math.floor(Math.random() * notifications.length)];
    const message = notificationType.messages[Math.floor(Math.random() * notificationType.messages.length)];
    const id = Date.now();

    const newNotification = {
      id,
      type: notificationType.type,
      icon: notificationType.icon,
      title: notificationType.title,
      message,
      timestamp: new Date().toLocaleTimeString()
    };

    setActiveNotifications(prev => [newNotification, ...prev].slice(0, 5));

    // Play notification sound
    const notification = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA');
    notification.play();
  };

  // Random notification generator
  useEffect(() => {
    let notificationInterval;
    if (isActive && mode === 'work') {
      notificationInterval = setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
          generateNotification();
        }
      }, 15000); // Check every 15 seconds
    }
    return () => clearInterval(notificationInterval);
  }, [isActive, mode]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(interval);
          const notification = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA');
          notification.play();

          if (mode === 'work') {
            setMode('break');
            setMinutes(5);
          } else {
            setMode('work');
            setMinutes(25);
          }
          setSeconds(0);
          setIsActive(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const removeNotification = (id) => {
    setActiveNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'message':
        return 'text-blue-500';
      case 'youtube':
        return 'text-red-500';
      case 'twitter':
        return 'text-blue-400';
      case 'instagram':
        return 'text-pink-500';
      case 'email':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-3xl font-bold mb-8 text-black">
            {mode === 'work' ? 'Work Time' : 'Break Time'}
          </h1>

          <div className="text-6xl font-bold mb-8 text-gray-800">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleTimer}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full"
            >
              {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-full"
            >
              <RotateCcw className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {activeNotifications.length > 0 ? (
        <div className="w-96 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-2">
            {activeNotifications.map(notification => (
              <div
                key={notification.id}
                className="bg-white rounded-lg p-4 shadow-md relative hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${getIconColor(notification.type)}`}>
                    <notification.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-sm text-gray-400 mt-1">{notification.timestamp}</p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {activeNotifications.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No notifications
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>

  );
};

export default Pomodoro;