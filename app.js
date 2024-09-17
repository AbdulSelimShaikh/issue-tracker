const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const issuesRouter = require("./routes/issues");
const projectsRouter = require("./routes/projects");

const app = express();

// Connect to MongoDB
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Define root route
app.get("/", (req, res) => {
  res.render("index"); // Ensure you have an 'index.ejs' file in the 'views' folder
});

// Use routers
app.use("/issues", issuesRouter);
app.use("/projects", projectsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
