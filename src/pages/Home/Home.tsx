import { yellow } from '@mui/material/colors';
import './Home.css';
import React, { useState, useEffect } from 'react';

import { Socket } from 'socket.io-client';

interface HomeProps {
  socket: Socket;
}

// Home page path="/home"
export function Home(props:HomeProps) {  
  const [isTeacherPopupOpen,  setTeacherPopupOpen]  = useState(false);
  const [isStudentPopupOpen,  setStudentPopupOpen]  = useState(false);
  const [name,                setName]              = useState('');
  const [password,            setPassword]          = useState('');
  const [actionType,          setActionType]        = useState<'join' | 'create' | undefined>();
  const [LobbyCreated,        setLobbyCreated]      = useState(false);

  const openPopup = (type: 'join' | 'create') => {
    setActionType(type);
    if (type == 'join') {setStudentPopupOpen(true);}
    else {setTeacherPopupOpen(true);}
  };

  const closePopup = () => {
    setStudentPopupOpen(false);
    setTeacherPopupOpen(false);
  };

  const handleLinkClick = () => {
    if(name){
      const encodedName = encodeURIComponent(name);
      window.location.href = `joinlobby?name=${encodedName}`; // jump to joinlobby page
    }

  };

  const handleCreateRoomClick = () => {
    if(name){
      closePopup();
      const encodedName = encodeURIComponent(name);
      window.location.href = `createlobby?name=${encodedName}`; // jump to createlobby page
    }
    
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
      if (actionType === 'join') {handleLinkClick();} 
      else {handleCreateRoomClick();}
    }
  };

  useEffect(() => {
    props.socket.on('lobbyCreated', () => {
      console.log("lobbyCreated")
      setLobbyCreated(true);
    });
  },[]);


  return (
    <div className="Home">

      <header>
        <img src="logo.jpg" alt="Your Logo" className="logohome" />
      </header>

      <main className="centerhome">
        <h1 className="welcome">EduChat</h1>

          <button className="button" onClick={() => openPopup('create')}>
            Teacher
          </button>

          {
          // LobbyCreated&&
          <button className="button" onClick={() => openPopup('join')}>
            Student
          </button>}

        {isTeacherPopupOpen && (
        <div>
          <div className="popup-overlay"></div>
          <div className="popup">

            <h2>Teacher Login</h2>
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

            <button onClick={closePopup}>
              Cancel
            </button>

            <button onClick={actionType === 'create' ? handleCreateRoomClick : handleLinkClick}>
              Submit
            </button>
            
          </div>
        </div>
        )}

      {isStudentPopupOpen && (
        <div>
          <div className="popup-overlay"></div>
          <div className="popup">

            <h2>Student Login</h2>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyPress={handleNameKeyPress}
              placeholder="Enter your name"
            />

            <button onClick={closePopup}>
              Cancel
            </button>

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
