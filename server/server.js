const express = require("express");
const db = require("./config/db");
const userRoute = require("./routes/userRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");
const bookingRouter = require("./routes/bookingRoutes");
const reportRouter = require("./routes/reportRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
const bookingController = require("./controller/bookingController");
// socket needed package
const http= require("http");
const { Server }=require("socket.io");
const socketHandler=require("./socket/socketHandler");
require("dotenv").config();

const app = express();
// Enable CORS for localhost:8000
app.use(
  cors({
    origin: "*",
  })
);

db();

app.post(
  "/api/v1/booking/webhook",
  express.raw({ type: "application/json" }),
  bookingController.webhook
);

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  transports: ["websocket"], // Force WebSockets only
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

socketHandler(io);

app.get("/", (req, res) => {
  res.send("Working");
});
app.use(errorMiddleware);
server.listen(process.env.PORT, () => console.log(`Listening on port 8000`));
