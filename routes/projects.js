const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Show all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.render("project", { projects });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Create new project
router.post("/create", async (req, res) => {
  const { name, description, author } = req.body;

  try {
    await Project.create({ name, description, author });
    res.redirect("/projects");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete a project
router.post("/delete/:id", async (req, res) => {
  console.log(`Deleting project with ID: ${req.params.id}`);
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect("/projects");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
