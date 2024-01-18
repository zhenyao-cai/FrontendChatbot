import React from 'react';

import './CreateLobby.css';

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
interface LobbySettingsProps {
  setChatTime: StateSetter<number>
  setChatName: StateSetter<string>
  setTopic: StateSetter<string>
  userCount: number
}

export function LobbySettings(props : LobbySettingsProps) {

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      if (newValue <= 20) {
        props.setChatTime(newValue);
      } else {props.setChatTime(10);}
    } else {props.setChatTime(10);}
  };

  const handleTopicChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.setTopic(e.target.value);
  };

  const handleChatNameChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    props.setChatName(e.target.value);
  };

  return (
    <div style={{ 
      backgroundColor: '#F9F8F7',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      height: 468,
      width: 721,
      color: '#535353',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'
      }}>

      <p style={{ fontSize: 25, marginBottom: 20, marginTop: 20, textAlign: 'center', color: '#383838'}}>Chatroom Settings</p>
      <hr style={{ borderTop: '2px solid #E3E3E3', borderLeft: 'none', width: 721 }} />
      
      <div style={{ margin: 20 }}>
        <p style={{ fontSize: 22, paddingBottom: 10}}>Chatroom Name</p>

        <input onChange={handleChatNameChange} style={{ backgroundColor: '#F9F8F7', borderRadius: 20, width: 670, height: 34, border: '1px solid #C4C4C4', outline: 0, paddingLeft: 10, fontSize: 16 }}></input>
      </div>

      <div style={{ margin: 20 }}>
        <p style={{ fontSize: 22, paddingBottom: 10}}>Topic</p>

        <input onChange={handleTopicChange} style={{ backgroundColor: '#F9F8F7', borderRadius: 20, width: 670, height: 34, border: '1px solid #C4C4C4', outline: 0, paddingLeft: 10, fontSize: 16 }}></input>
      </div>


      <div style={{ margin: 20 }}>
        <p style={{ fontSize: 22, paddingBottom: 10}}>Chat Timer</p>
        <div style={{ display: 'flex', alignItems: 'center'}}>
        <input onChange={handleChange} style={{ backgroundColor: '#ECE7E0', borderRadius: 20, width: 97, height: 34, outline: 0, textAlign: 'center', fontSize: 16 }} placeholder="10"></input>
          <p style={{marginLeft: 10, marginRight: 20 }}>minutes</p>
        </div>
      </div>

      <div style={{ margin: 20 }}>
        <p style={{ fontSize: 22, paddingBottom: 10}}>Number of Participants: {props.userCount}</p>
      </div>
    </div>
  );
}
