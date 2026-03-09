const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
 createTask,
 getTasks,
 updateTask,
 deleteTask,
 createAITask
} = require("../controllers/taskController");

router.post("/",auth,createTask);

router.post("/ai",auth,createAITask);

router.get("/",auth,getTasks);

router.put("/:id",auth,updateTask);

router.delete("/:id",auth,deleteTask);

module.exports = router;