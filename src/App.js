import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

const fetchWords = async () => {
  const response = await fetch(
    'https://random-word-api.herokuapp.com/word?number=1000'
  );
  const data = await response.json();
  return data;
};

const generateRandomWords = async () => {
  const wordsData = await fetchWords();
  const words = wordsData.map((wordData) => wordData);
  return Array.from({ length: 10 }, () => words[Math.floor(Math.random() * words.length)]);
};

function App() {
  const [input, setInput] = useState('');
  const [words, setWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setWords(await generateRandomWords());
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let interval = null;
    if (startTime && !timeTaken) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [startTime, timeTaken]);

  const handleChange = (e) => {
    setInput(e.target.value);

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (e.target.value.trim() === words.join(' ')) {
      setTimeTaken((Date.now() - startTime) / 1000);
    }
  };

  return (
    <div className="App">
      <h1>Typing Speed Test</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Type the following words as fast as you can:</p>
          <div className="words">
            {words.map((word) => (
              <span key={uuidv4()}>{word}</span>
            ))}
          </div>
          <textarea
            value={input}
            onChange={handleChange}
            disabled={timeTaken !== null}
            rows={4}
            cols={50}
          />
          {timeTaken ? (
            <p>
              Congratulations! You finished in {timeTaken.toFixed(2)} seconds.
            </p>
          ) : (
            <p>Time elapsed: {timer} seconds</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;
