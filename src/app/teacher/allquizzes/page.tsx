"use client"

import { SignOutButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import {
  Menu,
  X,
  Sun,
  Moon,
  BookOpen,
  PlusCircle,
  Layers,
  History,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Award,
  Edit3,
  Star,
  ExternalLink,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ImageIcon,
  Bug,
  Database,
} from "lucide-react"

const navLinks = [
  { label: "My Quizzes", href: "/teacher/allquizzes", icon: BookOpen, active: true },
  { label: "Create Quiz", href: "/teacher/createquizzes", icon: PlusCircle },
  { label: "Create Subject", href: "/teacher/createsubject", icon: Layers },
  { label: "History", href: "/teacher/history", icon: History },
]

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  bio: string
  subject: string
  experience: string
}

type Question = {
  id: string
  correctOne: string
  options: string[]
  question: string
  questionImg: string | null
}

type QuestionSection = {
  question: Question
}

type Subject = {
  id: string
  name: string
}

type QuizSection = {
  subject: Subject
  questionSection: QuestionSection[]
}

type Quiz = {
  id: string
  title?: string | null
  description?: string | null
  timeLimit?: number | null
  isPublished?: boolean | null
  createdAt: string
  updatedAt: string
  quizsections: QuizSection[]
}

export default function MyQuizzesPage() {
  const { user, isLoaded } = useUser()
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Quiz data states
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])

  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    subject: "",
    experience: "",
  })

  // Update profile data when user loads
  useEffect(() => {
    if (user && isLoaded) {
      setProfileData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      }))
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

  // Extract unique subjects from quizzes
  useEffect(() => {
    if (quizzes.length > 0) {
      const uniqueSubjects = new Map<string, { id: string; name: string }>()

      quizzes.forEach((quiz) => {
        quiz.quizsections.forEach((section) => {
          if (section.subject && section.subject.id) {
            uniqueSubjects.set(section.subject.id, {
              id: section.subject.id,
              name: section.subject.name,
            })
          }
        })
      })

      setSubjects(Array.from(uniqueSubjects.values()))
    }
  }, [quizzes])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleProfile = () => setProfileOpen(!profileOpen)

  const handleProfileSave = async () => {
    try {
      console.log("Saving profile:", profileData)
      setEditProfileOpen(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  // Test connection function
  // const testConnection = async () => {
  //   try {
  //     console.log("🔍 Testing connection...")
  //     const response = await axios.get("/api/test-connection")
  //     setDebugInfo(response.data)
  //     setShowDebugInfo(true)
  //     console.log("✅ Connection test result:", response.data)
  //   } catch (error: any) {
  //     console.error("❌ Connection test failed:", error)
  //     setDebugInfo({
  //       error: true,
  //       message: error.response?.data?.error || error.message,
  //       details: error.response?.data?.details || "Unknown error",
  //     })
  //     setShowDebugInfo(true)
  //   }
  // }

  const fetchQuizzes = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError("")

      console.log("🔍 Fetching quizzes...")
      const res = await axios.get("/api/quiz/teacher/get-my-quizzes")
      console.log("✅ Quiz data received:", res.data)

      setQuizzes(res.data.data || [])
    } catch (err: any) {
      console.error("❌ Error fetching quizzes:", err)

      // Handle different types of errors
      if (err.response?.status === 500) {
        setError("Server error occurred. The API endpoint may have issues. Click 'Debug Connection' to troubleshoot.")
      } else if (err.response?.status === 401) {
        setError("You are not authorized to view this content. Please sign in again.")
      } else if (err.response?.status === 404) {
        setError("Quiz endpoint not found. The API route may not exist.")
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        setError("Network error. Please check your internet connection and try again.")
      } else {
        setError(
          err.response?.data?.error || err.response?.data?.message || "Failed to load quizzes. Please try again.",
        )
      }

      // Log detailed error information
      console.log("Error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user && isLoaded) {
      fetchQuizzes()
    }
  }, [user, isLoaded])

  const handleRefresh = () => {
    fetchQuizzes(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        // TODO: Implement delete functionality when API is ready
        // await axios.delete(`/api/quiz/teacher/delete-quiz/${id}`);
        // fetchQuizzes();
        console.log("Delete quiz:", id)
      } catch (err) {
        console.error("Error deleting quiz:", err)
      }
    }
  }

  const toggleQuizExpansion = (id: string) => {
    setExpandedQuiz(expandedQuiz === id ? null : id)
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      quiz.quizsections.some(
        (section) =>
          section.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.questionSection.some((qSection) =>
            qSection.question.question.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )

    // Filter by subject
    const matchesSubject =
      filterSubject === "all" || quiz.quizsections.some((section) => section.subject.id === filterSubject)

    return matchesSearch && matchesSubject
  })

  // Helper functions
  const getQuizTitle = (quiz: Quiz, index: number) => {
    return quiz.title || `Quiz ${index + 1}`
  }

  const getQuizDescription = (quiz: Quiz) => {
    if (quiz.description) return quiz.description

    const subjectNames = [...new Set(quiz.quizsections.map((s) => s.subject.name))]
    const questionCount = quiz.quizsections.reduce((total, section) => total + section.questionSection.length, 0)

    return `${questionCount} question${questionCount !== 1 ? "s" : ""} on ${subjectNames.join(", ")}`
  }

  const hasImages = (quiz: Quiz) => {
    return quiz.quizsections.some((section) =>
      section.questionSection.some(
        (qSection) =>
          qSection.question.questionImg !== null &&
          qSection.question.questionImg !== undefined &&
          qSection.question.questionImg !== "",
      ),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  const displayName = profileData.firstName || user?.firstName || "Teacher"
  const fullName =
    `${profileData.firstName || user?.firstName || ""} ${profileData.lastName || user?.lastName || ""}`.trim() ||
    "Teacher"

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
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Education Platform</p>
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
                      link.active
                        ? darkMode
                          ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white shadow-lg"
                          : "bg-gradient-to-r from-rose-200 to-orange-200 text-gray-900 shadow-md"
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
                      {profileData.email || "teacher@example.com"}
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
                              <Award className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-500 font-medium">Pro Teacher</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-yellow-400">4.9</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-500">{quizzes.length}</p>
                            <p className="text-xs text-gray-500">Quizzes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-500">
                              {quizzes.reduce(
                                (sum, quiz) =>
                                  sum +
                                  quiz.quizsections.reduce(
                                    (sectionSum, section) => sectionSum + section.questionSection.length,
                                    0,
                                  ),
                                0,
                              )}
                            </p>
                            <p className="text-xs text-gray-500">Questions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-500">{subjects.length}</p>
                            <p className="text-xs text-gray-500">Subjects</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <motion.button
                          onClick={() => {
                            setEditProfileOpen(true)
                            setProfileOpen(false)
                          }}
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
                      link.active
                        ? darkMode
                          ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white"
                          : "bg-gradient-to-r from-rose-200 to-orange-200 text-gray-900"
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

      {/* Debug Info Modal */}
      <AnimatePresence>
        {showDebugInfo && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDebugInfo(false)}
          >
            <motion.div
              className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 ${
                darkMode ? "bg-slate-800" : "bg-white"
              } max-h-[80vh] overflow-y-auto`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Bug className="w-5 h-5" />
                  Debug Information
                </h3>
                <button
                  onClick={() => setShowDebugInfo(false)}
                  className={`p-2 rounded-lg ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? "bg-slate-900" : "bg-gray-100"}`}>
                <pre className="text-sm overflow-x-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1
              className={`text-3xl sm:text-4xl font-bold ${
                darkMode
                  ? "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              }`}
            >
              My Quizzes
            </h1>
            <p className={`text-lg mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Manage and organize your created quizzes
            </p>
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              // onClick={testConnection}
              className={`p-3 rounded-xl shadow-lg transition-all duration-300 ${
                darkMode
                  ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700"
              }`}
              aria-label="Debug connection"
              title="Test API connection"
            >
              <Database className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className={`p-3 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 ${
                darkMode
                  ? "bg-slate-800/50 hover:bg-slate-700/50 text-gray-200"
                  : "bg-white/50 hover:bg-gray-100/50 text-gray-700"
              }`}
              aria-label="Refresh quizzes"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </motion.button>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/teacher/createquizzes"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg font-medium transition-all duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Create Quiz</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search quizzes by subject or question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-rose-500"
              }`}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className={`pl-10 pr-10 py-3 rounded-xl border shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 appearance-none ${
                darkMode
                  ? "bg-slate-800/50 border-slate-600 text-white focus:ring-purple-500"
                  : "bg-white border-gray-200 text-gray-900 focus:ring-rose-500"
              }`}
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div
              className={`rounded-xl shadow-md p-4 flex items-center gap-3 ${
                darkMode ? "bg-slate-800/50" : "bg-white"
              } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
            >
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Quizzes</p>
                <p className="text-xl font-bold">{quizzes.length}</p>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-md p-4 flex items-center gap-3 ${
                darkMode ? "bg-slate-800/50" : "bg-white"
              } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
            >
              <div className="bg-purple-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-xl font-bold">{quizzes.filter((q) => q.isPublished).length}</p>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-md p-4 flex items-center gap-3 ${
                darkMode ? "bg-slate-800/50" : "bg-white"
              } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
            >
              <div className="bg-pink-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-xl font-bold">
                  {quizzes.reduce(
                    (sum, quiz) =>
                      sum +
                      quiz.quizsections.reduce((sectionSum, section) => sectionSum + section.questionSection.length, 0),
                    0,
                  )}
                </p>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-md p-4 flex items-center gap-3 ${
                darkMode ? "bg-slate-800/50" : "bg-white"
              } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">With Images</p>
                <p className="text-xl font-bold">{quizzes.filter((quiz) => hasImages(quiz)).length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`rounded-xl shadow-md p-6 animate-pulse ${
                  darkMode ? "bg-slate-800/50" : "bg-white"
                } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3 w-2/3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="mt-4 flex gap-3">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl shadow-md p-8 text-center ${
              darkMode ? "bg-slate-800/50" : "bg-white"
            } border ${darkMode ? "border-red-500/20" : "border-red-200"}`}
          >
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Failed to Load Quizzes</h3>
            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                // onClick={testConnection}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Bug className="w-4 h-4" />
                Debug Connection
              </button>
              <button
                onClick={handleRefresh}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  darkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-rose-600 hover:bg-rose-700 text-white"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <Link
                href="/teacher/createquizzes"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <Plus className="w-4 h-4" />
                Create New Quiz
              </Link>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredQuizzes.length === 0 && quizzes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl shadow-md p-8 text-center ${
              darkMode ? "bg-slate-800/50" : "bg-white"
            } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
          >
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Quizzes Found</h3>
            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              You haven't created any quizzes yet. Create your first quiz to get started!
            </p>
            <Link
              href="/teacher/createquizzes"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                darkMode
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              Create Your First Quiz
            </Link>
          </motion.div>
        )}

        {/* Quiz List */}
        {!loading && !error && filteredQuizzes.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredQuizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl shadow-md overflow-hidden ${
                    darkMode ? "bg-slate-800/50" : "bg-white"
                  } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
                >
                  {/* Quiz Header */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">{getQuizTitle(quiz, index)}</h2>
                        <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          {getQuizDescription(quiz)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            quiz.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {quiz.isPublished ? "Published" : "Draft"}
                        </span>

                        {hasImages(quiz) && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            Images
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {/* Subject Tags */}
                      {[...new Set(quiz.quizsections.map((s) => s.subject.name))].map((subject, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            darkMode ? "bg-purple-600/20 text-purple-300" : "bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {quiz.timeLimit || quiz.quizsections.length * 2} min
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {quiz.quizsections.reduce((total, section) => total + section.questionSection.length, 0)}{" "}
                          questions
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Created {formatDate(quiz.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Updated {formatDate(quiz.updatedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      <button
                        onClick={() => toggleQuizExpansion(quiz.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          darkMode
                            ? "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        {expandedQuiz === quiz.id ? "Hide Details" : "View Details"}
                      </button>

                      <Link
                        href={`/teacher/edit-quiz/${quiz.id}`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          darkMode
                            ? "bg-slate-600/50 hover:bg-slate-600/70 text-gray-200"
                            : "bg-purple-50 hover:bg-purple-100 text-purple-700"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          darkMode
                            ? "bg-red-900/30 hover:bg-red-900/50 text-red-300"
                            : "bg-red-50 hover:bg-red-100 text-red-700"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded Quiz Details */}
                  <AnimatePresence>
                    {expandedQuiz === quiz.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}
                      >
                        <div className={`p-6 ${darkMode ? "bg-slate-900/50" : "bg-gray-50"}`}>
                          <h3 className="text-lg font-semibold mb-4">Quiz Details</h3>

                          {quiz.quizsections.map((section, sectionIdx) => (
                            <div key={sectionIdx} className="mb-6 last:mb-0">
                              <div className="flex items-center gap-2 mb-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    darkMode ? "bg-purple-600/20 text-purple-300" : "bg-indigo-100 text-indigo-700"
                                  }`}
                                >
                                  {sectionIdx + 1}
                                </div>
                                <h4 className="text-md font-medium">Subject: {section.subject.name}</h4>
                              </div>

                              {section.questionSection.map((qSection, qIdx) => (
                                <div
                                  key={qIdx}
                                  className={`ml-10 rounded-lg border p-4 mb-4 last:mb-0 ${
                                    darkMode ? "bg-slate-800/50 border-slate-600" : "bg-white border-gray-200"
                                  }`}
                                >
                                  <p className="font-medium mb-2">
                                    Q{qIdx + 1}: {qSection.question.question}
                                  </p>

                                  {qSection.question.questionImg && (
                                    <div className="mb-3">
                                      <img
                                        src={qSection.question.questionImg || "/placeholder.svg"}
                                        alt="Question Image"
                                        className="max-h-48 rounded-lg object-contain"
                                      />
                                    </div>
                                  )}

                                  <div className="space-y-2 mt-3">
                                    {qSection.question.options.map((option, optIdx) => (
                                      <div
                                        key={optIdx}
                                        className={`p-2 rounded-lg ${
                                          option === qSection.question.correctOne
                                            ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700"
                                            : darkMode
                                              ? "bg-slate-700/50 border border-slate-600"
                                              : "bg-gray-50 border border-gray-200"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          {option === qSection.question.correctOne && (
                                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                          )}
                                          <span
                                            className={
                                              option === qSection.question.correctOne
                                                ? "text-green-800 dark:text-green-300 font-medium"
                                                : darkMode
                                                  ? "text-gray-200"
                                                  : "text-gray-700"
                                            }
                                          >
                                            {option}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Background Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className={`absolute -top-32 -left-20 w-[300px] h-[300px] rounded-full mix-blend-multiply filter blur-3xl ${
            darkMode ? "bg-indigo-900/30" : "bg-indigo-300/40"
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -bottom-32 -right-20 w-[300px] h-[300px] rounded-full mix-blend-multiply filter blur-3xl ${
            darkMode ? "bg-purple-900/30" : "bg-purple-300/40"
          }`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}
