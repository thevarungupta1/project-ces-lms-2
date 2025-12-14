import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sampleNotifications } from '@/data/notifications';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [deletedNotifications, setDeletedNotifications] = useState<Set<string>>(new Set());

  // Use local sample data instead of Supabase
  const notifications = useMemo(() => {
    if (!user?.email) return [];

    // Filter notifications by user email (matching user_id)
    const userNotifications = sampleNotifications
      .filter(n => n.user_id === user.email && !deletedNotifications.has(n.id))
      .map(n => ({
        ...n,
        read: readNotifications.has(n.id) || n.read,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return userNotifications;
  }, [user?.email, readNotifications, deletedNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const loading = false;

  const markAsRead = (id: string) => {
    setReadNotifications(prev => new Set(prev).add(id));
  };

  const markAllAsRead = () => {
    if (!user?.email) return;
    const allIds = notifications.filter(n => !n.read).map(n => n.id);
    setReadNotifications(prev => new Set([...prev, ...allIds]));
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setDeletedNotifications(prev => new Set(prev).add(id));
    // If it was unread, we don't need to update unreadCount as it's computed
  };

  const refetch = () => {
    // No-op for local data, but kept for API compatibility
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  };
}
