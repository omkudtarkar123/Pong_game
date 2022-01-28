//Access-Control-Allow-Origin: 'http://localhost:3000'
/*let express = require("express")
let app = express()
let http = require("http").createServer(app)

const io = require("socket.io")(http, {
  cors: {
    origin: 'https://adoring-hodgkin-d40b8b.netlify.app/',
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});*/

/*import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});

io.set('origins', io.set('origins', 'https://adoring-hodgkin-d40b8b.netlify.app/'));*/

/*import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'https://git.heroku.com/murmuring-sands-48271.git/https://adoring-hodgkin-d40b8b.netlify.app/'
  }
});*/

/*const io = new Server(httpServer, {
  cors: {
    origin: "https://adoring-hodgkin-d40b8b.netlify.app/",
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});*/

/*import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://adoring-hodgkin-d40b8b.netlify.app/",
    // or with an array of origins
    // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
    credentials: true
  }
});*/

const { Server } = require("socket.io");

const io = new Server({
  serveClient: false
});

const { gameLoop, getUpdatedVelocity, initGame, } = require('./game')
const { FRAME_RATE } = require('./constants')
const { makeid } = require('./utils')

const state = {}
const clientRooms = {}

io.on('connection', client => {

  client.on('keydown', handleKeydown)
  client.on('newGame', handleNewGame)
  client.on('joinGame', handleJoinGame)

  function handleJoinGame(roomName) {
    const room = io.sockets.adapter.rooms.get(roomName);
    
    let numClients = 0;
    if (room) {
        numClients = room.size;
    }

    if (numClients === 0) {
        client.emit('unknownCode');
        return;
    } else if (numClients > 1) {
        client.emit('tooManyPlayers');
        return;
    }


    clientRooms[client.id] = roomName;

    client.join(roomName);
    client.number = 2;
    client.emit('init', 2);

    startGameInterval(roomName);
  }

  function handleNewGame() {
    let roomName = makeid(5)
    clientRooms[client.id] = roomName
    client.emit('gameCode', roomName)

    state[roomName] = initGame()

    client.join(roomName)
    client.number = 1
    client.emit('init', 1)
  }

  function handleKeydown(keyCode) {
    const roomName = clientRooms[client.id]

    if (!roomName) {
      return
    }

    try {
      keyCode = parseInt(keyCode);
    } catch(e) {
      console.error(e)
      return
    }
    
    const vel = getUpdatedVelocity(keyCode)

    if (vel) {
      state[roomName].players[client.number -1].vel = vel
    }
  }
});


function startGameInterval(roomName) {
  const intervalID = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if(!winner){
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, winner)
      state[roomName] = null
      clearInterval(intervalID)
      
    }
  }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
  io.sockets.in(room)
    .emit('gameState', JSON.stringify(gameState))
}

function emitGameOver(room, winner) {
  io.sockets.in(room)
    .emit('gameOver', JSON.stringify({ winner }))
}

io.listen(process.env.PORT || 3000);
