import React from 'react';
import { CreateLobby } from './pages/CreateLobby/CreateLobby';
import { Routes, Route } from 'react-router-dom';
import { JoinLobby } from './pages/JoinLobby/JoinLobby';
import { Home } from './pages/Home/Home';
import { Chatroom } from './pages/Chatroom/Chatroom';
import { Monitor } from './pages/Monitor/Monitor';
import io from 'socket.io-client';

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL ?? "localhost:4000";
const socket = io(REACT_APP_SERVER_URL);

// "/home" is the homepage
// Teacher route: CreateLobby->LobbySettings->
export function App() {
  return (
    <div className="app">
      <Routes>
        <Route index element={<Home socket={socket}/>} />
        {/* <Route index element={<Chatroom />} />*/}
        <Route path="/home"         element={<Home        socket={socket}/>} />
        <Route path="/createlobby"  element={<CreateLobby socket={socket} />} />
        <Route path="/monitor"      element={<Monitor     socket={socket} />} />
        <Route path="/joinlobby"    element={<JoinLobby   socket={socket} />} />
        <Route path="/chatroom"     element={<Chatroom    socket={socket} />} />
        <Route path="*"             element={<ErrorPage />} />
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
