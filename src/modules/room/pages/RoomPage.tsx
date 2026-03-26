import RoomHeader from '@/components/ui/roomPage/RoomHeader';
import Board from '@/components/ui/roomPage/Board';
import Sidebar from '@/components/ui/roomPage/Sidebar';

const RoomPage = () => {
  return (
    <div className="h-screen flex flex-col">
      <RoomHeader />

      <div className="flex-1 flex overflow-hidden">
        <Board />
        <Sidebar />
      </div>
    </div>
  );
};

export default RoomPage;
