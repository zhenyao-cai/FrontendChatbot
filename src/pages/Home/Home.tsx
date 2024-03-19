import './Home.css';
import React, { useState, useEffect } from 'react';

import { Socket } from 'socket.io-client';

interface HomeProps {
  socket: Socket;
}

// Home page path="/home"
export function Home(props:HomeProps) {  
  const [isPopupOpen, setPopupOpen]  = useState(false);
  // user name
  const [name,         setName]         = useState('');
  // user password
  const [password,     setPassword]     = useState('');
  const [actionType,   setActionType]   = useState<'join' | 'create' | undefined>();
  const [LobbyCreated, setLobbyCreated] = useState(false);

  const openPopup = (type: 'join' | 'create') => {
    setActionType(type);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleLinkClick = () => {
    const encodedName = encodeURIComponent(name);
    window.location.href = `joinlobby?name=${encodedName}`; // jump to joinlobby page
  };

  const handleCreateRoomClick = () => {
    closePopup();
    const encodedName = encodeURIComponent(name);
    window.location.href = `createlobby?name=${encodedName}`; // jump to createlobby page
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (actionType === 'join') {
        handleLinkClick();
      } else {
        handleCreateRoomClick();
      }
    }
  };

  useEffect(() => {
    props.socket.on('lobbyCreated', () => {
      setLobbyCreated(true);
    });
  },[]);


  return (
    <div className="Home">
      <header>
        <img src="logo.jpg" alt="Your Logo" className="logohome" />
      </header>
      <main className="centerhome">
        <h1 className="welcome">
          Welcome to ChatBot!
        </h1>

          {LobbyCreated&&
          <button className="button"
                  disabled={!LobbyCreated}
                  onClick={() => openPopup('join')}>
                  
            Join Chatroom
          </button>}

          <button className="button" onClick={() => openPopup('create')}>
            Create Chatroom
          </button>

        {isPopupOpen && (
        <div>
          <div className="popup-overlay"></div>
          <div className="popup">

            <h2>Login</h2>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyPress={handleNameKeyPress}
              placeholder="Enter your name"
            />

            <input
              type="text"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleNameKeyPress}
              placeholder="Enter your password"
            />

            <button onClick={actionType === 'create' ? handleCreateRoomClick : handleLinkClick}>
              Submit
            </button>
            
          </div>
        </div>
        )}

      </main>
    </div>
  );
}
