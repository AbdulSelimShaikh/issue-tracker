const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Issue = require("../models/Issue");

// Get issues for a project with optional search

router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const searchQuery = req.query.search || ""; // Get search query if provided

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    let issuesQuery = { project: projectId };
    if (searchQuery) {
      issuesQuery.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const issues = await Issue.find(issuesQuery);
    res.render("issue", { project, issues, searchQuery });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Render form to create a new issue
router.get("/new/:projectId", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.render("createIssue", { project });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).send("Server error");
  }
});

// Create new issue
router.post("/create", async (req, res) => {
  const { title, description, labels, author, project } = req.body;
  try {
    await Issue.create({
      title,
      description,
      labels: labels.split(",").map((label) => label.trim()),
      author,
      project,
    });
    res.redirect(`/issues/${project}`);
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
