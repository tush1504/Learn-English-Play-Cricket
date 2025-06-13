import { useState, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { players } from "./players";
import { getFarewellText, getRandomWord } from "./utils";
import Confetti from "react-confetti";
import ControlPanel from "./ControlPanel";

export default function Endgame() {
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState(() =>getRandomWord());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wordMeaning, setWordMeaning] = useState(null);
  const [isFetchingMeaning, setIsFetchingMeaning] = useState(false);

  const refBtn = useRef(null);

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

  useEffect(() => {
    if (isGameOver) {
      refBtn.current?.focus();
    }
  }, [isGameOver]);

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
  }

  const playersElement = players.map((player, index) => {
    const isPlayerLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: player.backgroundColor,
      color: player.color,
    };
    const className = clsx("chip", isPlayerLost && "lost");
    return (
      <span className={className} style={styles} key={player.name}>
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
          {getFarewellText(players[wrongGuessCount - 1].name)}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>Extraordinary Batting! Just pure class!!</h2>
          <p>Well done! India scored 300+ runs. 🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>Very less target on a flat pitch!!.</h2>
          <p>Hope so our bowlers can defend it! 😭</p>
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
    <div id="root-container">

   
        {isGameWon && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            initialVelocityY={{ min: 5, max: 8 }}
            numberOfPieces={1000}
          />
        )}

        <div id="left-side">
            <header>
              <h1>IND v/s AUS: Endgame</h1>
              <p>
                Guess the word within 8 attempts to help Team India set high target by winning this Word Game!
              </p>
              <p>
                Each correct guess adds 51 runs to the total score and wrong guess means one wicket goes away.

              </p>
              <p>Play and Grow! This game helps sharpen your vocabulary, improve focus, and boost mental agility.</p>
            </header>
            <ControlPanel
            isGameOver={isGameOver}
            guessedLetters={guessedLetters}
            currentWord={currentWord}
            wrongGuessCount={wrongGuessCount}

            timeElapsed={timeElapsed}
            setTimeElapsed={setTimeElapsed}
            hasGameStarted={hasGameStarted}
          />
        </div>
        
        <main className="game-panel">
        {!isGameOver && (<section className="about">
            <p>
            Below is the list of the most frequently used letters in English, in decreasing order (from most to least used).
            Choose your letters with this in mind.<br />
            E → A → R → I → O → T → N → S → L → C → U → D → P → M → H → G → B → F → Y → W → K → V → X → Z → J → Q
          </p>


        </section>)}
        <section
          aria-live="polite"
          role="status"
          className={gameStatusClass}
        >
          {renderGameStatus()}
        </section>

        <section className="player-chips">{playersElement}</section>

        <section className="word">{letterElements}</section>

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
              <label>Game Analytics:</label>
              <ul>
                <li>Accuracy: {accuracy}%</li>
                <li>Correct: {correctGuesses.length}</li>
                <li>Wrong: {incorrectGuesses.length}</li>
                <li>Total Guesses: {guessedLetters.length}</li>
              </ul>
            </div>
        )}

        {/* Word Meaning */}
        {isGameOver && (
          <div className="meaning">
            <label>Word Meaning:</label>
            <p>
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
            New Game
          </button>
        )}
      </main>
      
    </div>
  );

}


