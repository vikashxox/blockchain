import React, { useState } from 'react';
import { X, Mail, MessageSquare, Clock, CheckCheck, Trash2 } from 'lucide-react';
import { useElectionStore, OutboxMessage } from '../store/electionStore';

export const OutboxModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { outbox, markOutboxRead } = useElectionStore();
  const [filter, setFilter] = useState<'ALL' | 'SMS' | 'EMAIL'>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<OutboxMessage | null>(null);

  if (!isOpen) return null;

  const filtered = outbox.filter(m => (filter === 'ALL' ? true : m.channel === filter));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-ivory border-2 border-warmBorder rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-charcoal">
        {/* Modal Header */}
        <div className="bg-govNavy text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-govSaffron" />
            <div>
              <h3 className="font-serif font-bold text-base">Simulated ECI Communications Outbox</h3>
              <p className="text-[11px] text-cream-200">
                SMS & Email dispatches sent to voters during registration, approval & voting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/20 transition text-cream-200 hover:text-white"
            aria-label="Close Outbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Actions Bar */}
        <div className="bg-cream-100 border-b border-warmBorder px-5 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded font-medium ${
                filter === 'ALL' ? 'bg-govNavy text-white' : 'hover:bg-cream-200 text-charcoal'
              }`}
            >
              All ({outbox.length})
            </button>
            <button
              onClick={() => setFilter('SMS')}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 ${
                filter === 'SMS' ? 'bg-govNavy text-white' : 'hover:bg-cream-200 text-charcoal'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              SMS ({outbox.filter(m => m.channel === 'SMS').length})
            </button>
            <button
              onClick={() => setFilter('EMAIL')}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 ${
                filter === 'EMAIL' ? 'bg-govNavy text-white' : 'hover:bg-cream-200 text-charcoal'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              Email ({outbox.filter(m => m.channel === 'EMAIL').length})
            </button>
          </div>

          <button
            onClick={markOutboxRead}
            className="text-govNavy hover:underline flex items-center gap-1 text-[11px] font-semibold"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
          </button>
        </div>

        {/* Message List or Detail */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-charcoal-muted">
              <Mail className="w-10 h-10 mx-auto text-warmBorder mb-2" />
              <p className="font-medium text-sm">No notifications in outbox yet.</p>
              <p className="text-xs">Messages generated during voter registration and voting will appear here.</p>
            </div>
          ) : (
            filtered.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedMessage?.id === msg.id
                    ? 'border-govNavy bg-white shadow-md'
                    : 'border-warmBorder bg-white/70 hover:bg-white hover:border-govSaffron'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {msg.channel === 'SMS' ? (
                      <span className="p-1 rounded bg-blue-100 text-blue-700">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-amber-100 text-amber-700">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="font-semibold text-xs text-govNavy">
                      To: {msg.recipient}
                    </span>
                    {msg.subject && (
                      <span className="text-xs text-charcoal font-medium hidden sm:inline">
                        — {msg.subject}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-charcoal-muted">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-charcoal/90 whitespace-pre-line font-mono bg-cream-50 p-2.5 rounded border border-warmBorder/60">
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-cream-100 border-t border-warmBorder px-5 py-2.5 flex items-center justify-between text-xs">
          <span className="text-[11px] text-charcoal-muted">
            Simulated notification delivery engine (Web-only mock)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-govNavy text-white rounded font-medium hover:bg-govNavy-light transition"
          >
            Close Outbox
          </button>
        </div>
      </div>
    </div>
  );
};
