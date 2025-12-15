import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Bell, X, Clock, BookOpen, AlertCircle } from "lucide-react";
import { format, addHours } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "reminder" | "tip" | "alert";
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Study Session Starting Soon",
      message: "Your LIC study session is scheduled in 30 minutes",
      time: format(addHours(new Date(), 0), "hh:mm a"),
      type: "reminder",
      read: false,
    },
    {
      id: "2",
      title: "Daily Goal Achievement",
      message: "Great job! You've completed 75% of today's study plan",
      time: format(addHours(new Date(), -2), "hh:mm a"),
      type: "tip",
      read: false,
    },
    {
      id: "3",
      title: "Upcoming Exam Alert",
      message: "Your ADCom exam is in 5 days. Stay focused!",
      time: format(addHours(new Date(), -4), "hh:mm a"),
      type: "alert",
      read: true,
    },
    {
      id: "4",
      title: "Break Reminder",
      message: "You've been studying for 90 minutes. Take a 10-minute break!",
      time: format(addHours(new Date(), -5), "hh:mm a"),
      type: "reminder",
      read: true,
    },
    {
      id: "5",
      title: "Pro Tip",
      message: "Review yesterday's topics for better retention",
      time: format(addHours(new Date(), -6), "hh:mm a"),
      type: "tip",
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "tip":
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBackground = (type: string) => {
    switch (type) {
      case "reminder":
        return "bg-blue-50 border-blue-200";
      case "tip":
        return "bg-green-50 border-green-200";
      case "alert":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl border border-gray-200 mt-16 mr-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-900" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
              <h2 className="text-xl text-gray-900">Notifications</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all ${getBackground(
                  notification.type
                )} ${notification.read ? "opacity-60" : "opacity-100"}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm text-gray-900">
                        {notification.title}
                      </h4>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={() =>
              setNotifications(
                notifications.map((n) => ({ ...n, read: true }))
              )
            }
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Mark All as Read
          </Button>
        </div>
      </Card>
    </div>
  );
}
