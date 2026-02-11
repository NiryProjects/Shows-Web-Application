const shuffleString = (str: string): string => {
  // Convert string to array for shuffling
  const arr = [...str];
  let r = arr.length;
  let i = 0;

  // While there remain elements to shuffle...
  while (r) {
    // Pick a remaining element...
    i = Math.floor(Math.random() * r);
    r--;
    // And swap it with the current element.
    [arr[i], arr[r]] = [arr[r], arr[i]];
  }

  return arr.join("");
};

const smallLetters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const capitalLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const numbersAry = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const getRandomCharPassword = (group: number): string => {
  let rnd = 0;
  let ch = "A";

  const lettersSmall = 0;
  const lettersBig = 1;
  const numbers = 2;

  if (group === lettersSmall) {
    rnd = Math.floor(Math.random() * 26);
    ch = smallLetters[rnd];
  } else if (group === lettersBig) {
    rnd = Math.floor(Math.random() * 26);
    ch = capitalLetters[rnd];
  } else if (group === numbers) {
    rnd = Math.floor(Math.random() * 9);
    ch = numbersAry[rnd];
  }

  return ch;
};

export const getPassword = (): string => {
  let password = "";
  const length = 8;
  const groups = 3;

  for (let i = 0; i < 3; i++) {
    password += getRandomCharPassword(i);
  }

  for (let i = 3; i < length; i++) {
    const group = Math.floor(Math.random() * groups);
    password += getRandomCharPassword(group);
  }

  password = shuffleString(password);

  return password;
};

export const mySuffleString = shuffleString;
