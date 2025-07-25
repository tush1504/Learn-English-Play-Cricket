import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { players } from "./players";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";
import ControlPanel from "./ControlPanel";

export default function Endgame() {
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wordMeaning, setWordMeaning] = useState(null);
  const [isFetchingMeaning, setIsFetchingMeaning] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const refBtn = useRef(null);
  const gameAreaRef = useRef(null);

  const numGuessesLeft = 8;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // Calculate current score
  const currentScore = guessedLetters.reduce((score, letter) => {
    const letterCount = currentWord.split('').filter(l => l === letter).length;
    return score + (letterCount * 51);
  }, 0);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isGameOver) {
      refBtn.current?.focus();
    }
  }, [isGameOver]);

  // Score popup effect
  useEffect(() => {
    if (lastGuessedLetter && currentWord.includes(lastGuessedLetter)) {
      const letterCount = currentWord.split('').filter(l => l === lastGuessedLetter).length;
      const scoreGained = letterCount * 51;
      if (scoreGained > 0) {
        setLastScore(scoreGained);
        setShowScorePopup(true);
        setTimeout(() => setShowScorePopup(false), 1500);
      }
    }
  }, [lastGuessedLetter, currentWord]);

  function addGuessedLetter(letter) {
    if (!hasGameStarted) setHasGameStarted(true);
    setGuessedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  }

  function startNewGame() {
    setGuessedLetters([]);
    setCurrentWord(getRandomWord());
    setHasGameStarted(false);
    setTimeElapsed(0);
    setWordMeaning(null);
    setShowScorePopup(false);
  }

  const playersElement = players.map((player, index) => {
    const isPlayerLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: player.backgroundColor,
      color: player.color,
    };
    const className = clsx("chip", isPlayerLost && "lost");
    return (
      <span 
        className={className} 
        style={styles} 
        key={player.name}
        title={isPlayerLost ? `${player.name} is OUT!` : `${player.name} is batting`}
      >
        {player.name}
      </span>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter =
      isGameLost || guessedLetters.includes(letter);
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    );
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    );
  });

  const keyboardElements = "qwertyuiopasdfghjklzxcvbnm".split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver}
        aria-disabled={isGuessed}
        onClick={() => addGuessedLetter(letter)}
        title={`Guess letter ${letter.toUpperCase()}`}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          🏏 {getFarewellText(players[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>🎉 MAGNIFICENT BATTING! 🎉</h2>
          <p>Team India scored {currentScore} runs! What a performance! </p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>😔 ALL OUT! Very disappointing total!</h2>
          <p>Only {currentScore} runs scored. The bowlers need to work magic now!</p>
        </>
      );
    }

    return null;
  }

  // Fetch word meaning when game is over
  useEffect(() => {
    if (isGameOver) {
      setIsFetchingMeaning(true);
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`)
        .then((res) => res.json())
        .then((data) => {
          const meaning = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
          const partOfSpeech = data[0]?.meanings?.[0]?.partOfSpeech;
          setWordMeaning(
            meaning
              ? `${meaning} (${partOfSpeech})`
              : "No definition found."
          );
        })
        .catch(() => setWordMeaning("Failed to fetch definition."))
        .finally(() => setIsFetchingMeaning(false));
    }
  }, [isGameOver, currentWord]);

  // Analytics
  const correctGuesses = guessedLetters.filter((l) => currentWord.includes(l));
  const incorrectGuesses = guessedLetters.filter((l) => !currentWord.includes(l));
  const accuracy =
    guessedLetters.length === 0
      ? 0
      : ((correctGuesses.length / guessedLetters.length) * 100).toFixed(1);

  return (
    <>
    {/* Fixed confetti with proper viewport dimensions and overflow prevention */}
    {isGameWon && (
        <Confetti
          width={Math.min(windowSize.width, document.documentElement.clientWidth)}
          height={Math.min(windowSize.height, document.documentElement.clientHeight)}
          initialVelocityY={{ min: 5, max: 8 }}
          numberOfPieces={800}
          colors={['#FF8C00', '#FFD700', '#1E3A8A', '#FFFFFF', '#22C55E']}
          shapes={['circle', 'square']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
      )}
    
    <div id="root-container">

      <div id="left-side">
        <header>
          <h1>🏏 IND v/s AUS: Endgame</h1>
        </header>
        {!isGameOver && (
          <section className="about">
            <p>
              Below is the list of the most frequently used letters in English, in decreasing order (from most to least used).<br />
              Choose your letters with this in mind.<br />
              <span style={{color: '#FFD700', fontWeight: 'bold'}}>
                E → A → R → I → O → T → N → S → L → C → U → D → P → M → H → G → B → F → Y → W → K → V → X → Z → J → Q
              </span>
            </p>
          </section>
        )}
        
        <ControlPanel
          isGameOver={isGameOver}
          guessedLetters={guessedLetters}
          currentWord={currentWord}
          wrongGuessCount={wrongGuessCount}
          timeElapsed={timeElapsed}
          setTimeElapsed={setTimeElapsed}
          hasGameStarted={hasGameStarted}
          currentScore={currentScore}
        />
      </div>
      
      <main className="game-panel" ref={gameAreaRef}>
        {/* Game Header with Description */}
        <div className="game-header">
          <h2>🏟️ Cricket Stadium</h2>
          <div className="game-description">
            <p>
              <strong> Mission:</strong> Guess the word within 8 attempts to help Team India set a high target!
            </p>
            <p>
              <strong> Scoring:</strong> Each correct guess adds 51 runs || Wrong guess = One wicket down
            </p>
            <p>
              <strong> Benefits:</strong> Sharpen vocabulary, improve focus, and boost mental agility
            </p>
          </div>
        </div>

        <section
          aria-live="polite"
          role="status"
          className={gameStatusClass}
        >
          {renderGameStatus()}
        </section>

        <section className="player-chips">{playersElement}</section>

        <section className="word" style={{position: 'relative'}}>
          {showScorePopup && (
            <div className="score-popup">
              +{lastScore} RUNS! 🏏
            </div>
          )}
          {letterElements}
        </section>

        <section className="sr-only" aria-live="polite" role="status">
          <p>
            {currentWord.includes(lastGuessedLetter)
              ? `Correct! The letter ${lastGuessedLetter} is in the word.`
              : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
            You have {numGuessesLeft - wrongGuessCount} attempts left.
          </p>
          <p>
            Current word:{" "}
            {currentWord
              .split("")
              .map((letter) =>
                guessedLetters.includes(letter) ? letter + "." : "blank."
              )
              .join(" ")}
          </p>
        </section>

        <section className="keyboard">{keyboardElements}</section>

        <section id="stats">
          {/* Analytics */}
          {isGameOver && (
            <div className="analytics">
              <label>🏏 Game Analytics</label>
              <ul>
                <li><span>Accuracy:</span> <span>{accuracy}%</span></li>
                <li><span>Correct:</span> <span>{correctGuesses.length}</span></li>
                <li><span>Wrong:</span> <span>{incorrectGuesses.length}</span></li>
                <li><span>Total Guesses:</span> <span>{guessedLetters.length}</span></li>
                <li><span>Final Score:</span> <span style={{color: '#FFD700', fontWeight: 'bold'}}>{currentScore}</span></li>
              </ul>
            </div>
          )}

          {/* Word Meaning */}
          {isGameOver && (
            <div className={clsx("meaning", isFetchingMeaning && "loading")}>
              <label>📚 Word Meaning</label>
              <p>
                <strong style={{color: '#FFD700'}}>{currentWord.toUpperCase()}</strong><br />
                {isFetchingMeaning ? "Fetching meaning..." : wordMeaning}
              </p>
            </div>
          )}
        </section>

        {isGameOver && (
          <button
            className="new-game"
            onClick={startNewGame}
            ref={refBtn}
          >
            🏏 New Cricket Match
          </button>
        )}
      </main>
    </div>
    </>
  );
}
