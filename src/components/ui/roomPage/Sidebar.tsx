import Participants from './Participants';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const Sidebar = () => {
  return (
    <div className="w-80 bg-white border-l flex flex-col">
      <Participants />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default Sidebar;
