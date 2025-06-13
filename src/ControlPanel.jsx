import { useEffect, useRef, useState } from "react";
import bgMusic from "./assets/music.mp3"

export default function ControlPanel({
  isGameOver,
  guessedLetters,
  currentWord,
  wrongGuessCount,
  hasGameStarted
}) {
  const [volume, setVolume] = useState(0.4);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore")) || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const audioRef = useRef(null); 

  // Timer logic
  useEffect(() => {

    if (hasGameStarted && !isGameOver) {
      // Start fresh
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 10);
      }, 10);
    } 
    return () => clearInterval(timerRef.current);
  }, [hasGameStarted, isGameOver]);
  
  useEffect(() => {
    if (!hasGameStarted && !isGameOver) {
      setTimeElapsed(0);
    }
  }, [hasGameStarted, isGameOver]);

  useEffect(() => {
  // Count how many times each guessed letter appears in currentWord
    let totalCorrectLetters = 0;
    
    guessedLetters.forEach((guessedLetter) => {
      const matches = currentWord
        .split("")
        .filter((letter) => letter === guessedLetter).length;
    
      totalCorrectLetters += matches;
    });
  
    const calculatedScore = totalCorrectLetters * 51;
    setScore(calculatedScore);
  
    if (isGameOver && calculatedScore > highScore) {
      localStorage.setItem("highScore", calculatedScore);
      setHighScore(calculatedScore);
    }
  }, [guessedLetters, currentWord, isGameOver]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play/pause sync
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);


  // Time formatting
  const minutes = String(Math.floor(timeElapsed / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((timeElapsed % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(Math.floor((timeElapsed % 1000) / 10)).padStart(2, '0');

  const formattedTime = `${minutes}:${seconds}.${milliseconds}`;



  return (
    <div className="control-panel">

        <h2>Control Panel</h2>
    
        {/* Volume Control */}
        <div className="control-section music-control">
          <label>Music:</label>
          <div className="music-controls">
            <button
              className="music-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Music" : "Play Music"}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </button>
    
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              title={`Volume: ${Math.round(volume * 100)}%`}
              className="volume-slider"
            />
            <span className="volume-display">{Math.round(volume * 100)}%</span>
          </div>
          <audio ref={audioRef} loop src={bgMusic} autoPlay={false} />
        </div>
    
        {/* Timer */}
        <div className="control-section" id="timeline">
          <label>Time:</label>
          <p>{formattedTime}</p>
        </div>
    
        {/* Score */}
        <div className="control-section" id="scorecard">
          <label>Score:</label>
          <p>{score} - {wrongGuessCount}</p>
        </div>
    
        {/* High Score */}
        <div className="control-section" id="highscore">
          <label>High Score:</label>
          <p>{highScore}</p>
        </div>
      
    </div>
  );
}
