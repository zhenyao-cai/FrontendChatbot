import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';

import './Monitor.css';

interface UserBoxProps {
    content: string;
    index : number;
}

interface LobbbyInformationProps {
    // users : string[];
    socket : Socket;
}

export function Monitor(props : LobbbyInformationProps) {

    const [name,       setName]       = useState('Guest');
    const [code,       setCode]       = useState('');
    const [disabled,   setDisabled]   = useState(false);
    const [lobbyState, setLobbyState] = useState('Not Joined');

    const [boxes, setBoxes] : any[] = useState([]);
    const [index, setIndex] = useState(0);
    const [userList,   setUserList]   = useState<string[]>([]);
    // const [users,   setUsers]  = useState<string[]>();
    
  
    useEffect(() => {
        let initialBoxes = [];
        // load user to the box
        for (let i = 0; i < userList.length; i++) {
            initialBoxes.push(<UserBox content={userList[i]} index={i}/>);
        }
    
        setBoxes(initialBoxes);
        setIndex(userList.length-1);

        console.log(userList.length);

    }, [userList]);

    useEffect(() => {
        if (lobbyState === "Joined") {
          props.socket.emit('getUserListOfLobby', code)
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
        props.socket.on('userListOfLobbyResponse', (userListObj: {userList: string[]}) => {
          setUserList(userListObj.userList);
        })
    
        props.socket.on('userListOfLobbyResponseError', () => {});
    }, []);

  
    const UserBox = (props : UserBoxProps) => {
      return (
        <div className="b" key={props.index}>
          <div className="profile-icon">
            <img src="logo.jpg" alt="Logo" className="logo-icon" />{' '}
          </div>
          <div className="box-content">{props.content}</div>
        </div>
      )
    }
  
    return (
      <div className='lobby-info'>
  
        <p className="waiting-paragraph">Waiting for Students . . .</p>
        
        <div className="border-container">
          <p className="members-paragraph">Members</p>
          <div className="boxes">{boxes}</div>
        </div>

      </div>
    );
  }