import React from 'react';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import './Chatroom.css'
import {RightSideBar} from './RightSideBar';
import {SideBar}      from './LeftSideBar';
import {ChatBox}      from './ChatBox';


type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

interface ChatroomItems {
  time: number;
  chatName: string;
  chatTopic: string;
}

interface ChatroomProps {
  socket: Socket;
}

export function Chatroom(props: ChatroomProps) {
  const [code,           setCode]           = useState('');
  const [lobbyid,        setlobbyid]        = useState('');
  const [chatName,       setChatName]       = useState('');
  const [chatTime,       setChatTime]       = useState(1);
  const [chatTopic,      setChatTopic]      = useState('');
  const [name,           setName]           = useState('Guest');
  const [masterMessages, setMasterMessages] = useState<JSX.Element[]>([]);
  const [disabled,       setDisabled]       = useState(false);
  const [inactivity,     setInactivity]     = useState('pending');
  const [score,          setScore]          = useState(10);  // participation score

  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const idFromURL = searchParams.get('id') || '....'; // default id: '....'
    const nameFromURL = searchParams.get('name');
    setlobbyid(searchParams.get('lobbyid') || '....');

    if (nameFromURL !== null) {
      const decodedName = decodeURIComponent(nameFromURL);
      // Now decodedName is guaranteed to be a string
      setName(decodedName);
    };

    // Set the name
    setCode(() => idFromURL);

  }, [setCode]);

  useEffect(() => {
    props.socket.on('joinedChatroom', (guid : any) => {
      console.log("Recieved Ping");
      props.socket.emit('getChatData', lobbyid, code);
      console.log(code);
      console.log("sent Ping");
    });

  }, [props.socket, code]);

  useEffect(() => {
    props.socket.on('chatData', (chatItems : ChatroomItems) => {

      setChatName(chatItems.chatName);
      setChatTime(chatItems.time);
      setChatTopic(chatItems.chatTopic);
    });
  }, []);

  return (
    <div style={{ backgroundColor: '#EEEDEA' }}>
      
      <div className='page-header'>
        <p>{'EduChatbot'}</p>
        <p>{'Chatroom: ' + code}</p>
      </div>

      <div style={{ display: 'flex' }}>

        {/* left side bar, display time and stage */}
        <div className='side-bar'>
          <SideBar
            time          ={chatTime} 
            socket        ={props.socket} 
            code          ={code} 
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
            code              ={code} 
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
