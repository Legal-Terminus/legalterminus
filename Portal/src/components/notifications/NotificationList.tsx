import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

interface Props {
  onClose: () => void;
}

export default function NotificationList({ onClose }: Props) {
  const navigate = useNavigate();
  const { data: notifications = [], markRead, markAllRead } = useNotifications();

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-3 border-b">
        <span className="font-semibold text-sm">Notifications</span>
        <div className="flex gap-2">
          <button onClick={() => markAllRead()} className="text-xs text-blue-600 hover:underline">
            Mark all read
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xs">
            ✕
          </button>
        </div>
      </div>
      <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
        {notifications.length === 0 && (
          <li className="p-4 text-sm text-gray-500 text-center">No notifications</li>
        )}
        {notifications.map((n) => (
          <li
            key={n.id}
            onClick={() => { markRead(n.id); if (n.taskId) { navigate(`/tasks/${n.taskId}`); onClose(); } }}
            className={`p-3 cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-blue-50' : ''}`}
          >
            <p className="text-sm font-medium text-gray-800">{n.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => { navigate('/notifications'); onClose(); }}
        className="w-full text-center text-xs text-blue-600 hover:underline p-2.5 border-t"
      >
        View all notifications
      </button>
    </div>
  );
}
