import express from "express";
import dotenv from "dotenv";
import { connection } from "./config/db.js";

dotenv.config();
const app = express();

connection();
app.use(express.json());

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});

