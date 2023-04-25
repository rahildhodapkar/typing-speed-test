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
  return Array.from({ length: 40 }, () => words[Math.floor(Math.random() * words.length)]);
};

function App() {
  const [input, setInput] = useState('');
  const [words, setWords] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [percentageCorrect, setPercentageCorrect] = useState(null);

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
    const targetInput = e.target.value;

    // Limit input length to the total number of characters in the target words
    if (targetInput.length <= words.join(' ').length) {
      setInput(targetInput);

      if (!startTime) {
        setStartTime(Date.now());
      }

      if (targetInput.length === words.join(' ').length) {
        setTimeTaken((Date.now() - startTime) / 1000);
        calculateCorrectPercentage(targetInput);
      }
    }
  };

  const calculateCorrectPercentage = (typedInput) => {
    const targetWords = words.join(' ');
    let correctCharacters = 0;

    for (let i = 0; i < typedInput.length; i++) {
      if (typedInput[i] === targetWords[i]) {
        correctCharacters++;
      }
    }

    setPercentageCorrect((correctCharacters / typedInput.length) * 100);
  };

  const handleNewTest = async () => {
    setLoading(true);
    setInput('');
    setStartTime(null);
    setTimeTaken(null);
    setTimer(0);
    setPercentageCorrect(null);
    setWords(await generateRandomWords());
    setLoading(false);
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
            <div>
              <p>
                Finished! It took {timeTaken.toFixed(2)} seconds.
              </p>
              <p>
                Correctness : {percentageCorrect.toFixed(2)}%
              </p>
            </div>
          ) : startTime ? (
            <p>Time elapsed: {timer} seconds</p>
          ) : (
            <p>Start typing to begin the test.</p>
          )}
          <button onClick={handleNewTest} disabled={!timeTaken}>
            New Test
          </button>
        </>
      )}
    </div>
  );
}

export default App;

