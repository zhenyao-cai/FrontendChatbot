import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import './JoinLobby.css';

interface JoinLobbyProps {
  socket: Socket;
}

export function JoinLobby(props : JoinLobbyProps) {
  const [name,       setName]       = useState('');
  const [code,       setCode]       = useState('');
  // const [chatCode,   setChatCode]   = useState('');
  const [lobbyState, setLobbyState] = useState('Waiting');
  const [guid, setGuid] = useState<string>(''); // Add guid state

  const navigate = useNavigate();

  // Initialize the state with x boxes when the component is mounted
  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';
    const lobbyIdFromURL = searchParams.get('lobbyid') || ''

    // const formattedName = nameFromURL.replace(/\b\w/g, match => match.toUpperCase());
    // Set the name synchronously before initializing the boxes
    setName(nameFromURL);
    setCode(lobbyIdFromURL)
    setGuid(lobbyIdFromURL)
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
  }, [props.socket]);


  // Wait for getLobbyCodeResponse event, then try to join lobby
  // useEffect(() => {
  //   props.socket.on('getLobbyCodeResponse', (guid) => {
  //     console.log("getLobbyCodeResponse: ", guid);
  //   });
  // }, [props.socket]);


  // Emit joinLobby if name and code are valid.
  useEffect(() => {
    if (name !== "Guest" && code !== ""){
      props.socket.emit('joinLobby', code, name);
      console.log(name,"try to join Lobby:", code);
      setLobbyState("joinLobby");
    }
  }, [code, name, props.socket]);


  // Wait for joinedLobby event. If joined successfully, set state to 'joined'
  useEffect(() => {
    props.socket.on('joinedLobby', (guid) => {
      console.log("joinedLobby");
      setLobbyState('Joined');
    });
  }, [props.socket]);

  useEffect(() => {
    const handleJoinLobbyError = (msg: String) => {
      console.log(msg);
      alert(msg);  // Show alert once
      navigate('/');  // Redirect to the home page
    };

    // Set up the event listener
    props.socket.on('joinLobbyError', handleJoinLobbyError);

    // Clean up the event listener on unmount
    return () => {
      props.socket.off('joinLobbyError', handleJoinLobbyError);
    };
  }, [props.socket, navigate]);

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
  // Listening for the start of the chat and handling redirection
  useEffect(() => {
    const handleChatStarted = (lobbyId: string, chatId: string) => {
      console.log("Received chatStarted with lobbyId:", lobbyId, "and chatId:", chatId);
      // chat id is important. It is the thing displayed
      const encodedName = encodeURIComponent(name);
      const encodedLobbyId = encodeURIComponent(lobbyId);
      const encodedChatId = encodeURIComponent(chatId);
      navigate(
        `/chatroom?name=${encodedName}&lobbyid=${encodedLobbyId}&chatid=${encodedChatId}`
      );
      //window.location.href = `chatroom?name=${encodeURIComponent(name)}&id=${encodedId}`;
    };
  
    props.socket.on('chatStarted', handleChatStarted);
  
    // Cleanup to prevent memory leaks
    return () => {
      props.socket.off('chatStarted', handleChatStarted);
    };
  }, [props.socket, name, navigate]);  // 'name' is used to encode the URL parameter


  // useEffect(() => {
  //   props.socket.on('joinedChatroom', (chatId) => {
  //     console.log("joinedChatroom: ", chatId);
  //     const encodedName = encodeURIComponent(name);
  //     const encodedChatId = encodeURIComponent(name);
  //     navigate(`/chatroom?name=${name}&id=${guid}&lobbyid=${code}`);
  //     window.location.href = `chatroom?name=${name}&id=${guid}&lobbyid=${code}`;
  //   });
  // }, [code, name, navigate]);

  const handleQuitChatroom = () => {
    if (guid) {
      props.socket.emit('leaveLobby', { guid, name });
      navigate('/home');
    } else {
      console.error('No guid found to leave lobby.');
    }
  };

  return (
    <div className="screen">
      <div>
        <h1 className="joinheader">Join Chatroom</h1>
      </div>

      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>

      <a href="home">
        <button className="top-right-button" onClick={handleQuitChatroom}>Quit Chatroom</button>
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
