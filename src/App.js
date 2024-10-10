// src/App.js
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Game from './Game';  // The Game component
import Login from './Login';  // The Login component

const App = () => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const [gameStarted, setGameStarted] = useState(false); // Track if the game has started

  // Check localStorage for persisted user data on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData); // Set the user data after successful login
    localStorage.setItem('user', JSON.stringify(userData)); // Save the user data to localStorage
  };

  const handleStartGame = () => {
    setGameStarted(true); // Set game as started when the button is clicked
  };

  const handleLogout = () => {
    setUser(null); // Clear the user data
    setGameStarted(false); // Reset the game
    localStorage.removeItem('user'); // Remove user data from localStorage
  };

  return (
    <div>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : !gameStarted ? (  // Check if the game has not started
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Welcome, {user.name}!</h1>
          <p>Phone: {user.phone}</p>
          <button onClick={handleStartGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start Game
          </button>
          <br />
          <button onClick={handleLogout} style={{ padding: '5px 10px', marginTop: '20px', fontSize: '12px' }}>
            Logout
          </button>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Game />
        </DndProvider>
      )}
    </div>
  );
};

export default App;
