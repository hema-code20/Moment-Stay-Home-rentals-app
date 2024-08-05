const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const authRoutes = require("./routes/auth.js");

app.use(cors());
app.use(express.json());
app.use(express.static("profile"));

app.use("/auth", authRoutes);

const PORT = 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "momentstay",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
  })
  .catch((err) => console.log(`${err} Connection failed !!`));
