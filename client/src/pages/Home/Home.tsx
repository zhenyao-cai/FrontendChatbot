import './Home.css';
import React, { useState } from 'react';

export function Home() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [name, setName] = useState('');
  const [actionType, setActionType] = useState<'join' | 'create' | undefined>();

  const openPopup = (type: 'join' | 'create') => {
    setActionType(type);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleLinkClick = () => {
    const encodedName = encodeURIComponent(name);
    window.location.href = `joinlobby?name=${encodedName}`;
  };

  const handleCreateRoomClick = () => {
    closePopup();
    const encodedName = encodeURIComponent(name);
    window.location.href = `createlobby?name=${encodedName}`;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
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

  return (
    <div className="Home">
      <header>
        <img src="logo.jpg" alt="Your Logo" className="logohome" />
      </header>
      <main className="centerhome">
        <h1 className="welcome">Welcome to ChatBot!</h1>

          <button className="button" onClick={() => openPopup('join')}>Join Chatroom</button>

          <button className="button" onClick={() => openPopup('create')}>Create Chatroom</button>

        {isPopupOpen && (
        <div>
          <div className="popup-overlay"></div>
          <div className="popup">
            <h2>Name</h2>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyPress={handleNameKeyPress}
              placeholder="Enter your name"
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
