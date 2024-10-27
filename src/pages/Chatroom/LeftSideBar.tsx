import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver'; // npm install file-saver
import { Socket } from 'socket.io-client';


import './Chatroom.css';
import {Timer} from './Timer';

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
interface SideBarProps {
    time: number;
    socket: Socket;
    code: String;
    lobbyid : String;
    name : String;
    messages : JSX.Element[];
    setDisabled : StateSetter<boolean>;
    inactivity : string;
    setInactivity : StateSetter<string>;
    chatName: string;
    chatTopic: string;
  }
  
export function SideBar(props : SideBarProps) {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [time,           setTime]         = useState(props.time);
    const [chatName,       setChatName]     = useState(props.chatName);
    const [chatTopic,      setChatTopic]    = useState(props.chatTopic);
  
    useEffect(() => {
      setTime(props.time);
      setChatName(props.chatName);
      setChatTopic(props.chatTopic);
    }, [props.time, props.chatName, props.chatTopic]);
  
    const togglePopup = () => {
      setPopupVisible(!isPopupVisible);
    };
  
    const handleExport = () => {
      let t;
      const csvContent =
        'Sender,Text,Timestamp\n' +
        props.messages.map((message: any, index, array) => {
            const user = message.props.user;
            const text = message.props.message;
  
            if (message.props.timestamp === '' && index > 0)
              t = array[index - 1].props.timestamp || '';
            else 
              t = message.props.timestamp || '';
            const timestamp = t;
  
            return `"${user}","${text}","${timestamp}"`;
          })
          .join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  
      const filename = `chat_export_${props.code}.csv`;
      saveAs(blob, filename);
    };
  
    // const handleChatroomLeave = () => {
    //   if (props.socket && props.code) {
    //     props.socket.emit('leaveLobby', props.code, props.name);
    //   }
      
    //   window.location.href = 'home';
    // };
  
    return (
      <div style={{ paddingLeft: 20, paddingRight:20 }}>
        
        {/* <div className='chatroom-box'>
          <div className='chatroom-img' />
          <p className='chatroom-word'>Chatroom</p>
        </div> */}
  
        <div style={{ marginTop: '20px' }}>
          <ChatHeader chatname={chatName} topic={chatTopic}/>
          <Timer 
            time={time} 
            socket={props.socket} 
            code={props.code} 
            // lobbyid={props.lobbyid} 
            setDisabled={props.setDisabled}
            inactivity={props.inactivity}
            setInactivity={props.setInactivity}/>
        </div>
  
        <div className='export-box'>
          <div className='export-img' />
          <p className='export-word' onClick={togglePopup}>
            Export
          </p>
  
          {/* Popup menu */}
          <div
            className='export-popup'
            style={{ display: isPopupVisible ? 'block' : 'none' }}
          >
            <p>Export As .csv</p>
  
            {/* Export button */}
            <button className='export-button' onClick={handleExport}>
              Export
            </button>
  
          </div>
        </div>
        {/* 
        <div className='exit-position'>
          <button className='exit-button' onClick={handleChatroomLeave}>Quit Chatroom</button>
        </div> */}
      </div>
    )
  }

  interface ChatHeaderProps {
    chatname: string,
    topic: string
  }
  
  // top left box
  function ChatHeader(props: ChatHeaderProps) {
    return (
      <div className='side-container'>
        <p className='sider-heading'>Collaborative Task</p>
        <p className='sider-subheading'>Please discuss the following question</p>
        <p>{props.topic}</p>
      </div>
    );
  }

