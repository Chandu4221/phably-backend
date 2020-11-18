#!/usr/bin/env node

require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");

var multipart = require('connect-multiparty');
const bodyParser = require("body-parser");
const cors = require("cors");
const debug = require("debug")("backendcode:server");
const http = require("http");
const app = express();

const { MongoManager } = require("./db");


const indexRouter = require("./routes/index");

var swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
swaggerDocument = require("./swagger.json");


require("./globalFunctions");


const mongoManager = new MongoManager({
  useNewUrlParser: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoManager.connect();




app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multipart());



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", indexRouter);
app.use("*", function (req, res) {
  res.json({ success: false, message: "Invalid route!" });
});






module.exports = app;