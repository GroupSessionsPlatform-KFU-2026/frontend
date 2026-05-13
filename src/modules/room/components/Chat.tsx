import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

//моки
const USE_MOCK = true; //true-для моков, false-подтяжка с апи

const Chat = ({ roomId }: { roomId: string }) => {
  const { getSocket, isConnected } = useSocket(roomId);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (USE_MOCK) {
      return [
        {
          id: '1',
          userId: 'system',
          userName: 'Система',
          text: 'Чат работает в тестовом режиме (мок). Когда появится бэкенд, всё заработает!',
          timestamp: new Date().toISOString(),
        },
      ];
    }
    return [];
  });

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //сообщения от сервера(не мок)
  useEffect(() => {
    if (USE_MOCK) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on('chatHistory', (history: Message[]) => {
      setMessages(history);
    });

    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('newMessage');
    };
  }, [getSocket]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    if (USE_MOCK) {
      const message: Message = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: localStorage.getItem('user_name') || 'Я',
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      return;
    }

    //код вместо моков
    const socket = getSocket();
    if (!socket) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: localStorage.getItem('user_name') || 'Пользователь',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', message);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isChatConnected = USE_MOCK || isConnected;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="font-semibold">
          Чат {!isChatConnected && <span className="text-xs text-gray-400">(отключён)</span>}
          {USE_MOCK && <span className="text-xs text-yellow-500 ml-2">(тестовый режим)</span>}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm">Сообщений пока нет</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] rounded-lg p-2 ${
              msg.userName === 'Система'
                ? 'bg-gray-100 text-center mx-auto'
                : msg.userName === 'Я'
                  ? 'bg-blue-100 ml-auto'
                  : 'bg-gray-100'
            }`}
            style={msg.userName === 'Система' ? { maxWidth: '90%' } : {}}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-blue-600">{msg.userName}</span>
              <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
            </div>
            <p className="text-sm break-words">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Написать сообщение..."
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={!newMessage.trim()} size="sm">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
