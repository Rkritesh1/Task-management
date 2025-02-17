const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Task = require("./models/task"); // Import Task Model

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://employee-management:oDdx7Syse708h8iB@employee.xc9iw.mongodb.net/Task-manager?retryWrites=true&w=majority&appName=employee")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define a GET route for `/tasks`
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Create a task (POST request)
app.post("/tasks", async (req, res) => {
  try {
    const newTask = new Task(req.body);  // Create a new Task from the request body
    await newTask.save();  // Save the task to the database
    res.status(201).json(newTask);  // Return the complete task object (with all fields)
  } catch (err) {
    console.error("Error saving task:", err);  // Log error for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Update a task (PUT request)
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,  // Find the task by ID
      req.body,        // Update the task data
      { new: true }    // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);  // Return the updated task
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Delete a task (DELETE request)
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);  // Find and delete the task by ID

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });  // Return success message
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ✅ Default route
app.get("/", (req, res) => {
  res.send("API is working!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
