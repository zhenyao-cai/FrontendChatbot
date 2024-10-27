import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import './Chatroom.css'
import {RightSideBar} from './RightSideBar';
import {SideBar}      from './LeftSideBar';
import {ChatBox}      from './ChatBox';

interface ChatroomItems {
  time: number;
  chatName: string;
  chatTopic: string;
}

interface ChatroomProps {
  socket: Socket;
}

export function Chatroom(props: ChatroomProps) {
  const [chatid,         setChatId]           = useState('');
  const [lobbyid,        setLobbyId]        = useState('');
  const [chatName,       setChatName]       = useState('');
  const [chatTime,       setChatTime]       = useState(0);
  const [chatTopic,      setChatTopic]      = useState('');
  const [name,           setName]           = useState('Guest');
  const [masterMessages, setMasterMessages] = useState<JSX.Element[]>([]);
  const [disabled,       setDisabled]       = useState(false);
  const [inactivity,     setInactivity]     = useState('pending');
  // const [score,          setScore]          = useState(10);  // participation score
  const score = 10;

  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';
    const chatIdFromURL = searchParams.get('chatid') || '....';
    const lobbyIdFromURL = searchParams.get('lobbyid') || '....'; 

    setName(decodeURIComponent(nameFromURL));
    setChatId(chatIdFromURL);
    setLobbyId(lobbyIdFromURL);
  }, []);

  useEffect(() => {
    const handleJoinedChatroom = (guid: any) => {
      console.log("Received Ping");
      props.socket.emit('getChatData', lobbyid, chatid);
      console.log(chatid);
      console.log("sent Ping");
    };

    props.socket.on('joinedChatroom', handleJoinedChatroom);

    return () => {
      props.socket.off('joinedChatroom', handleJoinedChatroom);
    };
  }, [props.socket, chatid, lobbyid]);

  useEffect(() => {
    const handleChatData = (chatItems: ChatroomItems) => {
      setChatName(chatItems.chatName);
      setChatTime(chatItems.time);
      setChatTopic(chatItems.chatTopic);
    };

    props.socket.on('chatData', handleChatData);

    return () => {
      props.socket.off('chatData', handleChatData);
    };
  }, [props.socket]);

  return (
    <div style={{ backgroundColor: '#EEEDEA' }}>
      
      <div className='page-header'>
        <p>{'EduChatbot'}</p>
        <p>{'Chatroom: ' + chatid}</p>
      </div>

      <div style={{ display: 'flex' }}>

        {/* left side bar, display time and stage */}
        <div className='side-bar'>
          <SideBar
            time          ={chatTime} 
            socket        ={props.socket} 
            code          ={chatid} 
            lobbyid       ={lobbyid}
            name          ={name} 
            messages      ={masterMessages}
            setDisabled   ={setDisabled}
            inactivity    ={inactivity}
            setInactivity ={setInactivity}
            chatName      ={chatName}
            chatTopic     ={chatTopic}/>
        </div>

        <div className='body-container'>
          <ChatBox 
            socket            ={props.socket} 
            code              ={chatid} 
            lobbyid           ={lobbyid}
            setMasterMessages ={setMasterMessages} 
            disabled          ={disabled}
            inactivity        ={inactivity}
            setInactivity     ={setInactivity}/>
        </div>

        {/* right side bar, display participation score and visualization */}
        <div className='side-bar'>
          <RightSideBar score={score}/>
        </div>
        
      </div>
    </div>
  );
}
