import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from "dotenv";
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import dashRoutes from './routes/dashboard.js';
import chatRoutes from './routes/chat.js';
import { Server } from 'socket.io';
import {createServer} from 'http';

const app = express();
const server = createServer(app);
app.use(cors());

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashRoutes);
app.use('/Chat', chatRoutes);

const CONNECTION_URL = "mongodb+srv://huadmin:liberalcore@cluster0.fmycgav.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5001;

//replace with env variables before deploying
mongoose.connect(CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
            const io = new Server(server);

            app.use((req, res, next) => {
                req.app.io = io;
                next();
            });

            // Move the Socket.IO event handling to this location
            io.on('connection', (socket) => {
              console.log('New client connected');
            
              // Add the 'join_room' event listener here
              socket.on('join_room', (data) => {
                const { chatId } = data;
                socket.join(chatId);
              });
            
              socket.on('disconnect', () => {
                console.log('Client disconnected');
              });
            });
        });
    })
    .catch((error) => console.log(error.message));