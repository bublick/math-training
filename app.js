const startBtn = document.querySelector('.start')
const screens = document.querySelectorAll('.screen')
const timeList = document.querySelector('.time-list')
const timeEl = document.querySelector('#time')
const gameWindow = document.querySelector('.game-window')
const gameWindowsGameZone = document.querySelector('.game-window__game-zone')
const fields = document.querySelectorAll('.field')

const checkBtn = document.querySelector('.check')
const eraseBtn = document.querySelector('.erase')
const ctrlBtns = document.querySelectorAll('button.control')

let decreaseTimeInterval;
let score = 0

const operations = ["+", "-", "*", "/"]

/////////////

startBtn.addEventListener('click', (event) => {
    event.preventDefault()
    screens[0].classList.add('up')
})

timeList.addEventListener('click', event => {
    if (event.target.classList.contains('start-btn')){
        time = parseInt( event.target.dataset.time )
        startGame()
    }
})

checkBtn.addEventListener('click', event => checkAnswer(event))
ctrlBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        addDigitToInput( e.target.dataset.btn )
    })
});
document.addEventListener('keydown', event => checkKeydown(event))

eraseBtn.addEventListener('click', event => removeDigitFromInput())

/////////////

function checkKeydown( event ){
    if ( event.keyCode === 48 ){ // 0
        addDigitToInput( 0 )
    } else if ( event.keyCode === 49 ){ // 1
        addDigitToInput( 1 )
    } else if ( event.keyCode === 50 ){ // 2
        addDigitToInput( 2 )
    } else if ( event.keyCode === 51 ){ // 3
        addDigitToInput( 3 )
    } else if ( event.keyCode === 52 ){ // 4
        addDigitToInput( 4 )
    } else if ( event.keyCode === 53 ){ // 5
        addDigitToInput( 5 )
    } else if ( event.keyCode === 54 ){ // 6
        addDigitToInput( 6 )
    } else if ( event.keyCode === 55 ){ // 7
        addDigitToInput( 7 )
    } else if ( event.keyCode === 56 ){ // 8
        addDigitToInput( 8 )
    } else if ( event.keyCode === 57 ){ // 9
        addDigitToInput( 9 )
    } else if ( event.keyCode === 8 ){ // Backspace
        removeDigitFromInput()
    }
}

function startGame(){
    screens[1].classList.add('up')
    createExercise( operations )
    
    setTime(time)
    decreaseTimeInterval = setInterval(decreaseTime, 1000)
}

function decreaseTime(){
    if ( time === 0 ){
        clearInterval(decreaseTimeInterval)
        finishGame()
    } else {
        let current = --time
        if ( current < 10 ){
            current = `0${current}`
        }
        setTime(current)
    }
}

function finishGame(){
    const finishInner = document.createElement('div')
    finishInner.classList.add('game-window__finish-inner')
    
    timeEl.parentNode.classList.add('hide')
    gameWindowsGameZone.classList.add('hide')

    const retryBtn = document.createElement('div')
    retryBtn.classList.add('btn', 'button__retry')
    retryBtn.innerHTML = "Retry"

    gameWindow.append(finishInner)
    finishInner.innerHTML = `<h1>Score: <span class="primary">${score}</span></h1>`
    finishInner.append(retryBtn)

    retryBtn.addEventListener('click', event => {
        finishInner.classList.add('hide')

        score = 0
        screens[1].classList.remove('up')
        timeEl.parentNode.classList.remove('hide')
        gameWindowsGameZone.classList.remove('hide')
    })
}

function setTime(value){
    timeEl.innerHTML = `00:${value}`
}

function addDigitToInput( digit ){
    fields[4].innerHTML += digit
}

function removeDigitFromInput(){
    fields[4].innerHTML = fields[4].innerHTML.slice(0, -1)
}

function createExercise( operations ){
    const operation = operations[getRandomNumber(0, operations.length)]

    if ( operation == '+' ){
        let numb1 = getRandomNumber(1, 50)
        let numb2 = getRandomNumber(1, 50)

        drawExcercise(numb1, numb2, operation)

    } else if (operation == '-'){
        let numb1 = getRandomNumber(1, 50)
        let numb2 = getRandomNumber(1, 50)
        
        if ( numb1 < numb2 ){
            [numb1, numb2] = [numb2, numb1]
            score += 1
        }

        drawExcercise(numb1, numb2, operation)

    } else if (operation == '*'){
        let numb1 = getRandomNumber(1, 10)
        let numb2 = getRandomNumber(1, 10)

        drawExcercise(numb1, numb2, operation)

    } else if (operation == '/'){
        let numb1 = getRandomNumber(1, 10)
        let numb2 = getRandomNumber(1, 10)

        numb1 = numb1 * numb2

        drawExcercise(numb1, numb2, operation)

    }
}

function drawExcercise(n1, n2, op){
    let fields = document.querySelectorAll('.field')
    fields[0].innerHTML = `${n1}`
    fields[1].innerHTML = `${op}`
    fields[2].innerHTML = `${n2}`
    fields[4].innerHTML = ''
}

function checkAnswer(event){
    event.preventDefault()
    
    const numb1 = Number(fields[0].innerHTML.trim())
    const op = String(fields[1].innerHTML.trim())
    const numb2 = Number(fields[2].innerHTML.trim())
    const answ = Number(fields[4].innerHTML.trim())
    if ( op === "+" ){
        if ( numb1 + numb2 == answ ){
            score += 1
            createExercise( operations )
        }

    } else if ( op === "-" ){
        if ( numb1 - numb2 == answ ){
            score += 1
            createExercise( operations )
        } 

    } else if ( op === "*" ){
        if ( numb1 * numb2 == answ ){
            score += 1
            createExercise( operations )
        } 

    } else if ( op === "/" ){
        if ( numb1 / numb2 == answ ){
            score += 1
            createExercise( operations )
        }

    }
}


function getRandomNumber(min, max){
    return Math.round( Math.random() * (max - min) + min )
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}
