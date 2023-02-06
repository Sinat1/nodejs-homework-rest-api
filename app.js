const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");
const { authRouter } = require("./routes/api/auth");
const { userRouter } = require("./routes/api/user");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

//middlewares
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json()); // --> Tells express to work with JSON in body

//routes
app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  // Handle mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }
});

app.use((err, req, res, next) => {
  return res.status(500).json({ message: err.message });
});

module.exports = app;
