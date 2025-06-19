"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"
import {
  User,
  BookOpen,
  CheckCircle,
  Send,
  Clock,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Edit3,
  Star,
  ExternalLink,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Award,
  Eye,
  FileText,
  RefreshCw,
  TrendingUp,
  Percent,
  ArrowLeft,
  XCircle,
  Timer,
  Calendar,
  BarChart2,
  Share2,
  Download,
  Printer,
} from "lucide-react"

// Navigation links for the student dashboard
const navLinks = [
  { label: "Get Quizzes", href: "/student/getquizzes", icon: BookOpen },
  { label: "My Attempted Quizzes", href: "/student/attemptedquiz", icon: CheckCircle },
  { label: "Submit Quiz", href: "/student/submit-quiz", icon: Send },
  { label: "Eligible to Attempt", href: "/student/eligible-to-attempt", icon: Clock },
]

interface ProfileData {
  firstName: string
  lastName: string
  email: string
}

interface MockQuiz {
  id: string
  name: string
  number: number
}

interface StudentAnswer {
  id: string
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number
  question: string
  options: string[]
  correctAnswer: string
}

interface QuizAttempt {
  id: string
  completedAt: string
  correctAnswers: number
  mockQuiz: MockQuiz
  mockQuizId: string
  score: number
  status: "PASSED" | "FAILED"
  totalQuestions: number
  wrongAnswers: number
  studentAnswers?: StudentAnswer[]
}

interface ListApiResponse {
  message: string
  data: QuizAttempt[]
}

interface DetailApiResponse {
  message: string
  data: QuizAttempt
}

export default function AttemptedQuizzesPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // State for list view
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [filteredAttempts, setFilteredAttempts] = useState<QuizAttempt[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "score" | "name">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState<"all" | "passed" | "failed">("all")

  // State for detail view
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null)
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
  })

  // Update profile data when user loads
  useEffect(() => {
    if (user && isLoaded) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      })
    }
  }, [user, isLoaded])

  // Handle initial theme based on user preference
  useEffect(() => {
    setMounted(true)
    const isDark =
      localStorage.getItem("darkMode") === "true" ||
      (!("darkMode" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setDarkMode(isDark)
  }, [])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch attempted quizzes
  useEffect(() => {
    const fetchAttemptedQuizzes = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/quiz/student/my-attempted-quizzes")

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch attempted quizzes")
        }

        const data: ListApiResponse = await response.json()
        setAttempts(data.data)
        setFilteredAttempts(data.data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch attempted quizzes. Please try again.")
        setLoading(false)
      }
    }

    if (isLoaded && user) {
      fetchAttemptedQuizzes()
    }
  }, [isLoaded, user])

  // Filter and sort attempts
  useEffect(() => {
    let filtered = [...attempts]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (attempt) =>
          attempt.mockQuiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attempt.mockQuiz.number.toString().includes(searchTerm),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((attempt) =>
        statusFilter === "passed" ? attempt.status === "PASSED" : attempt.status === "FAILED",
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          break
        case "score":
          comparison = b.score - a.score
          break
        case "name":
          comparison = a.mockQuiz.name.localeCompare(b.mockQuiz.name)
          break
      }

      return sortOrder === "asc" ? -comparison : comparison
    })

    setFilteredAttempts(filtered)
  }, [attempts, searchTerm, sortBy, sortOrder, statusFilter])

  // Fetch attempt details when an attempt is selected
  useEffect(() => {
    const fetchAttemptDetails = async (id: string) => {
      try {
        setDetailLoading(true)
        setDetailError(null)

        const response = await fetch(`/api/quiz/student/my-attempted-quizzes/S${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch attempt details")
        }

        const data: DetailApiResponse = await response.json()
        setSelectedAttempt(data.data)
        setDetailLoading(false)
      } catch (err) {
        setDetailError(err instanceof Error ? err.message : "Failed to fetch attempt details. Please try again.")
        setDetailLoading(false)
      }
    }

    if (selectedAttemptId) {
      fetchAttemptDetails(selectedAttemptId)
    } else {
      setSelectedAttempt(null)
    }
  }, [selectedAttemptId])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleProfile = () => setProfileOpen(!profileOpen)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} sec`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Only render UI after mounted to avoid hydration issues
  if (!mounted || !isLoaded) return null

  const displayName = profileData.firstName || user?.firstName || "Student"
  const fullName =
    `${profileData.firstName || user?.firstName || ""} ${profileData.lastName || user?.lastName || ""}`.trim() ||
    "Student"

  // Calculate statistics
  const totalAttempts = attempts.length
  const passedAttempts = attempts.filter((a) => a.status === "PASSED").length
  const averageScore =
    attempts.length > 0 ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0
  const highestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
          : "bg-gradient-to-br from-rose-50 via-teal-50 to-violet-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="py-4 sticky top-0 z-50 border-b border-white/20">
        <div
          className={`absolute inset-0 ${darkMode ? "bg-slate-900/70" : "bg-white/70"} backdrop-blur-xl -z-10`}
        ></div>

        <div className="container px-4 mx-auto">
          <div
            className={`flex justify-between items-center rounded-2xl max-w-7xl mx-auto relative p-4 shadow-2xl backdrop-blur-xl border ${
              darkMode
                ? "bg-gradient-to-r from-slate-800/80 to-purple-800/80 border-purple-500/30"
                : "bg-gradient-to-r from-white/80 to-rose-50/80 border-rose-200/50"
            }`}
          >
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-br from-purple-600 to-pink-600"
                    : "bg-gradient-to-br from-rose-500 to-orange-500"
                }`}
              >
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Brahmastra
                </h1>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-2 flex-1 max-w-2xl mx-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-300 group ${
                      link.href === "/student/attempted"
                        ? darkMode
                          ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white shadow-lg"
                          : "bg-gradient-to-r from-rose-100 to-orange-100 text-gray-900 shadow-md"
                        : darkMode
                          ? "hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 text-gray-200 hover:text-white hover:shadow-lg"
                          : "hover:bg-gradient-to-r hover:from-rose-100 hover:to-orange-100 text-gray-700 hover:text-gray-900 hover:shadow-md"
                    }`}
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={`p-3 rounded-xl shadow-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 hover:from-yellow-500/30 hover:to-orange-500/30"
                    : "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 hover:from-indigo-200 hover:to-purple-200"
                }`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? "dark" : "light"}
                    initial={{ y: -20, opacity: 0, rotate: -180 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <motion.button
                  onClick={toggleProfile}
                  className={`flex items-center gap-2 p-2 rounded-xl shadow-lg transition-all duration-300 ${
                    darkMode
                      ? "bg-gradient-to-r from-slate-700/80 to-purple-700/80 hover:from-slate-600/80 hover:to-purple-600/80"
                      : "bg-gradient-to-r from-white to-rose-50 hover:from-rose-50 hover:to-orange-50 border border-rose-200/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      darkMode
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : "bg-gradient-to-br from-rose-400 to-orange-400"
                    }`}
                  >
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {profileData.email || "student@example.com"}
                    </p>
                  </div>
                  <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${
                        darkMode ? "bg-slate-800/90 border-purple-500/30" : "bg-white/90 border-rose-200/50"
                      }`}
                    >
                      {/* Profile Header */}
                      <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                              darkMode
                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                : "bg-gradient-to-br from-rose-400 to-orange-400"
                            }`}
                          >
                            {user?.imageUrl ? (
                              <img
                                src={user.imageUrl || "/placeholder.svg"}
                                alt="Profile"
                                className="w-full h-full rounded-xl object-cover"
                              />
                            ) : (
                              <User className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{fullName}</h3>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {profileData.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-500 font-medium">Top Performer</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-yellow-400">Rank #12</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-500">{totalAttempts}</p>
                            <p className="text-xs text-gray-500">Completed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-500">{averageScore}%</p>
                            <p className="text-xs text-gray-500">Avg Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-500">#12</p>
                            <p className="text-xs text-gray-500">Rank</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <motion.button
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            darkMode ? "hover:bg-slate-700/50 text-gray-200" : "hover:bg-gray-100 text-gray-700"
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Edit3 className="w-5 h-5" />
                          <div className="text-left">
                            <p className="font-medium">Edit Profile</p>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Update your personal information
                            </p>
                          </div>
                        </motion.button>

                        <motion.button
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            darkMode ? "hover:bg-slate-700/50 text-gray-200" : "hover:bg-gray-100 text-gray-700"
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Settings className="w-5 h-5" />
                          <div className="text-left flex-1">
                            <p className="font-medium">Settings</p>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Customize your preferences
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </motion.button>

                        <motion.button
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            darkMode ? "hover:bg-slate-700/50 text-gray-200" : "hover:bg-gray-100 text-gray-700"
                          }`}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <HelpCircle className="w-5 h-5" />
                          <div className="text-left flex-1">
                            <p className="font-medium">Get Help</p>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Support and documentation
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 opacity-50" />
                        </motion.button>

                        <div className={`my-2 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}></div>

                        <SignOutButton>
                          <motion.button
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                              darkMode
                                ? "hover:bg-red-900/30 text-red-300 hover:text-red-200"
                                : "hover:bg-red-50 text-red-600 hover:text-red-700"
                            }`}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <LogOut className="w-5 h-5" />
                            <div className="text-left">
                              <p className="font-medium">Sign Out</p>
                              <p className={`text-xs ${darkMode ? "text-red-400" : "text-red-500"}`}>
                                Sign out of your account
                              </p>
                            </div>
                          </motion.button>
                        </SignOutButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={toggleMenu}
                className={`lg:hidden p-3 rounded-xl shadow-lg ${
                  darkMode
                    ? "bg-gradient-to-r from-slate-700/80 to-purple-700/80"
                    : "bg-gradient-to-r from-white to-rose-50 border border-rose-200/50"
                }`}
                whileTap={{ scale: 0.9 }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={`lg:hidden mx-4 mt-2 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl border ${
              darkMode ? "bg-slate-800/90 border-purple-500/30" : "bg-white/90 border-rose-200/50"
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="p-4 flex flex-col gap-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                      link.href === "/student/attempted"
                        ? darkMode
                          ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white"
                          : "bg-gradient-to-r from-rose-100 to-orange-100 text-gray-900"
                        : darkMode
                          ? "hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 text-gray-200"
                          : "hover:bg-gradient-to-r hover:from-rose-100 hover:to-orange-100 text-gray-700"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedAttemptId ? (
            // QUIZ ATTEMPT DETAILS VIEW
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                <button
                  onClick={() => setSelectedAttemptId(null)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Attempts
                </button>
              </motion.div>

              {/* Loading State */}
              {detailLoading && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
                    <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading quiz details...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {detailError && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className={`text-lg mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{detailError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Quiz Attempt Details */}
              {!detailLoading && !detailError && selectedAttempt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Quiz Header */}
                  <div
                    className={`rounded-2xl p-6 shadow-lg backdrop-blur-xl border mb-8 ${darkMode ? "bg-slate-800/50 border-purple-500/20" : "bg-white/80 border-rose-200/50"}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${
                              selectedAttempt.status === "PASSED"
                                ? darkMode
                                  ? "bg-green-900/50 text-green-300"
                                  : "bg-green-100 text-green-700"
                                : darkMode
                                  ? "bg-amber-900/50 text-amber-300"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {selectedAttempt.status}
                          </span>
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${darkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"}`}
                          >
                            Quiz #{selectedAttempt.mockQuiz.number}
                          </span>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{selectedAttempt.mockQuiz.name}</h1>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 opacity-70" />
                            <span>{formatDate(selectedAttempt.completedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4 opacity-70" />
                            <span>{selectedAttempt.totalQuestions} Questions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div
                          className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            selectedAttempt.status === "PASSED"
                              ? darkMode
                                ? "bg-gradient-to-br from-green-600 to-emerald-600"
                                : "bg-gradient-to-br from-green-500 to-emerald-500"
                              : darkMode
                                ? "bg-gradient-to-br from-amber-600 to-orange-600"
                                : "bg-gradient-to-br from-amber-500 to-orange-500"
                          }`}
                        >
                          <div className="text-center">
                            <p className="text-3xl font-bold text-white">{selectedAttempt.score}%</p>
                            <p className="text-xs text-white/80">Score</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className={`p-4 rounded-xl ${darkMode ? "bg-green-900/30" : "bg-green-100"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-green-800" : "bg-green-200"}`}>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Correct</p>
                            <p className="text-xl font-bold">{selectedAttempt.correctAnswers}</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-red-800" : "bg-red-200"}`}>
                            <XCircle className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Incorrect</p>
                            <p className="text-xl font-bold">{selectedAttempt.wrongAnswers}</p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-800" : "bg-blue-200"}`}>
                            <Award className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Accuracy</p>
                            <p className="text-xl font-bold">
                              {selectedAttempt.totalQuestions > 0
                                ? Math.round((selectedAttempt.correctAnswers / selectedAttempt.totalQuestions) * 100)
                                : 0}
                              %
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl ${darkMode ? "bg-purple-900/30" : "bg-purple-100"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-purple-800" : "bg-purple-200"}`}>
                            <Timer className="w-5 h-5 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Avg. Time</p>
                            <p className="text-xl font-bold">
                              {selectedAttempt.studentAnswers && selectedAttempt.studentAnswers.length > 0
                                ? formatTimeSpent(
                                    Math.round(
                                      selectedAttempt.studentAnswers.reduce((sum, a) => sum + a.timeSpent, 0) /
                                        selectedAttempt.studentAnswers.length,
                                    ),
                                  )
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          darkMode
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        <Share2 className="w-4 h-4" />
                        Share Results
                      </button>
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          darkMode
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          darkMode
                            ? "bg-slate-700 hover:bg-slate-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          darkMode
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        }`}
                      >
                        <BarChart2 className="w-4 h-4" />
                        View Analytics
                      </button>
                    </div>
                  </div>

                  {/* Questions and Answers */}
                  {selectedAttempt.studentAnswers && (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                      <h2 className="text-2xl font-bold mb-4">Questions & Answers</h2>

                      {selectedAttempt.studentAnswers.map((answer, index) => (
                        <motion.div
                          key={answer.id}
                          variants={itemVariants}
                          className={`rounded-2xl p-6 shadow-lg border ${
                            answer.isCorrect
                              ? darkMode
                                ? "bg-green-900/20 border-green-500/30"
                                : "bg-green-50 border-green-200"
                              : darkMode
                                ? "bg-red-900/20 border-red-500/30"
                                : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <span
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    darkMode
                                      ? "bg-slate-800 text-white"
                                      : "bg-white text-gray-800 border border-gray-200"
                                  }`}
                                >
                                  {index + 1}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    answer.isCorrect
                                      ? darkMode
                                        ? "bg-green-900/50 text-green-300"
                                        : "bg-green-100 text-green-700"
                                      : darkMode
                                        ? "bg-red-900/50 text-red-300"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {answer.isCorrect ? "Correct" : "Incorrect"}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    darkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {formatTimeSpent(answer.timeSpent)}
                                </span>
                              </div>
                              <h3 className="text-lg font-medium mb-4">{answer.question}</h3>

                              {/* Options */}
                              <div className="space-y-3 mt-4">
                                {answer.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-3 rounded-lg flex items-center gap-3 ${
                                      option === answer.correctAnswer
                                        ? darkMode
                                          ? "bg-green-900/30 border border-green-500/30"
                                          : "bg-green-100 border border-green-200"
                                        : option === answer.selectedAnswer && option !== answer.correctAnswer
                                          ? darkMode
                                            ? "bg-red-900/30 border border-red-500/30"
                                            : "bg-red-100 border border-red-200"
                                          : darkMode
                                            ? "bg-slate-800/50 border border-slate-700"
                                            : "bg-white border border-gray-200"
                                    }`}
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                        option === answer.correctAnswer
                                          ? "bg-green-500 text-white"
                                          : option === answer.selectedAnswer && option !== answer.correctAnswer
                                            ? "bg-red-500 text-white"
                                            : darkMode
                                              ? "bg-slate-700 text-white"
                                              : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIndex)}
                                    </div>
                                    <span className="flex-1">{option}</span>
                                    {option === answer.correctAnswer && (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    )}
                                    {option === answer.selectedAnswer && option !== answer.correctAnswer && (
                                      <XCircle className="w-5 h-5 text-red-500" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Explanation (if available) */}
                          {!answer.isCorrect && (
                            <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-slate-800/50" : "bg-gray-50"}`}>
                              <p className="font-medium mb-2">Correct Answer:</p>
                              <p>{answer.correctAnswer}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ) : (
            // QUIZ ATTEMPTS LIST VIEW
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <h1
                  className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"}`}
                >
                  My Attempted Quizzes 📝
                </h1>
                <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Review your quiz attempts and track your progress
                </p>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <div
                    className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      darkMode
                        ? "bg-gradient-to-br from-slate-800/80 to-purple-800/80 text-gray-200"
                        : "bg-white text-gray-700"
                    } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-blue-500">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-1">{totalAttempts}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Attempts</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div
                    className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      darkMode
                        ? "bg-gradient-to-br from-slate-800/80 to-purple-800/80 text-gray-200"
                        : "bg-white text-gray-700"
                    } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500`}>
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-1">{passedAttempts}</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Passed Quizzes</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div
                    className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      darkMode
                        ? "bg-gradient-to-br from-slate-800/80 to-purple-800/80 text-gray-200"
                        : "bg-white text-gray-700"
                    } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500`}>
                        <Percent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-purple-500">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-1">{averageScore}%</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Average Score</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div
                    className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                      darkMode
                        ? "bg-gradient-to-br from-slate-800/80 to-purple-800/80 text-gray-200"
                        : "bg-white text-gray-700"
                    } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-orange-500">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-1">{highestScore}%</p>
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Highest Score</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Search and Filter Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl p-6 shadow-lg backdrop-blur-xl border ${darkMode ? "bg-slate-800/50 border-purple-500/20" : "bg-white/80 border-rose-200/50"}`}
              >
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  {/* Search */}
                  <div className="relative flex-1 w-full lg:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${darkMode ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "all" | "passed" | "failed")}
                      className={`pl-10 pr-8 py-3 rounded-xl border transition-colors appearance-none ${darkMode ? "bg-slate-700/50 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    >
                      <option value="all">All Attempts</option>
                      <option value="passed">Passed Only</option>
                      <option value="failed">Failed Only</option>
                    </select>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "date" | "score" | "name")}
                      className={`px-3 py-3 rounded-xl border transition-colors ${darkMode ? "bg-slate-700/50 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    >
                      <option value="date">Date</option>
                      <option value="score">Score</option>
                      <option value="name">Quiz Name</option>
                    </select>

                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className={`p-3 rounded-xl border transition-colors ${darkMode ? "bg-slate-700/50 border-slate-600 hover:bg-slate-600/50" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                    >
                      {sortOrder === "asc" ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Showing {filteredAttempts.length} of {attempts.length} attempts
                  </p>
                </div>
              </motion.div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
                    <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Loading your attempts...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <p className={`text-lg mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* No Results */}
              {!loading && !error && filteredAttempts.length === 0 && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      No quiz attempts found
                    </h3>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
                      {attempts.length > 0
                        ? "Try adjusting your search or filter criteria"
                        : "You haven't attempted any quizzes yet"}
                    </p>
                    {attempts.length === 0 && (
                      <Link
                        href="/student/quizzes"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                          darkMode
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-purple-500 hover:bg-purple-600 text-white"
                        } transition-colors`}
                      >
                        <BookOpen className="w-4 h-4" />
                        Browse Available Quizzes
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Attempts List */}
              {!loading && !error && filteredAttempts.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-6 mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredAttempts.map((attempt) => (
                    <motion.div key={attempt.id} variants={itemVariants}>
                      <div
                        className={`rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl p-4 border ${
                          darkMode
                            ? "bg-slate-800/50 border-purple-500/20 text-gray-200"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{attempt.mockQuiz.name}</h3>
                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Quiz #{attempt.mockQuiz.number}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              attempt.status === "PASSED"
                                ? darkMode
                                  ? "bg-green-900/50 text-green-300"
                                  : "bg-green-100 text-green-700"
                                : darkMode
                                  ? "bg-amber-900/50 text-amber-300"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {attempt.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 opacity-70" />
                            <span>{attempt.totalQuestions} Questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 opacity-70" />
                            <span>{formatDate(attempt.completedAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">Score: {attempt.score}%</span>
                          </div>
                          <button
                            onClick={() => setSelectedAttemptId(attempt.id)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              darkMode
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "bg-purple-500 hover:bg-purple-600 text-white"
                            }`}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
