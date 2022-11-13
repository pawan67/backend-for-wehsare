const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const connectDB = require("./db/mongoDb");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5050;

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

app.use(cors());
connectDB();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
