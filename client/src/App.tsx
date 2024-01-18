import React from 'react';
import { CreateLobby } from './pages/CreateLobby/CreateLobby';
import { Routes, Route } from 'react-router-dom';
import { JoinLobby } from './pages/JoinLobby/JoinLobby';
import { Home } from './pages/Home/Home';
import { Chatroom } from './pages/Chatroom/Chatroom';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';
const socket = io(SERVER_URL);

export function App() {
  return (
    <div className="app">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createlobby" element={<CreateLobby socket={socket} />} />
        <Route path="/joinlobby" element={<JoinLobby socket={socket} />} />
        <Route path="/chatroom" element={<Chatroom socket={socket} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

function ErrorPage() {
  return (
    <div>
      <h1> Error </h1>
    </div>
  );
}
