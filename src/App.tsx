import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/chat';

function App() {
  const socket = new WebSocket('ws://localhost:8080');

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event) => {
    console.log('Message from server:', event.data);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };
  return (
      <Chat/>
  );
}

export default App;
