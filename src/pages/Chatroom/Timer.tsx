import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface TimerProps {
  time: number; // Expected time in minutes
  socket: Socket;
  code: String;
  setDisabled: (disabled: boolean) => void;
  inactivity: String;
  setInactivity: (inactivity: string) => void;
}

const Timer: React.FC<TimerProps> = ({
  time,
  socket,
  code,
  setDisabled,
  inactivity,
  setInactivity,
}) => {
  const [seconds, setSeconds] = useState<number>(time * 60);
  const [inactivitySeconds, setInactivitySeconds] = useState<number>(0);
  console.log(time);
  console.log(seconds);

  useEffect(() => {
    setSeconds(time * 60); // Update seconds whenever time changes
  }, [time]);
  
  useEffect(() => {
    // Moved interval declaration inside useEffect to avoid reference errors
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
      setInactivitySeconds((prev) => prev + 1);
    }, 1000);

    // The cleanup function properly clears the interval
    return () => clearInterval(interval);
  }, [setSeconds, setInactivitySeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      setDisabled(true);
    } else if (seconds === 60) {
      socket.emit('chatStartConclusionPhase', code);
    }

    if (inactivitySeconds > 60 && inactivity !== 'inactive') {
      setInactivity('inactive');
    }

    if (inactivity === 'message') {
      setInactivitySeconds(0);
      setInactivity('pending');
    }
  }, [seconds, inactivitySeconds, inactivity, setDisabled, setInactivity, socket, code]);

  const formatTime = (): string => {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className='side-container'>
      <p className='sider-heading'>Task Completion</p>
      <p style={{ margin: '8px 0' }}>{formatTime()}</p>
    </div>
  );
};

export default Timer;
