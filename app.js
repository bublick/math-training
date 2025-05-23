// DOM Elements
const startBtn = document.querySelector('.start');
const screens = document.querySelectorAll('.screen');
const timeList = document.querySelector('.time-list');
const timeEl = document.querySelector('#time');
const gameWindow = document.querySelector('.game-window');
const gameZone = document.querySelector('.game-window__game-zone');
const fields = document.querySelectorAll('.field');
const checkBtn = document.querySelector('.check');
const eraseBtn = document.querySelector('.erase');
const ctrlBtns = document.querySelectorAll('button.control');

let decreaseTimeInterval;
let score = 0;
let time = 0;

const operations = ["+", "-", "*", "/"];

// Event Listeners
startBtn.addEventListener('click', (event) => {
    event.preventDefault();
    screens[0].classList.add('up');
});

timeList.addEventListener('click', (event) => {
    if (event.target.classList.contains('start-btn')) {
        const selectedTime = event.target.dataset.time;
        if (selectedTime === 'infinite') {
            time = null; // No time limit
            startGame(true);
        } else {
            time = parseInt(selectedTime);
            startGame(false);
        }
    }
});

checkBtn.addEventListener('click', checkAnswer);
ctrlBtns.forEach(btn => btn.addEventListener('click', (e) => addDigitToInput(e.target.dataset.btn)));
eraseBtn.addEventListener('click', removeDigitFromInput);
document.addEventListener('keydown', handleKeydown);

// Functions
function handleKeydown(event) {
    const key = event.key;

    if (!isNaN(key)) {
        // If the key is a number, add it to the input field
        addDigitToInput(key);
    } else if (key === 'Backspace') {
        // If the key is "Backspace", remove the last digit from the input field
        removeDigitFromInput();
    } else if (key === 'Enter') {
        // If the key is "Enter", prevent default behavior and check the answer
        event.preventDefault();
        checkAnswer(event); // Only check the answer, do not reset the timer or create a new interval
    }
}

function startGame(isNoTimeMode) {
    screens[1].classList.add('up'); // Move to the game screen
    createExercise(); // Create the first exercise

    if (isNoTimeMode) {
        time = 0; // Initialize the timer for "No Limit" mode
        timeEl.parentNode.classList.remove('hide'); // Show the timer
        setTime(time); // Set the initial time to 0
        decreaseTimeInterval = setInterval(() => {
            time++; // Increment the timer
            setTime(time); // Update the timer display
        }, 1000);

        // Create the "Finish Game" button
        const finishGameBtn = document.createElement('button');
        finishGameBtn.classList.add('btn', 'finish-game-btn');
        finishGameBtn.textContent = "Finish Game";
        finishGameBtn.addEventListener('click', finishGame);

        // Append the button to the game window
        gameWindow.append(finishGameBtn);
    } else {
        timeEl.parentNode.classList.remove('hide'); // Show the timer
        setTime(time); // Set the initial time
        decreaseTimeInterval = setInterval(decreaseTime, 1000); // Start the timer
    }
}

function decreaseTime() {
    if (time === 0) {
        clearInterval(decreaseTimeInterval);
        finishGame();
    } else {
        time--;
        setTime(time);
    }
}

function finishGame() {
    if (decreaseTimeInterval) {
        clearInterval(decreaseTimeInterval); // Stop the timer if running
    }

    // Remove the "Finish Game" button if it exists
    const finishGameBtn = document.querySelector('.finish-game-btn');
    if (finishGameBtn) {
        finishGameBtn.remove();
    }

    const finishInner = document.createElement('div');
    finishInner.classList.add('game-window__finish-inner');
    finishInner.innerHTML = `
        <h1>Score: <span class="primary">${score}</span></h1>
        <h2>Time: <span class="primary">${formatTime(time)}</span></h2>
    `;

    const retryBtn = document.createElement('div');
    retryBtn.classList.add('btn', 'button__retry');
    retryBtn.textContent = "Retry";
    retryBtn.addEventListener('click', resetGame);

    finishInner.append(retryBtn);
    gameWindow.append(finishInner);

    timeEl.parentNode.classList.add('hide');
    gameZone.classList.add('hide');
}

function resetGame() {
    document.querySelector('.game-window__finish-inner').remove();
    score = 0;
    screens[1].classList.remove('up');
    timeEl.parentNode.classList.remove('hide');
    gameZone.classList.remove('hide');
}

function formatTime(value) {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function setTime(value) {
    timeEl.textContent = formatTime(value);
}

function addDigitToInput(digit) {
    fields[4].textContent += digit;
}

function removeDigitFromInput() {
    fields[4].textContent = fields[4].textContent.slice(0, -1);
}

function createExercise() {
    const operation = operations[getRandomNumber(0, operations.length)];
    let numb1, numb2;

    switch (operation) {
        case '+':
            numb1 = getRandomNumber(1, 50);
            numb2 = getRandomNumber(1, 50);
            break;
        case '-':
            numb1 = getRandomNumber(1, 50);
            numb2 = getRandomNumber(1, 50);
            if (numb1 < numb2) [numb1, numb2] = [numb2, numb1];
            break;
        case '*':
            numb1 = getRandomNumber(1, 10);
            numb2 = getRandomNumber(1, 10);
            break;
        case '/':
            numb2 = getRandomNumber(1, 10);
            numb1 = numb2 * getRandomNumber(1, 10);
            break;
    }

    drawExercise(numb1, numb2, operation);
}

function drawExercise(n1, n2, op) {
    fields[0].textContent = n1;
    fields[1].textContent = op;
    fields[2].textContent = n2;
    fields[4].textContent = '';
}

function checkAnswer(event) {
    event.preventDefault();

    const numb1 = Number(fields[0].textContent.trim());
    const op = fields[1].textContent.trim();
    const numb2 = Number(fields[2].textContent.trim());
    const answ = Number(fields[4].textContent.trim());

    const isCorrect = {
        '+': () => numb1 + numb2 === answ,
        '-': () => numb1 - numb2 === answ,
        '*': () => numb1 * numb2 === answ,
        '/': () => numb1 / numb2 === answ
    }[op]();

    if (isCorrect) {
        score++;
        createExercise();
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
