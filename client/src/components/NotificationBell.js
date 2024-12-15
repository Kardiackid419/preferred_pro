import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUnreadNotifications, markNotificationAsRead } from '../firebase/notifications';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser) {
        const unreadNotifications = await getUnreadNotifications(currentUser.uid);
        setNotifications(unreadNotifications);
      }
    };

    fetchNotifications();
    
    // Set up real-time listener for new notifications
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid),
        where('read', '==', false)
      ),
      (snapshot) => {
        const newNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(newNotifications);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleNotificationClick = async (notification) => {
    await markNotificationAsRead(notification.id);
    setNotifications(notifications.filter(n => n.id !== notification.id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
    </div>
  );
}

export default NotificationBell; 