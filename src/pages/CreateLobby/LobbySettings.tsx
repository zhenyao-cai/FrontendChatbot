import React from 'react'
import './CreateLobby.css'

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>
interface LobbySettingsProps {
  setChatTime: StateSetter<number>
  setChatName: StateSetter<string>
  setTopic: StateSetter<string>
  userCount: number
<<<<<<< Updated upstream
=======
  testMode: boolean
  botType: string
  setTestMode: StateSetter<boolean>
  setBotType: StateSetter<string>
>>>>>>> Stashed changes
}

export function LobbySettings(props: LobbySettingsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue <= 20) {
      props.setChatTime(newValue);
    } else {
      props.setChatTime(10);  // Default time when invalid
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

<<<<<<< Updated upstream
=======
  const handleTestModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setTestMode(e.target.checked);
  }

  const handleBotTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.setBotType(e.target.value);
  }

>>>>>>> Stashed changes
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
            onChange={handleChange}
            placeholder="10"
          />
          <p className="chatroom-setting-timer-input-box-p">minutes</p>
        </div>
      </div>
<<<<<<< Updated upstream
=======
      
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
      
      <div className="chatroom-setting-test-mode-container">
        <p className="chatroom-setting-test-mode-label">Test Mode (Half have chatbot, half do not)</p>
        <div className="chatroom-setting-test-mode-input">
          <input
            className="chatroom-setting-test-mode"
            onChange={handleTestModeChange}
            type="checkbox"
            checked={props.testMode}
          />
        </div>
      </div>

      <div className="chatroom-setting-bot-type-container">
        <p className="chatroom-setting-bot-type-label">Chatbot Options</p>
        <div className="chatroom-setting-test-mode-input">
          <select id="dropdown" className="chatroom-setting-bot-type-dropdown-select" value={props.botType} onChange={handleBotTypeChange}>
            <option value="gpt-based">GPT-based</option>
            <option value="rules-based">Rules-based</option>
          </select>
        </div>
      </div>
      
>>>>>>> Stashed changes

      <div className="chatroom-setting-participants-container">
        <p className="chatroom-setting-participants-label">
          Number of Participants: {props.userCount}
        </p>
      </div>
    </div>
  )
}
