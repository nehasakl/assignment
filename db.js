const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Build the connection string
const dbURI = process.env.DB_URl;

// Create the database connection
mongoose
  .connect(dbURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(dbURI);
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ");
    throw err;
  });
