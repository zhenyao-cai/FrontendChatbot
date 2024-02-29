import React from 'react';

interface ChatHeaderProps {
    chatname: String,
    topic: String
  }
  
  function ChatHeader(props: ChatHeaderProps) {
    return (
      <div className='side-container'>
        <p className='sider-heading'>Collaborative Task</p>
        <p>Please discuss the following question</p>
        <p>{props.topic}</p>
      </div>
    );
  }

  export default ChatHeader;