import React from 'react';
import type { Email } from '../../types/email.types';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  selectedEmails?: Set<string>;
  onToggleSelection?: (emailId: string) => void;
  onSelectAll?: () => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmailId,
  onEmailSelect,
  selectedEmails = new Set(),
  onToggleSelection,
  onSelectAll,
}) => {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (emails.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-white border-r border-gray-200">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-sm">No emails found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
      {/* Select All Header */}
      {onSelectAll && onToggleSelection && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={emails.length > 0 && emails.every(e => selectedEmails.has(e.id))}
            onChange={onSelectAll}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {selectedEmails.size > 0 ? `${selectedEmails.size} selected` : 'Select all'}
          </span>
        </div>
      )}

      <div className="divide-y divide-gray-200 flex-1">
        {emails.map((email) => (
          <div key={email.id} className="flex items-center hover:bg-blue-50/50 transition-all duration-150">
            {onToggleSelection && (
              <div className="px-3 py-3.5">
                <input
                  type="checkbox"
                  checked={selectedEmails.has(email.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelection(email.id);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <button
              onClick={() => onEmailSelect(email.id)}
              className={`
                flex-1 text-left px-4 py-3.5 transition-all duration-150
                ${selectedEmailId === email.id ? 'bg-blue-100/60 border-l-4 border-blue-600 shadow-sm' : 'border-l-4 border-transparent'}
                ${!email.read ? 'bg-blue-50/40 font-medium' : ''}
              `}
            >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm truncate ${!email.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {email.from.name}
                  </span>
                  {email.starred && <span className="text-yellow-500">⭐</span>}
                </div>
                <p className={`text-sm truncate mb-1 ${!email.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {email.preview}
                </p>
                {email.attachments && email.attachments.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-400">📎</span>
                    <span className="text-xs text-gray-400">
                      {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatDate(email.date)}
                </span>
                {!email.read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
            </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
