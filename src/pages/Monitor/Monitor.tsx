import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import {RightSideBar} from './RightSideBar';
import './Monitor.css';

interface JoinLobbyProps {
  socket : Socket;
}

export function Monitor(props : JoinLobbyProps) {
  const [name,       setName]       = useState('Guest');
  const [code,       setCode]       = useState('');
  const [userList,   setUserList]   = useState<string[]>([]);
  const [numStudent, setNumStudent] = useState(0);

  // Initialize the state with x boxes when the component is mounted
  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name') || 'Guest';

    const formattedName = nameFromURL.replace(/\b\w/g, match => match.toUpperCase());

    // Set the name synchronously before initializing the boxes
    setName(() => formattedName);
  }, []);


  // Ask for Lobby Code
  useEffect(() => {
    props.socket.emit('getLobbyCode');
    console.log("getLobbyCode");
  },[]);


  // Wait for lobby Code
  useEffect(() => {
    props.socket.on('getLobbyCodeResponse', (guid) => {
      console.log("getLobbyCodeResponse:", guid);
      setCode(guid);
    });
  },[]);


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

  
  // getUserListOfLobby
  useEffect(() => {
    props.socket.emit('getUserListOfLobby', code)

    const intervalId = setInterval(() => {
      props.socket.emit('getUserListOfLobby', code);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [code, props.socket]);


  // userListOfLobbyResponse
  useEffect(() => {
    props.socket.on('userListOfLobbyResponse', (userListObj: {userList: string[]}) => {
      setNumStudent(userListObj.userList.length)
      setUserList(userListObj.userList);
      console.log(userList);
    })
  }, []);

  const generateChatrooms = () => {
    props.socket.emit('createChatrooms');
    console.log("emit createChatrooms")
  };

  return (
    // three main sections: screen, content box, members box
    <div className="main-container">

      <div className="logo-container">
        <img src="logo.jpg" alt="Logo" className="logo" />
      </div>

      <button className="top-right-button" onClick={generateChatrooms}>
        Generate Chatrooms
      </button>

      <div className='left'>
        {<LobbyInformation users={userList}/>}
      </div>
      
      {/* right side bar, display number of students */}
      <div className='right'>
        <RightSideBar num_student={numStudent}/>
        {<UserList users={userList}/>}
      </div>

    </div>
  );
}

interface UserBoxProps {
  content: string;
  index : number;
}

interface LobbbyInformationProps {
  users : string[];
}

function LobbyInformation(props : LobbbyInformationProps) {
  const [boxes, setBoxes] : any[] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let initialBoxes = [];
    for (let i = 0; i < props.users.length; i++) {
      initialBoxes.push(<UserBox key={i} content={props.users[i]} index={i} />);
    }

    setBoxes(initialBoxes);
    setIndex(props.users.length-1);
  }, [props.users]);

  const UserBox = (props : UserBoxProps) => {
    return (
      <div className="b" key={props.index}>

        {/* icon of user */}
        {/* <div className="profile-icon">
          <img src="logo.jpg" alt="Logo" className="logo-icon" />{' '}
        </div> */}

        {/* name of user */}
        <div className="box-content">
          {props.content}
        </div>
      </div>
    )
  }

  return (
    <div className='lobby-info'>
      <div className="border-container">
        <p className="members-paragraph">Code:</p>

        <div className="boxes">
          {boxes}
        </div>

      </div>
    </div>
  );
}

function UserList(props : LobbbyInformationProps) {
  const [boxes, setBoxes] : any[] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let initialBoxes = [];
    for (let i = 0; i < props.users.length; i++) {
      initialBoxes.push(<UserBox key={i} content={props.users[i]} index={i} />);
    }

    setBoxes(initialBoxes);
    setIndex(props.users.length-1);
  }, [props.users]);

  const UserBox = (props : UserBoxProps) => {
    return (
      <div key={props.index}>

        {/* name of user */}
        <div className="box-content">
          {props.content}
        </div>
      </div>
    )
  }

  return (
    <div className='lobby-info'>
      <div className="user-list">

        <div className="boxes">
          {boxes}
        </div>

      </div>
    </div>
  );
}