
# IND vs AUS: Endgame – A Cricket-Themed Word Guessing Game

Welcome to **Endgame**, a fun and engaging cricket-themed word guessing game inspired by the thrill of an India vs Australia match! Your mission is to help Team India reach a big score by guessing the secret word correctly. Every wrong guess costs a wicket — can you help the team hit 300+ without collapsing?

---

## How to Play

1. Guess the hidden word by clicking or typing letters.  
2. Every correct guess earns **51 runs**.  
3. Every incorrect guess costs **1 wicket**.  
4. You have **8 chances** to help India reach 300+.  
5. On game over, you'll see the **word meaning** for learning.

---

## Screenshots

![screenshot](https://github.com/tush1504/Learn-English-Play-Cricket/blob/main/public/Screenshot%202025-06-12%20224918.png)
![screenshot](https://github.com/tush1504/Learn-English-Play-Cricket/blob/main/public/Screenshot%202025-06-12%20230407.png)
![screenshot](https://github.com/tush1504/Learn-English-Play-Cricket/blob/main/public/Screenshot%202025-06-12%20224858.png)

---

## Gameplay

- You have **8 guesses** to uncover the secret word.
- Each incorrect letter guess **loses one player (wicket)**.
- Guess the full word before losing all 8 wickets.
- Includes fun commentary and a 🎉 confetti celebration on winning!

---

## Features

-  On-screen keyboard for interactive letter guessing
-  Visual feedback for correct/wrong letters
-  Animated player chips representing wickets
-  Random words on each new game
-  Accessibility support with `aria-live` regions
-  Confetti celebration upon winning
-  Themed for India vs Australia cricket fans
-  Timer available to check the speed
-  Background Music to match vibe with the game
-  Keep track of the score as you play
-  Analytical report when the game is over
-  Word Meaning and POS to learn about the word
-  High Score Tracker to keep up the competition

---

## 🛠 Tech Stack

- **Frontend**: React, JavaScript, SCSS/CSS3  
- **APIs**: [Free Dictionary API](https://dictionaryapi.dev/)  
- **Deployment**: Vercel / Netlify / GitHub Pages  
- **State Handling**: React Hooks (`useState`, `useEffect`)  
- **Storage**: `localStorage` for high scores
- `clsx` for dynamic className binding
- `react-confetti` for celebration effects
- `npm-popular-english-words` for random words

---

##  Getting Started

### Prerequisites

- Node.js >= 14
- npm or yarn

### Install and Run

```bash
# Clone the repo
git clone https://github.com/your-username/endgame-word-guess.git
cd endgame-word-guess

# Install dependencies
npm install

# Start the development server
npm run dev
```
---

##  Project Structure

```plaintext

project-root/
│
├── public/
│   ├── screenshot 1
│   ├── screenshot 2
│   ├── screenshot 3
│   └── vite.svg
│
├── src/
│   ├── assets/
│   │    └──music.mp3        
│   ├── App.jsx
│   ├── ControlPanel.jsx
│   ├── utils.js
│   ├── players.js
│   ├── main.jsx
│   └── index.css
│
├── README.md
├── LICENSE
├── package.js
├── package-lock.js
├── enlist-config.js
└── vite-config.js
```
---

##  API Reference

- **Free Dictionary API**:  
  [https://api.dictionaryapi.dev/api/v2/entries/en/<word>](https://dictionaryapi.dev/)

---

##  To-Do / Improvements

- [ ] Add multiplayer support  
- [ ] Add difficulty levels for longer words    
- [ ] Dark mode / theme toggle  
- [ ] Accessibility enhancements (ARIA, screen reader support)

---

##  Deployment

You can deploy the app using:

- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [GitHub Pages](https://pages.github.com/)

Make sure to configure your `public/index.html` for SEO (title, description, Open Graph).

---

##  Acknowledgement

- Word list and farewell messages are custom designed for a cricket audience
- Inspired by Hangman mechanics, blended with cricket drama
- Uses react-confetti: https://www.npmjs.com/package/react-confetti

---

##  Author

**Tushar Kant Sahu**  
[GitHub Profile](https://github.com/tush1504)

---

##  License

This project is licensed under the [MIT License](LICENSE).

---


If you like this project, leave a ⭐️ on [GitHub](https://github.com/tush1504/Competitive-Tenzies) to support it!





