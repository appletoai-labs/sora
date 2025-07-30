const express = require("express")
const CalendarTask = require("../models/CalendarTask")
const auth = require("../middleware/auth")
const { body, validationResult, param, query } = require("express-validator")

const router = express.Router()

// Validation middleware
const validateTask = [
    body("title").trim().isLength({ min: 1, max: 200 }).withMessage("Title must be between 1 and 200 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description must be less than 1000 characters"),
    body("date")
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Date must be in YYYY-MM-DD format"),
    body("time")
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Time must be in HH:MM format"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
    body("location").optional().trim().isLength({ max: 200 }).withMessage("Location must be less than 200 characters"),
    body("color")
        .optional()
        .matches(/^bg-\w+-\d{3}$/)
        .withMessage("Invalid color format"),
]

// Get all tasks for authenticated user
router.get("/tasks", auth, async (req, res) => {
    try {
        const { startDate, endDate, completed, priority, search, limit = 100, offset = 0 } = req.query

        const query = { userId: req.userId }

        // Date range filter
        if (startDate && endDate) {
            query.date = {
                $gte: startDate,
                $lte: endDate,
            }
        } else if (startDate) {
            query.date = { $gte: startDate }
        } else if (endDate) {
            query.date = { $lte: endDate }
        }

        // Completion filter
        if (completed !== undefined) {
            query.completed = completed === "true"
        }

        // Priority filter
        if (priority) {
            query.priority = priority
        }

        // Search filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ]
        }

        const tasks = await CalendarTask.find(query)
            .sort({ date: 1, time: 1 })
            .limit(Number.parseInt(limit))
            .skip(Number.parseInt(offset))

        const total = await CalendarTask.countDocuments(query)

        res.json({
            tasks,
            total,
            hasMore: Number.parseInt(offset) + tasks.length < total,
        })
    } catch (error) {
        console.error("Get tasks error:", error)
        res.status(500).json({
            message: "Failed to fetch tasks",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        })
    }
})

// Get tasks for specific date
router.get(
    "/tasks/date/:date",
    auth,
    [
        param("date")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("Invalid date format"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { date } = req.params
            const tasks = await CalendarTask.find({
                userId: req.userId,
                date,
            }).sort({ time: 1 })

            res.json(tasks)
        } catch (error) {
            console.error("Get tasks by date error:", error)
            res.status(500).json({ message: "Failed to fetch tasks for date" })
        }
    },
)

// Get upcoming tasks
router.get(
    "/tasks/upcoming",
    auth,
    [query("days").optional().isInt({ min: 1, max: 365 }).withMessage("Days must be between 1 and 365")],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const days = Number.parseInt(req.query.days) || 7
            const tasks = await CalendarTask.getUpcomingTasks(req.userId, days)

            res.json(tasks)
        } catch (error) {
            console.error("Get upcoming tasks error:", error)
            res.status(500).json({ message: "Failed to fetch upcoming tasks" })
        }
    },
)

// Get overdue tasks
router.get("/tasks/overdue", auth, async (req, res) => {
    try {
        const tasks = await CalendarTask.getOverdueTasks(req.userId)
        res.json(tasks)
    } catch (error) {
        console.error("Get overdue tasks error:", error)
        res.status(500).json({ message: "Failed to fetch overdue tasks" })
    }
})

// Create new task
router.post("/tasks", auth, validateTask, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const taskData = {
            ...req.body,
            userId: req.userId,
        }

        const task = new CalendarTask(taskData)
        await task.save()

        res.status(201).json(task)
    } catch (error) {
        console.error("Create task error:", error)
        res.status(500).json({
            message: "Failed to create task",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        })
    }
})

// Get single task
router.get("/tasks/:id", auth, [param("id").isMongoId().withMessage("Invalid task ID")], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const task = await CalendarTask.findOne({
            _id: req.params.id,
            userId: req.userId,
        })

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        res.json(task)
    } catch (error) {
        console.error("Get task error:", error)
        res.status(500).json({ message: "Failed to fetch task" })
    }
})

// Update task
router.put(
    "/tasks/:id",
    auth,
    [param("id").isMongoId().withMessage("Invalid task ID"), ...validateTask],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const task = await CalendarTask.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, {
                new: true,
                runValidators: true,
            })

            if (!task) {
                return res.status(404).json({ message: "Task not found" })
            }

            res.json(task)
        } catch (error) {
            console.error("Update task error:", error)
            res.status(500).json({ message: "Failed to update task" })
        }
    },
)

// Toggle task completion
router.patch("/tasks/:id/toggle", auth, [param("id").isMongoId().withMessage("Invalid task ID")], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const task = await CalendarTask.findOne({
            _id: req.params.id,
            userId: req.userId,
        })

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.completed) {
            await task.markIncomplete()
        } else {
            await task.markCompleted()
        }

        res.json(task)
    } catch (error) {
        console.error("Toggle task error:", error)
        res.status(500).json({ message: "Failed to toggle task completion" })
    }
})

// Delete task
router.delete("/tasks/:id", auth, [param("id").isMongoId().withMessage("Invalid task ID")], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const task = await CalendarTask.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        })

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        res.json({ message: "Task deleted successfully" })
    } catch (error) {
        console.error("Delete task error:", error)
        res.status(500).json({ message: "Failed to delete task" })
    }
})

// Bulk operations
router.post("/tasks/bulk", auth, async (req, res) => {
    try {
        const { action, taskIds } = req.body

        if (!action || !Array.isArray(taskIds) || taskIds.length === 0) {
            return res.status(400).json({ message: "Invalid bulk operation data" })
        }

        let result
        switch (action) {
            case "complete":
                result = await CalendarTask.updateMany(
                    { _id: { $in: taskIds }, userId: req.userId },
                    { completed: true, completedAt: new Date() },
                )
                break
            case "incomplete":
                result = await CalendarTask.updateMany(
                    { _id: { $in: taskIds }, userId: req.userId },
                    { completed: false, completedAt: null },
                )
                break
            case "delete":
                result = await CalendarTask.deleteMany({ _id: { $in: taskIds }, userId: req.userId })
                break
            default:
                return res.status(400).json({ message: "Invalid bulk action" })
        }

        res.json({
            message: `Bulk ${action} completed`,
            modifiedCount: result.modifiedCount || result.deletedCount,
        })
    } catch (error) {
        console.error("Bulk operation error:", error)
        res.status(500).json({ message: "Failed to perform bulk operation" })
    }
})

// Get task statistics
router.get("/stats", auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0]
        const startOfWeek = new Date()
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
        const startOfWeekString = startOfWeek.toISOString().split("T")[0]

        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        const startOfMonthString = startOfMonth.toISOString().split("T")[0]

        const [totalTasks, completedTasks, todayTasks, weekTasks, monthTasks, overdueTasks] = await Promise.all([
            CalendarTask.countDocuments({ userId: req.userId }),
            CalendarTask.countDocuments({ userId: req.userId, completed: true }),
            CalendarTask.countDocuments({ userId: req.userId, date: today }),
            CalendarTask.countDocuments({
                userId: req.userId,
                date: { $gte: startOfWeekString },
            }),
            CalendarTask.countDocuments({
                userId: req.userId,
                date: { $gte: startOfMonthString },
            }),
            CalendarTask.countDocuments({
                userId: req.userId,
                date: { $lt: today },
                completed: false,
            }),
        ])

        const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0

        res.json({
            totalTasks,
            completedTasks,
            todayTasks,
            weekTasks,
            monthTasks,
            overdueTasks,
            completionRate: Number.parseFloat(completionRate),
        })
    } catch (error) {
        console.error("Get stats error:", error)
        res.status(500).json({ message: "Failed to fetch statistics" })
    }
})

module.exports = router
