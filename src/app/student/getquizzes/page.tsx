"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { SignOutButton, useUser } from "@clerk/nextjs"
import {
  Search,
  Filter,
  Clock,
  User,
  BookOpen,
  Calendar,
  ChevronRight,
  Trophy,
  AlertCircle,
  Loader2,
  RefreshCw,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Edit3,
  Send,
  CheckCircle,
  Star,
  ExternalLink,
} from "lucide-react"

// Navigation links for the student dashboard
const navLinks = [
  { label: "Get Quizzes", href: "/student/getquizzes", icon: BookOpen },
  { label: "My Attempted Quizzes", href: "/student/attemptedquiz", icon: CheckCircle },
  { label: "Submit Quiz", href: "/student/submit-quiz", icon: Send },
  { label: "Eligible to Attempt", href: "/student/eligible-to-attempt", icon: Clock },
]

interface Subject {
  id: string
  imgUrl: string | null
  name: string
}

interface Question {
  id: string
  question: string
  questionImg: string | null
  options: string[]
}

interface QuestionSection {
  id: string
  question: Question[]
}

interface QuizSection {
  subject: Subject
  questionSection: QuestionSection[]
}

interface Teacher {
  id: string
  fullname: string
}

interface Quiz {
  id: string
  endsAt: string
  name: string
  number: number
  teacher: Teacher
  quizsections: QuizSection[]
}

interface ApiResponse {
  message: string
  data: Quiz[]
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
}

export default function GetQuizzes() {
  const { user, isLoaded } = useUser()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "endDate" | "teacher">("endDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [darkMode, setDarkMode] = useState(false)

  // Navbar state
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

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

  // Get unique subjects for filter
  const subjects = Array.from(
    new Set(
      quizzes.flatMap((quiz) => quiz.quizsections?.map((section) => section.subject?.name) || []).filter(Boolean),
    ),
  )

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/quiz/student/get-quizzess")
        const result: ApiResponse = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch quizzes")
        }

        setQuizzes(result.data)
        setFilteredQuizzes(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

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

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleProfile = () => setProfileOpen(!profileOpen)

  // Filter and sort quizzes
  useEffect(() => {
    const filtered = quizzes.filter((quiz) => {
      const matchesSearch =
        quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quiz.teacher?.fullname || "").toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSubject =
        selectedSubject === "all" ||
        quiz.quizsections?.some((section) => section.subject?.name === selectedSubject) ||
        false

      return matchesSearch && matchesSubject
    })

    // Sort quizzes
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "endDate":
          comparison = new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
          break
        case "teacher":
          comparison = (a.teacher?.fullname || "").localeCompare(b.teacher?.fullname || "")
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredQuizzes(filtered)
  }, [quizzes, searchTerm, selectedSubject, sortBy, sortOrder])

  // Calculate time remaining
  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const difference = end - now

    if (difference <= 0) return "Expired"

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  // Get total questions count with proper null checks
  const getTotalQuestions = (quiz: Quiz) => {
    if (!quiz.quizsections || !Array.isArray(quiz.quizsections)) {
      return 0
    }

    return quiz.quizsections.reduce((total, section) => {
      if (!section.questionSection || !Array.isArray(section.questionSection)) {
        return total
      }

      return (
        total +
        section.questionSection.reduce((sectionTotal, qs) => {
          if (!qs.question || !Array.isArray(qs.question)) {
            return sectionTotal
          }

          return sectionTotal + qs.question.length
        }, 0)
      )
    }, 0)
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

  if (loading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : "bg-gradient-to-br from-rose-50 via-teal-50 to-violet-50"}`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
            <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Loading quizzes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" : "bg-gradient-to-br from-rose-50 via-teal-50 to-violet-50"}`}
      >
        <div className="flex items-center justify-center min-h-screen">
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
      </div>
    )
  }

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
                      link.href === "/student/getquizzes"
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
                              <Trophy className="w-4 h-4 text-yellow-500" />
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
                            <p className="text-lg font-bold text-blue-500">32</p>
                            <p className="text-xs text-gray-500">Completed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-500">85%</p>
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
                      link.href === "/student/getquizzes"
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1
            className={`text-4xl sm:text-5xl font-bold mb-4 ${darkMode ? "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent" : "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"}`}
          >
            Available Quizzes 📚
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Discover and attempt quizzes to test your knowledge
          </p>
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
                placeholder="Search quizzes or teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${darkMode ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
              />
            </div>

            {/* Subject Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`pl-10 pr-8 py-3 rounded-xl border transition-colors appearance-none ${darkMode ? "bg-slate-700/50 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "endDate" | "teacher")}
                className={`px-3 py-3 rounded-xl border transition-colors ${darkMode ? "bg-slate-700/50 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              >
                <option value="endDate">End Date</option>
                <option value="name">Name</option>
                <option value="teacher">Teacher</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className={`p-3 rounded-xl border transition-colors ${darkMode ? "bg-slate-700/50 border-slate-600 hover:bg-slate-600/50" : "bg-white border-gray-300 hover:bg-gray-50"}`}
              >
                {sortOrder === "asc" ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-slate-700">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-slate-600 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-slate-600"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-slate-600 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-slate-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Showing {filteredQuizzes.length} of {quizzes.length} quizzes
            </p>
          </div>
        </motion.div>

        {/* Quiz Cards */}
        {filteredQuizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              No quizzes found
            </h3>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid gap-6 mt-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredQuizzes.map((quiz) => {
              const timeRemaining = getTimeRemaining(quiz.endsAt)
              const totalQuestions = getTotalQuestions(quiz)
              const isExpiring = new Date(quiz.endsAt).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000

              return (
                <motion.div
                  key={quiz.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl border ${darkMode ? "bg-slate-800/50 hover:bg-slate-800/80 border-purple-500/20" : "bg-white hover:bg-gray-50 border-gray-200"}`}
                >
                  {/* Quiz Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${darkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"}`}
                        >
                          Quiz #{quiz.number}
                        </span>
                        {isExpiring && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Expiring Soon
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{quiz.name}</h3>
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-gradient-to-br from-rose-400 to-orange-400"}`}
                    >
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{quiz.teacher?.fullname || "Unknown Teacher"}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Instructor</p>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mb-4">
                    <p className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Subjects:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quiz.quizsections?.map((section, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${darkMode ? "bg-slate-700/50 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                        >
                          {section.subject?.imgUrl && (
                            <img
                              src={section.subject.imgUrl || "/placeholder.svg"}
                              alt={section.subject.name}
                              className="w-4 h-4 rounded object-cover"
                            />
                          )}
                          <span>{section.subject?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`text-center p-3 rounded-lg ${darkMode ? "bg-slate-700/30" : "bg-gray-50"}`}>
                      <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-sm font-medium">{totalQuestions || 0}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Questions</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${darkMode ? "bg-slate-700/30" : "bg-gray-50"}`}>
                      <Clock className={`w-5 h-5 mx-auto mb-1 ${isExpiring ? "text-red-500" : "text-green-500"}`} />
                      <p className={`text-sm font-medium ${isExpiring ? "text-red-500" : ""}`}>{timeRemaining}</p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Remaining</p>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Ends: {new Date(quiz.endsAt).toLocaleDateString()} at {new Date(quiz.endsAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/student/quiz/${quiz.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${darkMode ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"} hover:shadow-lg transform hover:scale-105`}
                  >
                    <Trophy className="w-4 h-4" />
                    Attempt Quiz
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Background Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          className={`absolute -top-32 -left-20 w-[300px] h-[300px] rounded-full mix-blend-multiply filter blur-3xl ${darkMode ? "bg-indigo-900/30" : "bg-indigo-300/40"}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -bottom-32 -right-20 w-[300px] h-[300px] rounded-full mix-blend-multiply filter blur-3xl ${darkMode ? "bg-purple-900/30" : "bg-purple-300/40"}`}
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
