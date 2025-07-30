"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Edit, Trash2, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

interface Task {
  _id: string
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  priority: "low" | "medium" | "high"
  category: "work" | "personal" | "health" | "social" | "other"
  completed: boolean
  userId: string
  createdAt: string
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  tasks: Task[]
}

const CATEGORY_COLORS = {
  work: "bg-blue-600",
  personal: "bg-teal-500",
  health: "bg-green-500",
  social: "bg-purple-500",
  other: "bg-gray-500",
}

export default function RealLifeMode() {
  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    time: "",
    location: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "personal" as "work" | "personal" | "health" | "social" | "other",
  })

  // Get calendar days for current month
  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: CalendarDay[] = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dateString = date.toISOString().split("T")[0]
      const dayTasks = tasks.filter((task) => task.date === dateString)

      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        tasks: dayTasks,
      })
    }

    return days
  }

  // Load tasks from backend
  const loadTasks = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE}/calendar/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setTasks(data)
        } else if (Array.isArray(data.tasks)) {
          setTasks(data.tasks)
        } else {
          setTasks([])
        }
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
      toast.error("Failed to load tasks")
    } finally {
      setIsLoading(false)
    }
  }

  // Save task to backend
  const saveTask = async () => {
    if (!user || !selectedDate || !taskForm.title.trim()) return

    try {
      setIsLoading(true)
      const taskData = {
        ...taskForm,
        date: selectedDate.toISOString().split("T")[0],
        completed: false,
      }

      const url =
        isEditMode && selectedTask ? `${API_BASE}/calendar/tasks/${selectedTask._id}` : `${API_BASE}/calendar/tasks`

      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        const updatedTask = await response.json()

        if (isEditMode) {
          setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
          toast.success("Task updated successfully!")
        } else {
          setTasks((prev) => [...prev, updatedTask])
          toast.success("Task created successfully!")
        }

        closeTaskModal()
      } else {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} task`)
      }
    } catch (error) {
      console.error("Error saving task:", error)
      toast.error(`Failed to ${isEditMode ? "update" : "create"} task`)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE}/calendar/tasks/${taskId}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok) {
        const updatedTask = await response.json()
        setTasks((prev) => prev.map((task) => (task._id === taskId ? updatedTask : task)))
        toast.success(updatedTask.completed ? "Task completed!" : "Task marked as pending")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      toast.error("Failed to update task")
    }
  }

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_BASE}/calendar/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== taskId))
        toast.success("Task deleted!")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    }
  }

  const resetTaskForm = () => {
    setTaskForm({
      title: "",
      description: "",
      time: "",
      location: "",
      priority: "medium",
      category: "personal",
    })
  }

  const closeTaskModal = () => {
    setIsTaskModalOpen(false)
    setIsEditMode(false)
    setSelectedTask(null)
    resetTaskForm()
  }

  const closeDayModal = () => {
    setIsDayModalOpen(false)
    setSelectedDate(null)
  }

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date)
    setIsDayModalOpen(true)
  }

  const handleAddTask = () => {
    setIsEditMode(false)
    setSelectedTask(null)
    resetTaskForm()
    setIsDayModalOpen(false)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsEditMode(true)
    setTaskForm({
      title: task.title,
      description: task.description || "",
      time: task.time || "",
      location: task.location || "",
      priority: task.priority,
      category: task.category,
    })
    setIsDayModalOpen(false)
    setIsTaskModalOpen(true)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  useEffect(() => {
    loadTasks()
  }, [user, currentDate])

  const calendarDays = getCalendarDays()
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const selectedDayTasks = selectedDate
    ? tasks.filter((task) => task.date === selectedDate.toISOString().split("T")[0])
    : []

  return (
    <div className="min-h-screen p-400 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={goToToday}
              className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 text-sm px-3 py-2"
            >
              Today
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("prev")}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h1 className="text-xl sm:text-2xl font-semibold text-slate-200 min-w-[180px] sm:min-w-[200px] text-center">
                {monthYear}
              </h1>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("next")}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <CardContent className="p-0">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-slate-700">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-slate-400 border-r border-slate-700 last:border-r-0"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-[70px] sm:min-h-[90px] md:min-h-[110px] p-1 sm:p-2 border-r border-b border-slate-700 last:border-r-0 cursor-pointer hover:bg-slate-750 transition-colors relative",
                    !day.isCurrentMonth && "bg-slate-850 text-slate-500",
                    day.isToday && "bg-blue-900/20",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  {/* Date number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium",
                        day.isToday &&
                          "bg-blue-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs",
                        !day.isCurrentMonth && "text-slate-500",
                        day.isCurrentMonth && !day.isToday && "text-slate-200",
                      )}
                    >
                      {day.date.getDate()}
                    </span>

                    {/* Task count indicator */}
                    {day.tasks.length > 0 && (
                      <div className="bg-teal-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                        {day.tasks.length}
                      </div>
                    )}
                  </div>

                  {/* Task dots for mobile, task bars for desktop */}
                  <div className="space-y-1">
                    {/* Mobile: Show dots */}
                    <div className="sm:hidden flex flex-wrap gap-1">
                      {day.tasks.slice(0, 6).map((task) => (
                        <div
                          key={task._id}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            CATEGORY_COLORS[task.category] || "bg-gray-500",
                            task.completed && "opacity-50",
                          )}
                        />
                      ))}
                      {day.tasks.length > 6 && <div className="text-xs text-slate-400">+{day.tasks.length - 6}</div>}
                    </div>

                    {/* Desktop: Show task bars */}
                    <div className="hidden sm:block">
                      {day.tasks.slice(0, 3).map((task) => (
                        <div
                          key={task._id}
                          className={cn(
                            "text-xs px-2 py-1 rounded text-white truncate",
                            CATEGORY_COLORS[task.category] || "bg-gray-500",
                            task.completed && "opacity-60 line-through",
                          )}
                        >
                          {task.time && <span className="mr-1">{task.time}</span>}
                          {task.title}
                          {task.priority === "high" && <AlertCircle className="inline h-3 w-3 ml-1 text-red-300" />}
                        </div>
                      ))}

                      {day.tasks.length > 3 && (
                        <div className="text-xs text-slate-400 px-2">+{day.tasks.length - 3} more</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day Tasks Modal */}
        <Dialog open={isDayModalOpen} onOpenChange={closeDayModal}>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-md mx-4 sm:mx-auto max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-teal-400 text-lg">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-4">
              {selectedDayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-4">No tasks for this day</div>
                  <Button onClick={handleAddTask} className="bg-teal-500 hover:bg-teal-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayTasks.map((task) => (
                    <div
                      key={task._id}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        CATEGORY_COLORS[task.category] || "bg-gray-600",
                        task.completed && "opacity-60",
                        "border-slate-600",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={cn("font-medium text-white truncate", task.completed && "line-through")}>
                              {task.title}
                            </h3>
                            {task.priority === "high" && <AlertCircle className="h-4 w-4 text-red-300 flex-shrink-0" />}
                          </div>

                          {task.description && (
                            <p className="text-sm text-slate-200 mb-2 line-clamp-2">{task.description}</p>
                          )}

                          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                            {task.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.time}
                              </div>
                            )}
                            {task.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {task.location}
                              </div>
                            )}
                            <div className="capitalize">{task.category}</div>
                            <div className="capitalize">{task.priority} priority</div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleTaskCompletion(task._id)}
                            className={cn(
                              "h-8 w-8 text-white hover:bg-white/20",
                              task.completed ? "text-green-400" : "text-slate-400",
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTask(task)}
                            className="h-8 w-8 text-white hover:bg-white/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task._id)}
                            className="h-8 w-8 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button onClick={handleAddTask} className="w-full bg-teal-500 hover:bg-teal-600 text-white mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Task
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Task Creation/Edit Modal */}
        <Dialog open={isTaskModalOpen} onOpenChange={closeTaskModal}>
          <DialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-teal-400 text-lg">
                {isEditMode ? "Edit Task" : "Add Task"} for{" "}
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Task Title *</label>
                <Input
                  placeholder="Enter task title..."
                  value={taskForm.title}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
                <Textarea
                  placeholder="Add description..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-slate-200 min-h-[80px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Time
                  </label>
                  <Input
                    type="time"
                    value={taskForm.time}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, time: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        priority: e.target.value as "low" | "medium" | "high",
                      }))
                    }
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
                <select
                  value={taskForm.category}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      category: e.target.value as "work" | "personal" | "health" | "social" | "other",
                    }))
                  }
                  className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 text-sm"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="social">Social</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <Input
                  placeholder="Add location..."
                  value={taskForm.location}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={closeTaskModal}
                  variant="outline"
                  className="flex-1 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveTask}
                  disabled={!taskForm.title.trim() || isLoading}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                >
                  {isLoading
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                      ? "Update Task"
                      : "Create Task"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
