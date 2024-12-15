import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { requestNotificationPermission } from '../firebase/notifications';

function NotificationPreferences() {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState({
    email: true,
    sms: true,
    push: true,
    in_app: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userPrefs = userDoc.data().notificationPreferences;
      if (userPrefs) {
        setPreferences(userPrefs);
      }
    };

    loadPreferences();
  }, [currentUser]);

  const handleToggle = async (channel) => {
    try {
      setLoading(true);
      
      // If enabling push notifications, request permission
      if (channel === 'push' && !preferences.push) {
        await requestNotificationPermission();
      }

      const newPreferences = {
        ...preferences,
        [channel]: !preferences[channel]
      };

      await updateDoc(doc(db, 'users', currentUser.uid), {
        notificationPreferences: newPreferences
      });

      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Preferences</h3>
      
      <div className="space-y-2">
        {Object.entries(preferences).map(([channel, enabled]) => (
          <div key={channel} className="flex items-center justify-between">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => handleToggle(channel)}
                disabled={loading}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-gray-900 capitalize">{channel.replace('_', ' ')} Notifications</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPreferences; 