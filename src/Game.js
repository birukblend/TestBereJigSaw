// src/Game.js
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ITEM_TYPE = 'BOX';

// DraggableBox component
const DraggableBox = ({ id, text }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: '10px',
        margin: '0', // Remove margin to reduce spacing
        backgroundColor: isDragging ? 'lightgreen' : 'lightblue',
        cursor: 'move',
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  );
};

// DropZone component
const DropZone = ({ id, imageUrl, onDrop, isCorrect }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => onDrop(item.id, id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        width: '100px',
        height: '100px',
        margin: '0', // Remove margin to reduce spacing
        border: '1px solid black',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        opacity: isOver ? 0.5 : 1,
        backgroundColor: isCorrect ? 'lightgreen' : '',
      }}
    />
  );
};

// Start Page Component
const StartPage = ({ onStart }) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to the Drag and Drop Game!</h1>
      <button onClick={onStart} style={{ padding: '10px', fontSize: '16px' }}>
        Start Game
      </button>
    </div>
  );
};

const Game = () => {
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [userName, setUserName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); // Track if game is started

  const [boxes, setBoxes] = useState([
    { id: '1', text: 'Box 1', correctImageId: 'image1' },
    { id: '2', text: 'Box 2', correctImageId: 'image2' },
    { id: '3', text: 'Box 3', correctImageId: 'image3' },
    { id: '4', text: 'Box 4', correctImageId: 'image4' },
    { id: '5', text: 'Box 5', correctImageId: 'image5' },
    { id: '6', text: 'Box 6', correctImageId: 'image6' },
    { id: '7', text: 'Box 7', correctImageId: 'image7' },
    { id: '8', text: 'Box 8', correctImageId: 'image8' },
    { id: '9', text: 'Box 9', correctImageId: 'image9' },
  ]);

  const [droppedBoxes, setDroppedBoxes] = useState({});

  // Function to format time in MM:SS:mmm format
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
  };

  useEffect(() => {
    if (!gameOver && gameStarted) {
      const interval = setInterval(() => {
        setMilliseconds((prev) => prev + 10); // Update every 10ms for precision
      }, 10);

      return () => clearInterval(interval);
    }
  }, [gameOver, gameStarted]);

  const handleDrop = (boxId, targetImageId) => {
    const box = boxes.find((b) => b.id === boxId);
    if (box.correctImageId === targetImageId) {
      setScore((prev) => prev + 1);
      setDroppedBoxes((prev) => ({ ...prev, [boxId]: true }));
    } else {
      setErrors((prev) => prev + 1);
      setDroppedBoxes((prev) => ({ ...prev, [boxId]: false }));
    }
  };

  useEffect(() => {
    if (Object.keys(droppedBoxes).length === boxes.length) {
      const allCorrect = boxes.every((box) => droppedBoxes[box.id] === true);
      if (allCorrect) {
        setGameOver(true);
        handleGameOver();
      }
    }
  }, [droppedBoxes, boxes]);

  const shuffleBoxes = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const handleGameOver = () => {
    const newEntry = {
      name: userName,
      time: milliseconds,
      errors: errors,
    };

    const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    const existingEntryIndex = savedLeaderboard.findIndex(entry => entry.name === userName);
    if (existingEntryIndex >= 0) {
      const existingEntry = savedLeaderboard[existingEntryIndex];
      
      if (milliseconds < existingEntry.time || (milliseconds === existingEntry.time && errors < existingEntry.errors)) {
        savedLeaderboard[existingEntryIndex] = newEntry;
      }
    } else {
      savedLeaderboard.push(newEntry);
    }

    savedLeaderboard.sort((a, b) => {
      if (a.time === b.time) {
        return a.errors - b.errors;
      }
      return a.time - b.time;
    });

    localStorage.setItem('leaderboard', JSON.stringify(savedLeaderboard));
    setLeaderboard(savedLeaderboard);
  };

  const handleRestart = () => {
    setScore(0);
    setErrors(0);
    setMilliseconds(0);
    setDroppedBoxes({});
    setGameOver(false);
    setUserName('');

    setBoxes(shuffleBoxes([
      { id: '1', text: 'Box 1', correctImageId: 'image1' },
      { id: '2', text: 'Box 2', correctImageId: 'image2' },
      { id: '3', text: 'Box 3', correctImageId: 'image3' },
      { id: '4', text: 'Box 4', correctImageId: 'image4' },
      { id: '5', text: 'Box 5', correctImageId: 'image5' },
      { id: '6', text: 'Box 6', correctImageId: 'image6' },
      { id: '7', text: 'Box 7', correctImageId: 'image7' },
      { id: '8', text: 'Box 8', correctImageId: 'image8' },
      { id: '9', text: 'Box 9', correctImageId: 'image9' },
    ]));
  };

  const handleMenu = () => {
    setGameStarted(false); // Go back to the start page
  };

  // Render StartPage if the game hasn't started
  if (!gameStarted) {
    return <StartPage onStart={() => setGameStarted(true)} />;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Main Game Area */}
      <div style={{ textAlign: 'center', flexGrow: 1 }}>
        <h1>Drag and Drop Game</h1>
        <h2>Score: {score}</h2>
        <h2>Errors: {errors}</h2>
        <h2>Timer: {formatTime(milliseconds)}</h2> {/* Display the timer in MM:SS:mmm format */}

        {/* Grid for images (drop zones) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 100px)', 
          gridGap: '0px', 
          justifyContent: 'center', 
          marginBottom: '20px' 
        }}>
          {boxes.slice(0, 9).map((box, index) => (
            <DropZone
              key={index}
              id={`image${index + 1}`}
              imageUrl={`https://via.placeholder.com/100?text=Image${index + 1}`}
              onDrop={handleDrop}
              isCorrect={droppedBoxes[box.id] === true}
            />
          ))}
        </div>

        {/* Grid for draggable boxes */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 100px)', 
          gridGap: '0px', 
          justifyContent: 'center' 
        }}>
          {boxes.map((box) => (
            <DraggableBox key={box.id} {...box} />
          ))}
        </div>

        {gameOver && (
          <div>
            <h2>You Win!</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
        )}

        <button onClick={handleRestart} style={{ padding: '10px', marginTop: '20px' }}>
          Restart
        </button>

        {/* Menu button to go back to start page */}
        <button onClick={handleMenu} style={{ padding: '10px', marginTop: '10px' }}>
          Menu
        </button>
      </div>

      {/* Leaderboard Area */}
      <div style={{ width: '200px', textAlign: 'left', padding: '20px', backgroundColor: '#f9f9f9', borderLeft: '1px solid #ccc' }}>
        <h2>Leaderboard</h2>
        <ul>
          {leaderboard.map((entry, index) => (
            <li key={index}>
              {entry.name}: {formatTime(entry.time)} | Errors: {entry.errors}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Game;
