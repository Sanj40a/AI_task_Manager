const Task = require("../models/Task");
const { parseTask } = require("../services/aiService");
const { add, setHours, setMinutes, nextMonday } = require("date-fns");

exports.createTask = async(req,res)=>{

 const task = await Task.create({
  ...req.body,
  user:req.user
 });

 res.json(task);
};

exports.getTasks = async(req,res)=>{

 const tasks = await Task.find({user:req.user});

 res.json(tasks);
};

exports.updateTask = async(req,res)=>{

 const task = await Task.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true}
 );

 res.json(task);
};

exports.deleteTask = async(req,res)=>{

 await Task.findByIdAndDelete(req.params.id);

 res.json("Task deleted");
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
    const now = new Date();

    if (parsed.deadline) {
      const deadlineText = parsed.deadline.toLowerCase().trim();

      // today
      if (deadlineText.includes("today")) {
        const timeMatch = deadlineText.match(/(\d{1,2})\s*(:\d{2})?\s*(am|pm)?/);
        let hours = 7, minutes = 0;
        if (timeMatch) {
          hours = parseInt(timeMatch[1]);
          minutes = timeMatch[2] ? parseInt(timeMatch[2].replace(":", "")) : 0;
          if (timeMatch[3] === "pm" && hours < 12) hours += 12;
        }
        deadlineDate = setHours(now, hours);
        deadlineDate = setMinutes(deadlineDate, minutes);
        if (now > deadlineDate) deadlineDate = add(deadlineDate, { days: 1 });
      }

      // tomorrow
      else if (deadlineText.includes("tomorrow")) {
        const timeMatch = deadlineText.match(/(\d{1,2})\s*(:\d{2})?\s*(am|pm)?/);
        let hours = 7, minutes = 0;
        if (timeMatch) {
          hours = parseInt(timeMatch[1]);
          minutes = timeMatch[2] ? parseInt(timeMatch[2].replace(":", "")) : 0;
          if (timeMatch[3] === "pm" && hours < 12) hours += 12;
        }
        deadlineDate = add(now, { days: 1 });
        deadlineDate = setHours(deadlineDate, hours);
        deadlineDate = setMinutes(deadlineDate, minutes);
      }

      // every morning / any time
      else if (deadlineText.includes("every morning") || deadlineText.includes("any time")) {
        deadlineDate = setHours(now, 7);
        deadlineDate = setMinutes(deadlineDate, 0);
        if (now > deadlineDate) deadlineDate = add(deadlineDate, { days: 1 });
      }

      // every Monday
      else if (deadlineText.includes("every monday")) {
        deadlineDate = nextMonday(now);
        deadlineDate = setHours(deadlineDate, 7);
        deadlineDate = setMinutes(deadlineDate, 0);
      }

      // fallback: try Date.parse
      else {
        const parsedDate = Date.parse(parsed.deadline);
        if (!isNaN(parsedDate)) deadlineDate = new Date(parsedDate);
        else deadlineDate = null; // if cannot parse, leave null
      }
    }

    // Create task
    const task = await Task.create({
      title: parsed.title || text, 
      deadline: deadlineDate,
      priority: parsed.priority || "medium",
      user: req.user
    });

    res.json(task);

  } catch (error) {
    console.error("AI TASK ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};