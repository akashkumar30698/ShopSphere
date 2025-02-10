
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const express = require('express');
const app = express();
const server = createServer(app);


/**
 * 
 * 
 * 
 */
const io = new Server(server, {
  cors: {
    origin: `${process.env.REACT_API_URL}`, // Ensure this matches your React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
});

// Handle socket connections
io.on('connection', (client) => { ///it works with frontend concurrently for example if you do socket.on("connect") in any component of the frontend this function will fire up
  console.log('A user connected');

  client.on('disconnect', () => {
    console.log('User disconnected');
  });
});


module.exports = { io, server, app,express };
