import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './Chatroom.css'
import { Socket } from 'socket.io-client';

//import modules
import SideBar from './SideBar';

type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
interface ChatroomItems {
  time: number;
  chatName: string;
  chatTopic: string;
}
interface ChatroomProps {
  socket: Socket;
}

export function Chatroom(props: ChatroomProps) {
  const [code, setCode] = useState('');
  const [chatName, setChatName] = useState('');
  const [chatTime, setChatTime] = useState(1);
  const [chatTopic, setChatTopic] = useState('');
  const [name, setName] = useState('Guest');
  const [masterMessages, setMasterMessages] = useState<JSX.Element[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [inactivity, setInactivity] = useState('pending');

  useEffect(() => {
    // Retrieve the name parameter from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const idFromURL = searchParams.get('id') || '....';
    const nameFromURL = searchParams.get('name');

    if (nameFromURL !== null) {
      const decodedName = decodeURIComponent(nameFromURL);
      setName(decodedName);
    };

    // Set the name
    setCode(() => idFromURL);
  }, [setCode]);

  useEffect(() => {
    props.socket.on('joinedChatroom', (guid : any) => {
      console.log("Recieved Ping");
      props.socket.emit('getChatData', code);
      console.log(code);
      console.log("sent Ping");
    });

  }, [props.socket, code]);

  useEffect(() => {
    props.socket.on('chatData', (chatItems : ChatroomItems) => {
      setChatName(chatItems.chatName);
      setChatTime(chatItems.time);
      setChatTopic(chatItems.chatTopic);
    });
  }, []);


  return (
    <div style={{
      backgroundColor: '#EEEDEA'
    }}>
      <div className='page-header'>
        <p>{'EduChatbot'}</p>
        <p>{'Chatroom: ' + code}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <div className='side-bar'>
          <SideBar
            time={chatTime}
            socket={props.socket}
            code={code} name={name}
            messages={masterMessages}
            setDisabled={setDisabled}
            inactivity={inactivity}
            setInactivity={setInactivity}
            chatName={chatName}
            chatTopic={chatTopic}/>
        </div>
        <div className='body-container'>
          <ChatBox
            socket={props.socket}
            code={code}
            setMasterMessages={setMasterMessages}
            disabled={disabled}
            inactivity={inactivity}
            setInactivity={setInactivity}/>
        </div>

      </div>
    </div>
  );
}

interface MessageProps {
  user: string;
  message: string;
  timestamp: string;
}

interface MessageDataProps {
  text: string;
  sender: string;
  lobbyId: string;
  timestamp: string;
};

interface ChatBoxProps {
  code: string;
  socket: Socket;
  setMasterMessages : StateSetter<JSX.Element[]>
  disabled : boolean;
  inactivity : string;
  setInactivity : StateSetter<string>;
}

function ChatBox(props: ChatBoxProps) {
  const [messages, setMessages] = useState<JSX.Element[]>([]);
  const [name, setName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Emit joinRoom when the component mounts or roomId/socket changes
    if (props.socket && props.code && name !== '') {
      props.socket.emit('joinRoom', props.code, name);
    }

  }, [props.socket, props.code, name]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const nameFromURL = searchParams.get('name');


    if (nameFromURL !== null) {
      const decodedName = decodeURIComponent(nameFromURL);
      // Now decodedName is guaranteed to be a string
      setName(decodedName);
    } else {
      // Handle the case where 'name' parameter is not present in the URL
      // setName('Guest');
    }

    // alert(nameFromURL); // a
  }, [setName]);

  useEffect(() => {
    props.socket.on('connect', () => {
      console.log('Connected to server!');
    });
  }, [props.socket]);

  useEffect(() => {
    props.socket.on('message', (messageData: MessageDataProps) => {
      setMessages(prevMessages => [...prevMessages, <Message user={messageData.sender} message={messageData.text} timestamp={messageData.timestamp}/>]);
      props.setMasterMessages(prevMessages => [...prevMessages, <Message user={messageData.sender} message={messageData.text} timestamp={messageData.timestamp}/>]);
      props.setInactivity('message');
    });

    return () => {
      props.socket.off('message');
    };
  }, [props.socket]);

  useEffect(() => {
    if (props.inactivity === 'inactive') {
      props.setInactivity('message');
      props.socket.emit('lobbyInactivity', props.code);
    }
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const Message = (props: MessageProps) => {
    return (
      <div>
        <div className='message-position'>
          <div className='message-picture'>
            <img
              src="LOGO.jpg"
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Keeps the aspect ratio and covers the entire div
              }}
            />
          </div>
          <div>
            <p className='message-user'>{props.user}</p>
            <p className='message-text'>{props.message}</p>
          </div>

        </div>
        <hr className='message-line' />
      </div>
    )
  }

  const MessageInput = () => {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (input === '') {
        return;
      }

      let messageData = {
        text: input,
        sender: name,
        lobbyId: props.code,
        timestamp: formatTimestamp(new Date().getTime()),
      };

      console.log(` LOBBY ID: ${props.code}, sending ${input}`);

      props.socket.emit('lobbyMessage', props.code, messageData);

      setInput('');
    };

    return (
      <div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message"
            className='message-input'
            disabled={props.disabled}
          />
          <button type="submit" className='message-button'>
            <img
              src="send.png"
              alt='Send'
              style={{
                width: '50%',
                height: '50%',
                objectFit: 'cover', // Keeps the aspect ratio and covers the entire button
              }}
            />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className='chatbox-container'>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  )
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
};
