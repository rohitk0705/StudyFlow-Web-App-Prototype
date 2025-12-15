import { useState } from "react";
import { Bell } from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";

export function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-6 right-6 z-40">
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-4 bg-white rounded-full shadow-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all hover:scale-110"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse">
            3
          </div>
        </button>
      </div>

      <NotificationPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}
