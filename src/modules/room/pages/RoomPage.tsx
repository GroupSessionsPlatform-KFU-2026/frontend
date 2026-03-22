const RoomPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4">
        <h1 className="text-xl font-bold">Комната: Проектная сессия</h1>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        {/* слева доска */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
            <p className="text-gray-400">Здесь будет интерактивная доска</p>
          </div>
        </div>
        
        {/* справа чат и участники */}
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Участники (3)</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-gray-400 text-sm">Сообщения чата будут здесь</p>
          </div>
          <div className="p-4 border-t">
            <input 
              type="text" 
              placeholder="Написать сообщение..."
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;