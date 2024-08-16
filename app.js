const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const { HttpError } = require("./helpers");
const multer = require("multer");
require("dotenv").config();

const { authRouter, contactsRouter, tasksRouter } = require("./routes/api");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
// app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/tasks", tasksRouter);

app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.message === "Unexpected field" || err.field !== "avatar") {
            next(HttpError(400, "Field must be named -> avatar"));
        }
    }
    console.log(err);

    res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
