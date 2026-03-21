import express from "express";
import dotenv from "dotenv";
import { connection } from "./config/db.js";
import userRouter from "./common/Routes/userRoutes.js";
import canteenRouter from "./common/Routes/canteenRoutes.js";
import orderRouter from "./common/Routes/orderRoutes.js";
import foodRouter from "./common/Routes/foodRoutes.js";
import invoiceRouter from "./common/Routes/invoiceRoutes.js";
import paymentRouter from "./common/Routes/paymentRoutes.js";

dotenv.config();
const app = express();

connection();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/canteen", canteenRouter);
app.use("/api/order", orderRouter);
app.use("/api/food", foodRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/payment", paymentRouter);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}); 