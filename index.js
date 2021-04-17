const mongoose = require('mongoose');
const users = require('./routes/userRoute');
const express = require('express');
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
require("./db");
app.use(express.json());
app.use('/', users);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

