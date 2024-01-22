import React, { useState, useEffect } from 'react';
import './CreateLobby.css';
import { BotSettings } from './BotSettings';
import { LobbySettings } from './LobbySettings';
import { Socket } from 'socket.io-client';

interface CreateLobbyProps {
  socket: Socket;
}

interface UserListLobby {
  userList : Array<String>;
}

export function CreateLobby(props: CreateLobbyProps) {
  const [name, setName] = useState('');
  const [lobbyId, setLobbyId] = useState('. . . .');
  const [chatTime, setChatTime] = useState(10);
  const [botName, setBotName] = useState('ChatZot');
  const [assertiveness, setAssertiveness] = useState(2);
  const [topic, setTopic] = useState('');
  const [chatName, setChatName] = useState('Discussion');
  const [userCount, setUserCount] = useState(1);

  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';

    const formattedName = nameFromURL.replace(/\b\w/g, match => match.toUpperCase());

    // Set the name
    setName(formattedName);
  }, [setName]);

  useEffect(() => {
    if (name) {
      props.socket.emit('createLobby', name);
    }
  }, [name, props.socket]);

  useEffect(() => {
    const handleLobbyCreated = (newLobbyId: string) => {
      setLobbyId(newLobbyId);
    };

    props.socket.on('lobbyCreated', handleLobbyCreated);

    return () => {
      props.socket.off('lobbyCreated', handleLobbyCreated);
    };
  }, [props.socket]);

  const handleChatroomStart = () => {

    let lobbyData = {
      botname: botName,
      chatLength: chatTime,
      assertiveness: assertiveness,
      topic: topic,
      chatName: chatName
    }
    // send bot settings thru socket
    props.socket.emit('updateBotSettings', lobbyId, lobbyData);

    if (lobbyId !== '. . . .') {
      const encodedId = encodeURIComponent(lobbyId);
      window.location.href = `chatroom?name=${name}&id=${encodedId}`;
    }
  };

  useEffect(() => {
    props.socket.emit('getUserListOfLobby', lobbyId);

    const intervalId = setInterval(() => {
      props.socket.emit('getUserListOfLobby', lobbyId);
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lobbyId, props.socket]);

  useEffect(() => {
    props.socket.on('userListOfLobbyResponse', (userListObj : UserListLobby) => {
      setUserCount(userListObj.userList.length);
    })

    props.socket.on('userListOfLobbyResponseError', () => {});
  }, []);


  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1 className="joinheader">CREATE CHATROOM</h1>
      </div>

      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>

      <button onClick={handleChatroomStart} className="top-right-buttoon">Start Chat</button>

      <div className={'main-header'}>
        <p style={{ fontSize: 25, color: '#527785', marginTop: 20 }}>Join Code</p>
        <div
          className={'box-container'}
          style={{ marginTop: 12, width: 285, height: 78, margin: 'auto' }}
        >
          <p style={{ fontSize: 36, color: '#383838' }}>{lobbyId}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 40 }}>
        <BotSettings setBotName={setBotName} setAssertiveness={setAssertiveness} />
        <LobbySettings setChatTime={setChatTime} setTopic={setTopic} setChatName={setChatName} userCount={userCount} />
      </div>
    </div>
  );
}
