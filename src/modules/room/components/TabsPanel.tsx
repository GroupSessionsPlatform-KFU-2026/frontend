import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare } from 'lucide-react';
import Participants from './Participants';
import Chat from './Chat';

interface TabsPanelProps {
  roomId: string;
}

const TabsPanel = ({ roomId }: TabsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'participants' | 'chat'>('participants');

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border overflow-hidden">
      {/* Вкладки */}
      <div className="flex border-b shrink-0">
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${
              activeTab === 'participants'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          <Users className="w-4 h-4" />
          Участники
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2
            ${
              activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          <MessageSquare className="w-4 h-4" />
          Чат
        </button>
      </div>

      {/* Контент вкладок */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'participants' ? <Participants roomId={roomId} /> : <Chat roomId={roomId} />}
      </div>
    </div>
  );
};

export default TabsPanel;
