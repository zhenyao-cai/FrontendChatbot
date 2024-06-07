import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import './JoinLobby.css';

interface JoinLobbyProps {
  socket: Socket;
}

export function JoinLobby(props : JoinLobbyProps) {
  const [name,       setName]       = useState('Guest');
  const [code,       setCode]       = useState('');
  const [lobbyState, setLobbyState] = useState('Waiting');

  // Initialize the state with x boxes when the component is mounted
  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';

    // const formattedName = nameFromURL.replace(/\b\w/g, match => match.toUpperCase());
    // Set the name synchronously before initializing the boxes
    setName(nameFromURL);
  }, []);


  // Get lobby code from server
  useEffect(() => {
    props.socket.emit('getLobbyCode');
    console.log("getLobbyCode");
    setLobbyState("getLobbyCode");
    // props.socket.on('lobbyError', (error) => {
    //   if (lobbyState != 'Joined'){
    //     console.error('Error joining lobby:', error);
    //     setLobbyState('Error');
    //   }
    // });
  }, []);


  // Wait for getLobbyCodeResponse event, then try to join lobby
  useEffect(() => {
    props.socket.on('getLobbyCodeResponse', (guid) => {
      console.log("getLobbyCodeResponse: ", guid);
      setCode(guid);
    });
  }, []);


  // Emit joinLobby if name and code are valid.
  useEffect(() => {
    if (name != "Guest" && code != ""){
      props.socket.emit('joinLobby', code, name);
      console.log(name,"try to join Lobby:", code);
      setLobbyState("joinLobby");
    }
  }, [code, name]);


  // Wait for joinedLobby event. If joined successfully, set state to 'joined'
  useEffect(() => {
    props.socket.on('joinedLobby', (guid) => {
      console.log("joinedLobby");
      setLobbyState('Joined');
    });
  }, []);

  // start chat
  // useEffect(() => {
  //   const handleChatStarted = () => {
  //     const encodedId = encodeURIComponent(code);
  //     window.location.href = `chatroom?name=${name}&id=${encodedId}`;

  //     // Turn off the event listener after it has been used once
  //     props.socket.off('chatStarted', handleChatStarted);
  //   };

  //   // Set up event listeners
  //   props.socket.on('chatStarted', handleChatStarted);

  //   // Clean up event listeners when the component unmounts
  //   return () => {
  //     // Turn off event listeners
  //     props.socket.off('chatStarted', handleChatStarted);
  //   };
  // }, [code, name]);

  useEffect(() => {
    props.socket.on('joinedChatroom', (guid) => {
      console.log("joinedChatroom: ", guid);
      //setCode(guid);
      // const encodedId = encodeURIComponent(code);
      window.location.href = `chatroom?name=${name}&id=${guid}&lobbyid=${code}`;
    });
  }, [code, name]);


  return (
    <div className="screen">
      <div>
        <h1 className="joinheader">Join Chatroom</h1>
      </div>

      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>

      <a href="home">
        <button className="top-right-button">Quit Chatroom</button>
      </a>

      {(lobbyState === 'Waiting') &&
      <p className="waiting-paragraph">
        Attempting to join lobby...
      </p>}

      {/* {(lobbyState === 'Error') &&
      <p className="waiting-paragraph">
        Error joining room. Please try again.
      </p>} */}

      <div className='lobby-info'>

        <p className="waiting-paragraph">Waiting for host...</p>
        <p className="waiting-paragraph">Topic:</p>
        <p className="waiting-paragraph">Task:</p>

      </div>

    </div>
  );
}
