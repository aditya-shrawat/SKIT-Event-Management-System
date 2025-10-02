import express from 'express';
import http from "http"
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userAuthRoutes from './routes/userAuth.js';
import { fetchUserInfo } from './controllers/userInfo.js';
import { checkTokenAuthentication } from './middleware/authMiddleware.js';
import eventRoutes from './routes/eventRoutes.js'
import searchRoutes from './routes/search.js'
import { Server } from 'socket.io';
import notificationRoutes from './routes/notificationRoutes.js'
import { eventSocketHandler } from './sockets/eventSocketHandler.js';
import homeRoutes from './routes/homeRoutes.js'


dotenv.config();

// database connection
const mongoDB = process.env.MongoDB_URL;
mongoose.connect(mongoDB)
.then(()=>console.log("MongoDB is connected."))
.catch((error)=>console.log(`Error while connecting mongoDB - ${error}`))

const app = express()
const frontend = process.env.Frontend_URL;
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server,{
  cors:{origin:frontend, credentials:true}
});

app.use(cookieParser());
app.use(cors({
    origin: frontend,
    credentials: true,
}));
app.use(express.json());

// socket connection
io.on('connection', (socket) => {
  socket.on('register_user_socket', ({userId })=> {
    socket.join(`user_${userId}`);
  });

  eventSocketHandler(io,socket);

  socket.on('disconnect', ()=>{
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Socket.IO middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});


app.get("/api/user-info",checkTokenAuthentication,fetchUserInfo);
app.use('/user',userAuthRoutes) ;
app.use('/search',searchRoutes);
app.use('/api/home',homeRoutes)
app.use('/api/event',eventRoutes);
app.use('/api/notification',notificationRoutes);



server.listen(PORT,()=>console.log(`Server is running on port ${PORT}...`))
