import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getNotifications, 
  getUnreadNotificationsCount,
  addNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '../utils/localStorageUtils';

/**
 * @typedef {Object} NotificationsContextType
 * @property {import('../types').Notification[]} notifications
 * @property {number} unreadCount
 * @property {boolean} loading
 * @property {string|null} error
 * @property {function(import('../types').Notification): Promise<import('../types').Notification>} addNotification
 * @property {function(string): Promise<void>} markAsRead
 * @property {function(): Promise<void>} markAllAsRead
 * @property {function(string): Promise<void>} deleteNotification
 * @property {function(): void} refreshNotifications
 */

const NotificationsContext = createContext(undefined);

/**
 * Provider component for notifications context
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notificationData = getNotifications();
        setNotifications(notificationData);
        setUnreadCount(getUnreadNotificationsCount());
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Add a new notification
  const addNotificationHandler = async (notificationData) => {
    try {
      const newNotification = addNotification(notificationData);
      setNotifications(prevNotifications => [...prevNotifications, newNotification]);
      setUnreadCount(prevCount => prevCount + 1);
      return newNotification;
    } catch (err) {
      setError('Failed to add notification');
      throw err;
    }
  };

  // Mark a notification as read
  const markAsReadHandler = async (id) => {
    try {
      markNotificationAsRead(id);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(getUnreadNotificationsCount());
    } catch (err) {
      setError('Failed to mark notification as read');
      throw err;
    }
  };

  // Mark all notifications as read
  const markAllAsReadHandler = async () => {
    try {
      markAllNotificationsAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to mark all notifications as read');
      throw err;
    }
  };

  // Delete a notification
  const deleteNotificationHandler = async (id) => {
    try {
      const notification = notifications.find(n => n.id === id);
      deleteNotification(id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
      if (notification && !notification.read) {
        setUnreadCount(prevCount => prevCount - 1);
      }
    } catch (err) {
      setError('Failed to delete notification');
      throw err;
    }
  };

  // Refresh notifications data
  const refreshNotifications = () => {
    try {
      const notificationData = getNotifications();
      setNotifications(notificationData);
      setUnreadCount(getUnreadNotificationsCount());
    } catch (err) {
      setError('Failed to refresh notifications');
      console.error(err);
    }
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      error,
      addNotification: addNotificationHandler,
      markAsRead: markAsReadHandler,
      markAllAsRead: markAllAsReadHandler,
      deleteNotification: deleteNotificationHandler,
      refreshNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

/**
 * Hook to use the notifications context
 * @returns {NotificationsContextType}
 */
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}; 