import { words } from 'popular-english-words'

const filteredWords = words.getMostPopular(2000).filter(
  w => w.length > 5 && w.length < 9
)

export function getRandomWord() {
  if (filteredWords.length === 0) return 'default'
  const index = Math.floor(Math.random() * filteredWords.length)
  return filteredWords[index]
}

export function getFarewellText(name) {
    const options = [
        `Tough luck, $${name} couldn't handle the pressure!`,
        `${name} is walking back to the pavilion...`,
        `That's a golden duck for ${name}!`,
        ` ${name} was clean bowled!`,
        `Oh no! ${name} didn't see that coming!`,
        `${name} gets caught behind!`,
        `${name} fell to a brilliant delivery!`,
        `That's a huge blow—${name} is gone!`,
        ` Well fought, ${name}, but not enough today!`
        
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}