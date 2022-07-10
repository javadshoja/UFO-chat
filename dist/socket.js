"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid_1 = require("nanoid");
const moment_1 = __importDefault(require("moment"));
const rooms = {};
function socket({ io }) {
    console.log('Sockets enabled');
    io.on('connection', (socket) => {
        console.log(`User connected ${socket.id}`);
        socket.emit('ROOMS', rooms);
        /*
         * When a user creates a new room
         */
        socket.on('CREATE_ROOM', ({ roomName }) => {
            console.log({ roomName });
            //* create a roomId
            const roomId = (0, nanoid_1.nanoid)();
            //* add a new room to the rooms object
            rooms[roomId] = {
                name: roomName,
            };
            socket.join(roomId);
            //* broadcast an event saying there is a new room
            socket.broadcast.emit('ROOMS', rooms);
            //* emit back to the room creator with all the rooms
            socket.emit('ROOMS', rooms);
            //* emit event back the room creator saying they have joined a room
            socket.emit('JOINED_ROOM', roomId);
        });
        //* When a user sends a room message
        socket.on('SEND_ROOM_MESSAGE', ({ roomId, message, username }) => {
            socket.to(roomId).emit('ROOM_MESSAGE', {
                message,
                username,
                time: (0, moment_1.default)().format('LT'),
            });
        });
        //* When a user joins a room
        socket.on('JOIN_ROOM', (roomId) => {
            socket.join(roomId);
            socket.emit('JOINED_ROOM', roomId);
        });
    });
}
exports.default = socket;
