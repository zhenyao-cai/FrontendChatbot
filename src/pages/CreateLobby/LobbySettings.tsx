import React from 'react'
import './CreateLobby.css'

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>
interface LobbySettingsProps {
  setChatTime: StateSetter<number>
  setChatName: StateSetter<string>
  setTopic: StateSetter<string>
  setParticipantsPerRoom: StateSetter<number>
  userCount: number
}

export function LobbySettings(props: LobbySettingsProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue <= 20) {
      props.setChatTime(newValue);
    } else {
      props.setChatTime(10);  // Default time when invalid
    }
  }

  const handleParticipantsPerRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue <= 100) {
      props.setParticipantsPerRoom(newValue);
    } else {
      props.setParticipantsPerRoom(4);  // Default participants per room when invalid
    }
  }

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    props.setTopic(e.target.value)
  }

  const handleChatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    props.setChatName(e.target.value)
  }

  return (
    <div className="chatroom-setting-container">
      <p className="chatroom-setting-heading">Chatroom Settings</p>
      <hr className="chatroom-setting-hr" />
      
      <div className="chatroom-setting-input-container">
        <p className="chatroom-setting-input-label">Chatroom Name</p>
        <input
          onChange={handleChatNameChange}
          className="chatroom-setting-input-field"
          type="text"
        />
      </div>

      <div className="chatroom-setting-input-container">
        <p className="chatroom-setting-input-label">Topic</p>
        <input
          onChange={handleTopicChange}
          className="chatroom-setting-input-field"
          type="text"
        />
      </div>

      <div className="chatroom-setting-timer-container">
        <p className="chatroom-setting-timer-label">Chat Timer</p>
        <div className="chatroom-setting-timer-input">
          <input
            className="chatroom-setting-timer-input-box"
            onChange={handleTimeChange}
            placeholder="10"
          />
          <p className="chatroom-setting-timer-input-box-p">minutes</p>
        </div>
      </div>
      
      <div className="chatroom-setting-participants-per-room-container">
        <p className="chatroom-setting-timer-label">Max Participants Per Room</p>
        <div className="chatroom-setting-timer-input">
          <input
            className="chatroom-setting-timer-input-box"
            onChange={handleParticipantsPerRoomChange}
            placeholder="4"
            type="number"
          />
          <p className="chatroom-setting-participants-per-room-input-box-p">participants</p>
        </div>
      </div>
      
      

      <div className="chatroom-setting-participants-container">
        <p className="chatroom-setting-participants-label">
          Number of Participants: {props.userCount}
        </p>
      </div>
    </div>
  )
}
