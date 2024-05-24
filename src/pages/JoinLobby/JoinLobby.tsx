import './JoinLobby.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface JoinLobbyProps {
  socket: Socket;
}

interface LobbyInformationProps {
  users: { username: string }[];
}

export function JoinLobby(props: JoinLobbyProps) {
  const [name, setName] = useState('Guest');
  const [code, setCode] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [lobbyState, setLobbyState] = useState('Not Joined');
  const [userList, setUserList] = useState<{ username: string }[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';

    const formattedName = nameFromURL.replace(/\b\w/g, match => match.toUpperCase());

    setName(() => formattedName);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLobbyState('Waiting');

    props.socket.emit('joinLobby', code, name);

    props.socket.on('joinedLobby', (guid) => {
      setLobbyState('Joined');
      setDisabled(true);
    });

    props.socket.on('lobbyError', (error) => {
      console.error('Error joining lobby:', error);
      setLobbyState('Error');
    });
  };

  useEffect(() => {
    const handleChatStarted = () => {
      const encodedId = encodeURIComponent(code);
      window.location.href = `chatroom?name=${name}&id=${encodedId}`;

      props.socket.off('chatStarted', handleChatStarted);
    };

    props.socket.on('chatStarted', handleChatStarted);

    return () => {
      props.socket.off('chatStarted', handleChatStarted);
    };
  }, [code, name, props.socket]);

  useEffect(() => {
    if (lobbyState === "Joined") {
      props.socket.emit('getUserListOfLobby', code);
    }

    const intervalId = setInterval(() => {
      props.socket.emit('getUserListOfLobby', code);
      console.log(userList);
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [code, lobbyState, props.socket]);

  useEffect(() => {
    props.socket.on('userListOfLobbyResponse', (userListObj: { userList: { username: string }[] }) => {
      setUserList(userListObj.userList);
    });

    props.socket.on('userListOfLobbyResponseError', () => {});

    return () => {
      props.socket.off('userListOfLobbyResponse');
      props.socket.off('userListOfLobbyResponseError');
    };
  }, [props.socket]);

  return (
    <div className="screen">
      <div>
        <h1 className="joinheader">JOIN CHATROOM</h1>
      </div>

      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>
      <a href="home">
        <button className="top-right-button">Quit Chatroom</button>
      </a>

      <div className="content-box">
        <h2>Enter Code</h2>
        <div className="joinbox">
          <form onSubmit={handleSubmit}>
            <input
              className="joininput"
              type="text"
              placeholder=""
              value={code}
              onSubmit={handleSubmit}
              disabled={disabled}
              onChange={(e) => {
                if (e.target.value.length <= 4) {
                  setCode(e.target.value);
                }
              }} />
          </form>
        </div>
      </div>

      {(lobbyState === 'Waiting') && <p className="waiting-paragraph">Attempting to join lobby...</p>}
      {(lobbyState === 'Joined') && <LobbyInformation users={userList} />}
      {(lobbyState === 'Error') && <p className="waiting-paragraph">Error joining room. Please try again.</p>}
    </div>
  );
}

interface UserBoxProps {
  content: string;
  index: number;
}

function LobbyInformation(props: LobbyInformationProps) {
  const [boxes, setBoxes] = useState<any[]>([]);

  useEffect(() => {
    const initialBoxes = props.users.map((user, i) => (
      <UserBox content={user.username} index={i} key={i} />
    ));

    setBoxes(initialBoxes);
  }, [props.users]);

  const UserBox = (props: UserBoxProps) => {
    return (
      <div className="b" key={props.index}>
        <div className="profile-icon">
          <img src="logo.jpg" alt="Logo" className="logo-icon" />{' '}
        </div>
        <div className="box-content">{props.content}</div>
      </div>
    );
  };

  return (
    <div className='lobby-info'>
      <p className="waiting-paragraph">Waiting for host . . .</p>
      <div className="border-container">
        <p className="members-paragraph">Members</p>
        <div className="boxes">{boxes}</div>
      </div>
    </div>
  );
}
