// Targeted Elements
const passwordLengthEl = document.getElementById("col-passwordLengthEl");
const generatedPasswordEl = document.getElementById("col-passwordEl");
const copyStatusEl = document.getElementById("col-copyStatusEl");
const passwordStrengthStatusEl = document.getElementById(
  "col-strengthStatusEl"
);
const optionContainerEl = document.querySelector(".option--container");
const barEl = document.querySelectorAll(".bar");

// Input Elements
const rangeInputEl = document.querySelector("input[type='range']");
const checkBoxInputEl = document.querySelectorAll("input[type='checkbox']");

// Button Elements
const copyBtnEl = document.getElementById("btn--copyEl");
const generateBtnEl = document.getElementById("btn--generateEl");

// Error Handling Elements
const lengthErrorEl = document.querySelector(".length--error");
const optionErrorEl = document.querySelector(".option--error");

// Configuration
let barColor = "";
let strengthPoints = 0;

const chars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~`!@#$%^&*()_-+={[}]|:;\"'<,>.?/";

const patterns = {
  uppercase: "A-Z",
  lowercase: "a-z",
  number: "0-9",
  symbol: "\\W",
};

const colors = {
  red: "#F64A4A",
  orange: "#FB7C58",
  yellow: "#F8CD65",
  green: "#A4FFAF",
  black: "#24232C",
};

// Functions

// Showing Length of Password Color Effect on Range Input
function inputRangeProgress() {
  rangeInputEl.style.background = `linear-gradient(to right, #A4FFAF ${
    (rangeInputEl.value / 20) * 100
  }%, #18171F ${(rangeInputEl.value / 20) * 100}%)`;
  passwordLengthEl.textContent = rangeInputEl.value;
}

function checkError() {
  return !(
    rangeInputEl.valueAsNumber >= 8 &&
    [...checkBoxInputEl].some(box => box.checked)
  );
}

function errorMessage() {
  if (rangeInputEl.valueAsNumber < 8) lengthErrorEl.classList.add("error");
  else lengthErrorEl.classList.remove("error");

  if ([...checkBoxInputEl].some(box => box.checked))
    optionErrorEl.classList.remove("error");
  else optionErrorEl.classList.add("error");
}

function userExpectedPattern() {
  let result = "";
  let patternToCheck = "";
  const checkedBoxes = [...checkBoxInputEl]
    .filter(box => box.checked)
    .map(box => box.id);
  for (const box of checkedBoxes) {
    result += patterns[box];
    patternToCheck += `(?=.*[${patterns[box]}])`;
  }
  return [result, `^${patternToCheck}[${result}]+$`];
}

function generatePassword(patterns, passLength) {
  const [expectedPatternInStr, checkPatternInStr] = patterns();
  const expectedPatterns = RegExp(`[${expectedPatternInStr}]`, "g");
  const setOfChars = chars.match(expectedPatterns);
  const checkPattern = RegExp(`${checkPatternInStr}`, "g");
  let pWord = "";
  while (!checkPattern.test(pWord)) {
    pWord = "";
    for (let i = 0; i < Number(passLength); i++) {
      pWord += setOfChars[Math.floor(Math.random() * setOfChars.length)];
    }
  }
  return pWord;
}

function copyText() {
  navigator.clipboard.writeText(generatedPasswordEl.textContent);
}

// Attach Event Handlers
rangeInputEl.addEventListener("input", inputRangeProgress);

optionContainerEl.addEventListener("click", function () {
  strengthPoints = [...checkBoxInputEl].filter(box => box.checked).length;

  switch (strengthPoints) {
    case 1:
      passwordStrengthStatusEl.textContent = "too weak!";
      barColor = colors.red;
      break;
    case 2:
      passwordStrengthStatusEl.textContent = "weak";
      barColor = colors.orange;
      break;
    case 3:
      passwordStrengthStatusEl.textContent = "medium";
      barColor = colors.yellow;
      break;
    case 4:
      passwordStrengthStatusEl.textContent = "strong";
      barColor = colors.green;
      break;
    default:
      passwordStrengthStatusEl.textContent = "";
      break;
  }

  for (let i = 0; i < 4; i++) {
    if (i < strengthPoints) barEl[i].style.backgroundColor = barColor;
    else barEl[i].style.backgroundColor = colors.black;
  }
});

copyBtnEl.addEventListener("click", function () {
  if (!checkError) return;

  copyText();
  copyStatusEl.textContent = "Copied";
});

generateBtnEl.addEventListener("click", function () {
  if (!checkError()) {
    generatedPasswordEl.textContent = generatePassword(
      userExpectedPattern,
      passwordLengthEl.textContent
    );
    generatedPasswordEl.classList.remove("text--disabled");
    copyStatusEl.textContent = "";
  }
  errorMessage();
});
