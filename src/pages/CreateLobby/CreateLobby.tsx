import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateLobby.css';
import { BotSettings } from './BotSettings';
import { LobbySettings } from './LobbySettings';
import { Socket } from 'socket.io-client';

interface CreateLobbyProps {
  socket: Socket;
}

// interface UserListLobby {
//   userList : string[];
// }

export function CreateLobby(props: CreateLobbyProps) {
  const [name,          setName]          = useState('');
  const [lobbyId,       setLobbyId]       = useState('. . . .');
  const [chatTime,      setChatTime]      = useState(10);
  const [botName,       setBotName]       = useState('ChatZot');
  const [assertiveness, setAssertiveness] = useState(2);
  const [topic,         setTopic]         = useState('');
  const [chatName,      setChatName]      = useState('Discussion');
  const [userList,     setUserList]     = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';
    const formattedName = nameFromURL.replace(/\b\w/g, match => match.toUpperCase());
    setName(formattedName);
  }, [setName]);

  // emit create lobby request
  useEffect(() => {
    if (name) {
      props.socket.emit('createLobby', name);
    }
  }, [name, props.socket]);

  useEffect(() => {
    // Set lobbyId
    const handleLobbyCreated = (newLobbyId: string) => {
      setLobbyId(newLobbyId);
    };

    // listen to server response
    props.socket.on('lobbyCreated', handleLobbyCreated);

    return () => {
      props.socket.off('lobbyCreated', handleLobbyCreated);
    };
  }, [props.socket]);

  // finish setting, go to monitor page
  const handleChatroomStart = () => {
    let chatData = {
      botname: botName,
      chatLength: chatTime,
      assertiveness: assertiveness,
      topic: topic,
      chatName: chatName
    }

    // send bot settings thru socket
    props.socket.emit('updateChatSettings', lobbyId, chatData);

    if (lobbyId !== '. . . .') {
      const encodedId = encodeURIComponent(lobbyId);
      navigate(`/monitor?lobbyId=${encodedId}`); 
    }
  };

  // get user lists through lobbyId
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
    props.socket.on('userListOfLobbyResponse', (userList : string[]) => {
      setUserList(userList);
    })

    props.socket.on('userListOfLobbyResponseError', () => {});
  }, [props.socket]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1 className="joinheader">CREATE CHATROOM</h1>
      </div>

      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>

      {/* Finish setting Botton */}
      <button onClick={handleChatroomStart} className="top-right-buttoon">
        Finish
      </button>

      <div className={'main-header'}>
        <p style={{ fontSize: 25, color: '#527785', marginTop: 20 }}>
          Join Code
        </p>
        <div className={'box-container'} style={{ marginTop: 12, width: 285, height: 78, margin: 'auto' }}>
          <p style={{ fontSize: 36, color: '#383838' }}>
            {lobbyId}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 40 }}>
        <BotSettings setBotName={setBotName}
                     setAssertiveness={setAssertiveness}
        />
        <LobbySettings setChatTime={setChatTime}
                       setTopic={setTopic}
                       setChatName={setChatName}
                       userCount={userList.length}
        />
      </div>
    </div>
  );
}
