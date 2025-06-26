const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(express.json());
app.use(cors());
app.use("/api", routes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

module.exports = app;
