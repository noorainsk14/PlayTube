import express from "express";
import "dotenv/config";
import { app } from "./app.js";
import conntectToDb from "./config/db.cofig.js";

conntectToDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server is runnint at port ", process.env.PORT);
    });
  })
  .catch(() => {
    console.error("MongoDB connection failed !!");
  });
