const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");

const contactsRouter = require("./routes/api/contacts");
const { authRouter } = require("./routes/api/auth");
const { userRouter } = require("./routes/api/user");
const exp = require("constants");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

//middlewares
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json()); // --> Tells express to work with JSON in body
app.use("/public/avatars", express.static("public/avatars"));

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, path.resolve(__dirname, "tmp"));
//   },
//   filename: function (req, file, callback) {
//     callback(null, Math.random + file.originalname);
//   },
// });

// const upload = multer({
//   storage,
// });

//routes
app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// app.use("/upload", upload.single("avatar"), async (req, res, next) => {
//   console.log("file", req.file);
//   const { filename } = req.file;
//   try {
//     const tmpPath = path.resolve(__dirname, "tmp", filename);
//     const newPath = path.resolve(__dirname, "public/avatars", filename);
//     await fs.rename(tmpPath, newPath);
//     return res.json({
//       ok: true,
//     });
//   } catch (error) {
//     console.error("Error while moving file to avatars directory", error);
//     return res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// });

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
