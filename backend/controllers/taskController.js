const Task = require("../models/Task");
const User = require("../models/User");
const { parseTask } = require("../services/aiService");
const chrono = require("chrono-node");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendTaskEmail = async (task, user) => {
  try {
    await transporter.sendMail({
      from: `"Task Manager App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "New Task Added 📌",
      text: `Hi ${user.name},

A new task has been added:

Title: ${task.title}
Priority: ${task.priority}
Deadline: ${task.deadline ? task.deadline.toLocaleString() : "No deadline"}

Regards,
Task Manager App`,
    });
    console.log(`Email sent to ${user.email}`);
  } catch (err) {
    console.error("EMAIL ERROR:", err);
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user,
    });

    // Fetch full user object
    const user = await User.findById(req.user);

    await sendTaskEmail(task, user);

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

exports.createAITask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const aiResult = await parseTask(text);
    const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI response");

    const parsed = JSON.parse(jsonMatch[0]);
    let deadlineDate = null;
    if (parsed.deadline) {
      const parsedDate = chrono.parseDate(parsed.deadline);
      if (parsedDate) deadlineDate = parsedDate;
    }

    const task = await Task.create({
      title: parsed.title || text,
      deadline: deadlineDate,
      priority: parsed.priority || "medium",
      user: req.user,
    });

    // Fetch full user object
    const user = await User.findById(req.user);

    await sendTaskEmail(task, user);

    res.json(task);
  } catch (error) {
    console.error("AI TASK ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json("Task deleted");
};