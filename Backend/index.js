import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userAuthRoutes from './routes/userAuth.js';
import { fetchUserInfo } from './controllers/userInfo.js';
import { checkTokenAuthentication } from './middleware/authMiddleware.js';


dotenv.config();

const mongoDB = process.env.MongoDB_URL;
mongoose.connect(mongoDB)
.then(()=>console.log("MongoDB is connected."))
.catch((error)=>console.log(`Error while connecting mongoDB - ${error}`))

const app = express()
const frontend = process.env.Frontend_URL;

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({
    origin: frontend,
    credentials: true,
}));

app.use(express.json());



app.get("/api/user-info",checkTokenAuthentication,fetchUserInfo);
app.use('/user',userAuthRoutes) ;



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
