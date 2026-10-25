
import React from 'react';
import ChatComponent from '../../components/ChatUI';

interface ChatUIProps {
  contactName: string;
}

const ChatUI: React.FC<ChatUIProps> = (props) => {
  return <ChatComponent {...props} />;
};

export default ChatUI;
