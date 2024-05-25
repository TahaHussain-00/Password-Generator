const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "`~!@#$%^&*()_+{}[]|;<>,?/";

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//handling the display value of the passwordlength
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  // inputSlider.style.backgroundSize = ( (passwordLength - min )*100/(max-min)) + "% 100%" 
  const percentage = ((passwordLength - min) * 100) / (max - min);  
  inputSlider.style.backgroundSize = `${percentage}% 100%`;
}
//  inputSlider.addEventListener("input", handleSlider);
//indicator function

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = "0 0 8px rgba(0,0,0,0.5)";
  // indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generating a random number
function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

//generating lower case by their ASCI values
function generateLowerCase() {
  const Numtostr = Math.floor(Math.random() * 26) + 97;
  return String.fromCharCode(Numtostr);
}

//generating Upper case characters by their ASCI values
function generateUpperCase() {
  const Numtostr = Math.floor(Math.random() * 26) + 65;
  return String.fromCharCode(Numtostr);
}

//generating random symbol
function generateSymbol() {
  const randomNumber = getRandomInteger(0, symbols.length);
  return symbols.charAt(randomNumber);
}

//calculating The Strength of the password

function calculateStrength() {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNumbers = numbersCheck.checked;
  let hasSymbols = symbolsCheck.checked;

  if (
    hasUpper &&
    hasLower &&
    (hasNumbers || hasSymbols) &&
    passwordLength >= 8
  ) {
    setIndicator("#0f0"); // Strong password (green)
  } else if (
    (hasLower || hasUpper) &&
    (hasNumbers || hasSymbols) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0"); // Medium strength password (yellow)
  } else {
    setIndicator("#f00"); // Weak password (red)
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
    copyMsg.classList.add("success");
    copyMsg.classList.remove("failure");
  } catch (e) {
    copyMsg.innerText = "failed";
    copyMsg.classList.add("failure");
    copyMsg.classList.remove("success");
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    
    copyMsg.classList.remove("active");
    copyMsg.classList.remove("success");
    copyMsg.classList.remove("failure");
  }, 2000);

  
}

function shufflePassword(array) {
  //Fisher Yates Method

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
  }
}

//Event Listners
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

/// Generate button Event Listner
generateBtn.addEventListener("click", () => {
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    passwordDisplay.innerText = checkCount;
    handleSlider();
  }

  //main logic

  password = "";

  let funArr = [];
  if (uppercaseCheck.checked) {
    funArr.push(generateUpperCase);
  }

  if (lowercaseCheck.checked) {
    funArr.push(generateLowerCase);
  }

  if (symbolsCheck.checked) {
    funArr.push(generateSymbol);
  }

  if (numbersCheck.checked) {
    funArr.push(generateRandomNumber);
  }

  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randIndex = getRandomInteger(0, funArr.length);

    password += funArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));

  //display password
  passwordDisplay.value = password;

  //calculating strength
  calculateStrength();
});
