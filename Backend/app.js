import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
//import routes
// import error handler
import errorHandler from "./utils/errorHandler.js";
import { responseFormatter } from "./utils/responseFormatter.js";
import userRouter from "./routes/user.route.js";
import channelRouter from "./routes/channel.route.js";
import videoRouter from "./routes/video.route.js"
import shortRouter  from "./routes/short.route.js"

//route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/channel", channelRouter);
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/short", shortRouter )

// Response formatter middleware: wraps all successful JSON responses
app.use(responseFormatter);

// use error handler **after** all routes
app.use(errorHandler);

export { app };
