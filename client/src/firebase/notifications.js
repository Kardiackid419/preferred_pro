import { db } from './config';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getMessaging, getToken } from 'firebase/messaging';

// Notification channels
export const CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in_app'
};

// Get push notification permission
export const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
    });
    
    // Store the token in user's profile
    if (token) {
      const { currentUser } = auth;
      await updateDoc(doc(db, 'users', currentUser.uid), {
        pushToken: token
      });
    }
    
    return token;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

// Create notification across all channels
export const createNotification = async (userId, jobId, type) => {
  try {
    // Get user preferences
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userPrefs = userDoc.data().notificationPreferences || {
      email: true,
      sms: true,
      push: true,
      in_app: true
    };

    const notification = {
      userId,
      jobId,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Add to notifications collection (in-app)
    if (userPrefs.in_app) {
      await addDoc(collection(db, 'notifications'), notification);
    }

    // Trigger cloud function for multi-channel delivery
    const functions = getFunctions();
    const sendMultiChannelNotification = httpsCallable(functions, 'sendMultiChannelNotification');
    await sendMultiChannelNotification({
      userId,
      jobId,
      type,
      channels: userPrefs
    });

    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true
    });
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}; 