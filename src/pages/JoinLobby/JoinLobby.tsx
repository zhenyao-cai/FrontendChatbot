import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import './JoinLobby.css';

interface JoinLobbyProps {
  socket : Socket;
}

interface LobbbyInformationProps {
  // A list of strings containing all users' names
  // users = userlist
  users : string[];
}

export function JoinLobby(props : JoinLobbyProps) {
  const [name,       setName]       = useState('Guest');
  const [code,       setCode]       = useState('');
  const [disabled,   setDisabled]   = useState(false);
  const [lobbyState, setLobbyState] = useState('Waiting');
  const [userList,   setUserList]   = useState<string[]>([]);

  // Initialize the state with x boxes when the component is mounted
  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';

    const formattedName = nameFromURL.replace(/\b\w/g, match => match.toUpperCase());

    // Set the name synchronously before initializing the boxes
    setName(() => formattedName);
  }, []);

  // useEffect(() => {
  //   if (lobbyState === "Waiting") {
  //     props.socket.emit('joinLobby', code)
  //   }

  //   const intervalId = setInterval(() => {
  //     if (lobbyState != 'Joined'){
  //       props.socket.emit('joinLobby', code);
  //       console.log("try join");
  //     }
  //   }, 3000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [code, lobbyState, props.socket]);

  useEffect(() => {
    // get lobbycode from server
    props.socket.emit('getLobbyCode');
  
    // Wait for lobbycode
    props.socket.on('getLobbyCodeResponse', (guid) => {
      console.log("getLobbyCodeResponse:", guid);
      setCode(guid);
      // Request to join the lobby
      props.socket.emit('joinLobby', code);
      console.log("try join:", code);
    });

    // Listen for the server's response
    // If joined successfully, set state to 'joined'
    props.socket.on('joinedLobby', (guid) => {
      console.log("joinedLobby");
      setLobbyState('Joined');
      setDisabled(true);
    });

    // props.socket.on('lobbyError', (error) => {
    //   if (lobbyState != 'Joined'){
    //     console.error('Error joining lobby:', error);
    //     setLobbyState('Error');
    //   }
    // });
  }, [props.socket, lobbyState]);

  // Submit user's code to server
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  
  //   setLobbyState('Waiting');

  //   // get lobbycode from server
  //   props.socket.emit('getLobbyCode');
  //   console.log("getLobbyCode");
  
  //   // Wait for lobbycode
  //   props.socket.on('getLobbyCodeResponse', (guid) => {
  //     console.log("getLobbyCodeResponse:", guid);
  //     setCode(guid);
  //     // Request to join the lobby
  //     props.socket.emit('joinLobby', code, name);
  //     console.log("joinLobby");
  //   });

  //   // Listen for the server's response
  //   // If joined successfully, set state to 'joined'
  //   props.socket.on('joinedLobby', (guid) => {
  //     console.log("joinedLobby");
  //     setLobbyState('Joined');
  //     setDisabled(true);
  //   });

  //   props.socket.on('lobbyError', (error) => {
  //     console.error('Error joining lobby:', error);
  //     setLobbyState('Error');
  //   });
  // };

  // start chat
  useEffect(() => {
    const handleChatStarted = () => {
      const encodedId = encodeURIComponent(code);
      window.location.href = `chatroom?name=${name}&id=${encodedId}`;
  
      // Turn off the event listener after it has been used once
      props.socket.off('chatStarted', handleChatStarted);
    };
  
    // Set up event listeners
    props.socket.on('chatStarted', handleChatStarted);
  
    // Clean up event listeners when the component unmounts
    return () => {
      // Turn off event listeners
      props.socket.off('chatStarted', handleChatStarted);
    };
  }, [code, name]);

  // Send request for UserList from server
  // useEffect(() => {
  //   // if (lobbyState === "Joined") {
  //     props.socket.emit('getUserListOfLobby', code)
  //   // }

  //   const intervalId = setInterval(() => {
  //     props.socket.emit('getUserListOfLobby', code);
  //     console.log(userList);
  //   }, 3000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [code, lobbyState, props.socket]);

  // When server response, update userList
  // useEffect(() => {
  //   props.socket.on('userListOfLobbyResponse', (userListObj: {userList: string[]}) => {
  //     setUserList(userListObj.userList);
  //   })

  //   props.socket.on('userListOfLobbyResponseError', () => {});
  // }, []);

  return (
    //three main sections: screen, content box, members box
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

      <div className="content-box">
        {/* <h2>Enter Code</h2> */}
        {/* <div className="joinbox"> */}

          {/* Input box for code */}
          {/* <form onSubmit={handleSubmit}>
            <input 
              className   ="joininput" 
              type        ="text" 
              placeholder ="" 
              value       ={code} 
              onSubmit    ={handleSubmit} 
              disabled    ={disabled} 
              onChange    ={(e) => {
                if (e.target.value.length <= 4) {
                  setCode(e.target.value);
                }
              }
            } />
          </form> */}

          {/* <button onClick = {handleSubmit}>
            Join {code}
          </button> */}

        {/* </div> */}
      </div>

      {(lobbyState === 'Waiting') && 
      <p className="waiting-paragraph">
        Attempting to join lobby...
      </p>}

      {(lobbyState === 'Joined') && 
        <LobbyInformation users={userList}
      />}

      {/* {(lobbyState === 'Error') && 
      <p className="waiting-paragraph">
        Error joining room. Please try again.
      </p>} */}
      
    </div>
  );
}

interface UserBoxProps {
  // name of the user
  content: string;
  index : number;
}

// Display student name
function LobbyInformation(props : LobbbyInformationProps) {
  const [boxes, setBoxes] : any[] = useState([]);
  const [index, setIndex] = useState(0);

  // When props.users changes, update boxes
  useEffect(() => {
    let initialBoxes = [];

    // load UserBox to Boxes
    for (let i = 0; i < props.users.length; i++) {
      initialBoxes.push(<UserBox content={props.users[i]} index={i}/>);
    }

    setBoxes(initialBoxes);
    setIndex(props.users.length-1);
  }, [props.users]);

  // UserBox for display each joined user
  const UserBox = (props : UserBoxProps) => {
    return (
      <div className="b" key={props.index}>

        {/* icon of user */}
        <div className="profile-icon">
          <img src="logo.jpg" alt="Logo" className="logo-icon" />{' '}
        </div>

        {/* name of user */}
        <div className="box-content">
          {props.content}
        </div>

      </div>
    )
  }

  return (
    <div className='lobby-info'>

      <p className="waiting-paragraph">Waiting for host...</p>
      <p className="waiting-paragraph">Topic:</p>
      <p className="waiting-paragraph">Task:</p>

      {/* <div className="border-container"> */}
        {/* <p className="members-paragraph">Members</p> */}
        {/* <div className="boxes">{boxes}</div> */}
      {/* </div> */}
    </div>
  );
}