import express from "express";
import mongoose from "mongoose";
dotenv.config();
import dotenv from "dotenv";

mongoose
    .connect(process.env.Mongo)
    .then(() => {
        console.log("Connected to mongodb");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.listen(4001, () => {
    console.log("server is running on port 4001 !");
});
