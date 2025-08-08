"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

interface Thought {
  _id: string
  content: string
  date: string
  userId: string
  createdAt: string
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  thoughts: Thought[]
}

export default function RealLifeMode() {
  const API_BASE = `${import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api`
  const { user } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)
  const [isThoughtModalOpen, setIsThoughtModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Thought form state
  const [thoughtContent, setThoughtContent] = useState("")

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
      const dayThoughts = thoughts.filter((thought) => thought.date === dateString)

      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        thoughts: dayThoughts,
      })
    }

    return days
  }

  // Load thoughts from backend
  const loadThoughts = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE}/calendar/thoughts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setThoughts(data)
        } else if (Array.isArray(data.thoughts)) {
          setThoughts(data.thoughts)
        } else {
          setThoughts([])
        }
      }
    } catch (error) {
      console.error("Error loading thoughts:", error)
      toast.error("Failed to load thoughts")
    } finally {
      setIsLoading(false)
    }
  }

  // Save thought to backend
  const saveThought = async () => {
    if (!user || !selectedDate || !thoughtContent.trim()) {
      toast.error("Please select a date and enter your thought.")
      return
    }

    try {
      setIsLoading(true)
      const thoughtData = {
        content: thoughtContent,
        date: selectedDate.toISOString().split("T")[0],
      }

      const response = await fetch(`${API_BASE}/calendar/thoughts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(thoughtData),
      })

      if (response.ok) {
        const newThought = await response.json()
        setThoughts((prev) => [...prev, newThought])
        toast.success("Thought saved successfully!")
        closeThoughtModal()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save thought")
      }
    } catch (error: any) {
      console.error("Error saving thought:", error)
      toast.error(error.message || "Failed to save thought")
    } finally {
      setIsLoading(false)
    }
  }

  const resetThoughtForm = () => {
    setThoughtContent("")
  }

  const closeThoughtModal = () => {
    setIsThoughtModalOpen(false)
    resetThoughtForm()
  }

  const closeDayModal = () => {
    setIsDayModalOpen(false)
    setSelectedDate(null) // Only clear selectedDate when the day modal is fully closed
  }

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date)
    setIsDayModalOpen(true) // Always open the view modal first
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
    loadThoughts()
  }, [user, currentDate])

  const calendarDays = getCalendarDays()
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const selectedDayThoughts = selectedDate
    ? thoughts.filter((thought) => thought.date === selectedDate.toISOString().split("T")[0])
    : []

  const isSelectedDateToday = selectedDate?.toDateString() === new Date().toDateString()

  return (
    <div className="from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 md:p-6 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-4 sm:mb-6 gap-3 text-center">
          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
            Real Life Mode
          </h1>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={goToToday}
              className="bg-gradient-to-r from-teal-600 to-teal-700 border-teal-500 text-white hover:from-teal-700 hover:to-teal-800 text-sm sm:text-base px-3 sm:px-4 py-2 shadow-lg"
            >
              Today
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("prev")}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-9 w-9 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <h1 className="text-lg sm:text-2xl font-bold text-white min-w-[140px] sm:min-w-[200px] text-center bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                {monthYear}
              </h1>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth("next")}
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 h-9 w-9 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>



        {/* Calendar Grid */}
        <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-600/50 overflow-hidden shadow-2xl flex-grow">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-slate-600/50 bg-gradient-to-r from-slate-700 to-slate-800 flex-shrink-0">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div
                  key={day}
                  className="p-3 sm:p-4 text-center text-xs sm:text-sm font-semibold text-slate-300 border-r border-slate-600/50 last:border-r-0"
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 flex-grow">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-[70px] sm:min-h-[100px] md:min-h-[120px] p-2 sm:p-3 border-r border-b border-slate-600/30 last:border-r-0 cursor-pointer hover:bg-slate-700/30 transition-all duration-200 relative group flex flex-col",
                    !day.isCurrentMonth && "bg-slate-800/50 text-slate-500",
                    day.isToday && "bg-gradient-to-br from-blue-900/40 to-teal-900/40 ring-2 ring-teal-500/30",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  {/* Date number */}
                  <div className="flex items-center justify-between mb-1 sm:mb-2 flex-shrink-0">
                    <span
                      className={cn(
                        "text-sm sm:text-base font-semibold transition-all",
                        day.isToday &&
                        "bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm shadow-lg",
                        !day.isCurrentMonth && "text-slate-500",
                        day.isCurrentMonth && !day.isToday && "text-slate-200 group-hover:text-white",
                      )}
                    >
                      {day.date.getDate()}
                    </span>

                    {/* Single dot indicator if any thoughts */}
                    {day.thoughts.length > 0 && (
                      <div className="w-3 h-3 rounded-full bg-teal-500 shadow-md animate-pulse" />
                    )}
                  </div>

                  {/* Empty div to maintain layout consistency */}
                  <div className="flex-grow overflow-hidden" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day Thoughts Modal (View Only) */}
        <Dialog open={isDayModalOpen} onOpenChange={closeDayModal}>
          <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-slate-200 max-w-md w-[95vw] sm:w-full mx-auto max-h-[85vh] overflow-hidden flex flex-col fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-xl">
            <DialogHeader className="flex-shrink-0 border-b border-slate-600/50 pb-4">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Thoughts for{" "}
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto py-4 px-1">
              {selectedDayThoughts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-slate-400 mb-6 text-lg">No thoughts recorded for this day.</div>
                  {isSelectedDateToday && (
                    <Button
                      onClick={() => {
                        setIsDayModalOpen(false) // Close day modal
                        setIsThoughtModalOpen(true) // Open thought modal
                      }}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg px-6 py-3"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Today's Thought
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDayThoughts.map((thought) => (
                    <div
                      key={thought._id}
                      className="p-4 rounded-xl border border-white/10 backdrop-blur-sm shadow-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50"
                    >
                      <p className="text-base text-white/90">{thought.content}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Recorded: {new Date(thought.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                  {isSelectedDateToday && (
                    <Button
                      onClick={() => {
                        setIsDayModalOpen(false) // Close day modal
                        setIsThoughtModalOpen(true) // Open thought modal
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white mt-6 py-3 shadow-lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Another Thought
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Thought Creation Modal (Only for Current Date) */}
        <Dialog open={isThoughtModalOpen} onOpenChange={closeThoughtModal}>
          <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-slate-200 max-w-md w-[95vw] sm:w-full mx-auto max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-xl">
            <DialogHeader className="border-b border-slate-600/50 pb-4">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Add Thought for{" "}
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-6">
              <div>
                <label className="text-sm font-semibold text-slate-300 mb-3 block">Your Thought *</label>
                <Textarea
                  placeholder="Write down what's on your mind..."
                  value={thoughtContent}
                  onChange={(e) => setThoughtContent(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-slate-200 min-h-[120px] resize-none focus:border-teal-500 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  onClick={closeThoughtModal}
                  variant="outline"
                  className="flex-1 bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveThought}
                  disabled={!thoughtContent.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 shadow-lg"
                >
                  {isLoading ? "Saving..." : "Save Thought"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
