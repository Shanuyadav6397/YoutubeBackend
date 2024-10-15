import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./config/dbConfig.js";
import cors from "cors";
import { CORS_ORIGIN, PORT } from "./config/serverConfig.js";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded and nested objects
app.use(express.json({ limit: "16kb" }));
// Here public is folder name where we store all the static files
app.use(express.static("public")); // for serving static files
app.use(cookieParser());

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
  server.on("error", (error) => {
    //
    console.log(`Error: ${error}`);
    throw error;
  });
});

// here import routers
import { userRouter } from "./routes/userRoute.js";
import { loginRouter } from "./routes/authRoute.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users", loginRouter);
