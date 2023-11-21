import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();
mongoose
    .connect(process.env.Mongo)
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
app.use(express.json());

app.listen(4001, () => {
    console.log("server is running on port 4001 !");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
