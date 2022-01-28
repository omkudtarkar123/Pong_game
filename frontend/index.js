const BG_COLOUR = '#231f20'
const PLAYER1_COLOUR = '#FF0000'
const FOOD_COLOUR = 'e66916'
const PLAYER2_COLOUR = '#0000FF'
const BALL_COLOUR = '#FFFFFF'

//const socket = io('http://localhost:3000')
const socket = io('https://sleepy-island-33889.herokuapp.com/');
//const socket = io('https://sheltered-shore-62334.herokuapp.com/')

/*import { io } from "socket.io-client";
const socket = io('https://sheltered-shore-62334.herokuapp.com/', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});*/

socket.on('init', handleInit);
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)
socket.on('gameCode', handleGameCode)
socket.on('unknownCode', handleUnknownCode)
socket.on('tooManyPlayers', handleTooManyPlayers)

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen')
const newGameBtn = document.getElementById('newGameButton')
const joinGameBtn = document.getElementById('joinGameButton')
const gameCodeInput = document.getElementById('gameCodeInput')
const gameCodeDisplay = document.getElementById('gameCodeDisplay')
const score1Display = document.getElementById('score1Display')
const score2Display = document.getElementById('score2Display')

playeronescore = 0
playertwoscore = 0

newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)

function newGame() {
  socket.emit('newGame')
  init()
}

function joinGame() {
  const code = gameCodeInput.value
  socket.emit('joinGame', code)
  init()
}

let canvas, ctx;
let playerNumber
let gameActive = false

//const socket = io('https://sleepy-island-33889.herokuapp.com/');


function init() {
  initialScreen.style.display = 'none'
  gameScreen.style.display = 'block'

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0,0,canvas.width, canvas.height)
  document.addEventListener('keydown', keydown);
  gameActive = true

}

function keydown(e) {
  //console.log(e.keyCode)
  socket.emit('keydown', e.keyCode)
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR
  ctx.fillRect(0,0,canvas.width, canvas.height)

  const gridsize = state.gridsize
  const size = canvas.width/gridsize

  ctx.fillStyle = BALL_COLOUR
  ctx.beginPath()
  ctx.ellipse(state.ball.pos.x * size, state.ball.pos.y * size, 10, 10, Math.PI *2, 0, Math.PI * 2)
  ctx.fill()

  paintPlayer(state.players[0], size, PLAYER1_COLOUR)
  paintPlayer(state.players[1], size, PLAYER2_COLOUR)

  playeronescore = state.players[0].score
  playertwoscore = state.players[1].score

  console.log(playeronescore, playertwoscore)

}

function paintPlayer(playerState, size, colour) {
  ctx.fillStyle = colour
  ctx.fillRect(playerState.pos.x * size, playerState.pos.y * size, size*4, size*0.75);
}

function handleInit(number) {
  playerNumber = number
}

function handleGameState(gameState) {
  if (!gameActive){
    return
  }
  gameState = JSON.parse(gameState)
  requestAnimationFrame(() => paintGame(gameState))
  handleScore(playeronescore, playertwoscore)
}

function handleGameOver(data) {
  if (!gameActive) {
    return
  }
  data= JSON.parse(data)
  if (data.winner === playerNumber) {
    alert("You win!")
  } else {
    alert("You Lose!")
  }
  gameActive = false

}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode
}

function handleScore(playeronescore, playertwoscore) {
  score1Display.innerText = playeronescore
  score2Display.innerText = playertwoscore
}

function handleUnknownCode() {
  reset()
  alert("unknown game code")
}

function handleTooManyPlayers() {
  reset()
  alert("This game is already in progress")
}

function reset() {
  playerNumber = null
  gameCodeInput.value = ""
  gameCodeDisplay.innerText = ""
  initialScreen.style.display = "none"
  gameScreen.style.display = "none"
}