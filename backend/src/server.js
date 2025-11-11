import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectdb } from './configs/connectdb.js';
import { appRouter } from './routes/index.js';

config();

const app=express();

await connectdb();

app.use(cors());
app.use(express.json());
app.use('/api',appRouter)

app.use(async(req,res)=>{
    res.json({message:"hello from api server"});
})

app.listen(process.env.SERVER_PORT,()=>{console.log(`server running on port ${process.env.SERVER_PORT}`)});
