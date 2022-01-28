const { GRID_SIZE } = require('./constants');

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
}

var playeronescore = 0
var playertwoscore = 0

function initGame() {
  const state = createGameState()
  return state
}

function createGameState(){
  return {
      players: [{ 
        pos: {
          x: 8,
          y: 0.5,
        },
        vel: {
          x: 0,
          y: 0,
        },
        score: 0
      }, {
        pos: {
          x: 8,
          y: 18.75
        },
        vel: {
          x: 0,
          y: 0
        },
        score: 0
      }],
      ball: {
        pos: {
          x: 10,
          y: 10
        },
        vel: {
          x: 0,
          y: -0.1
        },
      },
      gridsize: GRID_SIZE,
      active: true
    }
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  const ball = state.ball
  const playerOne = state.players[0];
  const playerTwo = state.players[1];
  playerOne.pos.x += playerOne.vel.x
  //playerOne.vel.x = 0
  playerTwo.pos.x += playerTwo.vel.x
  //playerTwo.vel.x = 0

  ball.pos.y += ball.vel.y
  ball.pos.x += ball.vel.x

  //document.getElementById("playeronescore").innerHTML = playeronescore

  if (playerOne.pos.x <= 0){
    playerOne.pos.x = 0
    //return 0
  }
  
  if (playerOne.pos.x >= GRID_SIZE-4) {
    playerOne.pos.x = GRID_SIZE-4
  }

  if (playerTwo.pos.x <= 0){
    playerTwo.pos.x = 0
    //return 0
  }
  
  if (playerTwo.pos.x >= GRID_SIZE-4) {
    playerTwo.pos.x = GRID_SIZE-4
  }

  if (ball.pos.y < 1.75 && ball.pos.x > playerOne.pos.x && ball.pos.x < playerOne.pos.x + 4) {
    ball.vel.y = -(ball.vel.y)
    ball.vel.x = 0.8 * (playerOne.vel.x)
  }

  if (ball.pos.y > 18.25 && ball.pos.x > playerTwo.pos.x && ball.pos.x < playerTwo.pos.x + 4) {
    ball.vel.y = -(ball.vel.y)
    ball.vel.x = 0.8 * (playerTwo.vel.x)
  }

  if (ball.pos.x <= 0 || ball.pos.x >= GRID_SIZE){
    ball.vel.x = -(ball.vel.x)
  }

  if (ball.pos.y < 0) {
    playerTwo.score += 1
    ball.pos.x = 10
    ball.pos.y = 10
    ball.vel.y = 0.1
    ball.vel.x = 0
    playerOne.pos.x = 8
    playerTwo.pos.x = 8 
    playerOne.vel.x = 0
    playerTwo.vel.x = 0
  } 

  if (ball.pos.y > 20) {
    playerOne.score += 1
    ball.pos.x = 10
    ball.pos.y = 10
    ball.vel.y = -0.1
    ball.vel.x = 0
    playerOne.pos.x = 8
    playerTwo.pos.x = 8 
    playerOne.vel.x = 0
    playerTwo.vel.x = 0
  }
  //return false

}

function getUpdatedVelocity(keyCode) {
  switch (keyCode) {
    case 37: {
      return {x: -0.1, y: 0};
    }
    case 39: {
      return {x: 0.1, y: 0};
    }
  }
}

