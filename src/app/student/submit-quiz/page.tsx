"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"
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
  CheckSquare,
  XCircle,
  FileText,
  Upload,
  ArrowLeft,
  Timer,
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

interface Question {
  id: string
  question: string
  options: string[]
  timeSpent: number
}

interface QuizSection {
  id: string
  subject: string
  questions: Question[]
}

interface QuizData {
  id: string
  name: string
  sections: QuizSection[]
}

interface Answer {
  questionId: string
  selectedAnswer: string
  timeSpent: number
}

export default function SubmitQuiz() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [quizId, setQuizId] = useState<string>("")
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [currentStep, setCurrentStep] = useState<"input" | "review" | "result">("input")
  const [result, setResult] = useState<any>(null)

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

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const toggleProfile = () => setProfileOpen(!profileOpen)

  // Replace the fetchQuizData function with this real API implementation:

  const fetchQuizData = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/quiz/teacher/get-my-quizzes`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch quiz data")
      }

      const data = await response.json()
      setQuizData(data)

      // Initialize answers array based on the fetched quiz data
      const initialAnswers = data.sections.flatMap((section) =>
        section.questions.map((question) => ({
          questionId: question.id,
          selectedAnswer: "",
          timeSpent: 0,
        })),
      )

      setAnswers(initialAnswers)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quiz data. Please try again.")
      setLoading(false)
    }
  }

  const handleQuizIdSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!quizId.trim()) {
      setError("Please enter a valid Quiz ID")
      return
    }
    fetchQuizData(quizId)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) =>
      prev.map((a) => (a.questionId === questionId ? { ...a, selectedAnswer: answer, timeSpent: a.timeSpent + 1 } : a)),
    )
  }

  // Replace the handleSubmitAnswers function with this real API implementation:

  const handleSubmitAnswers = async () => {
    setSubmitting(true)
    setError(null)

    try {
      // Check if all questions are answered
      const unansweredQuestions = answers.filter((a) => !a.selectedAnswer)
      if (unansweredQuestions.length > 0) {
        setError(`Please answer all questions. ${unansweredQuestions.length} questions are unanswered.`)
        setSubmitting(false)
        return
      }

      // Submit answers to the API
      const response = await fetch(`/api/quiz/student/submit-quiz/${quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit quiz")
      }

      const result = await response.json()
      setResult(result)
      setSuccess(true)
      setCurrentStep("result")
      setSubmitting(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit answers. Please try again.")
      setSubmitting(false)
    }
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
                      link.href === "/student/submit"
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
                      link.href === "/student/submit"
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
            Submit Quiz 📝
          </h1>
          <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Submit your quiz answers and get instant results
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 shadow-lg backdrop-blur-xl border ${darkMode ? "bg-slate-800/50 border-purple-500/20" : "bg-white/80 border-rose-200/50"}`}
        >
          {/* Step 1: Enter Quiz ID */}
          {currentStep === "input" && !quizData && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleQuizIdSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Enter Quiz ID
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={quizId}
                      onChange={(e) => setQuizId(e.target.value)}
                      placeholder="Enter the Quiz ID provided by your teacher"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${darkMode ? "bg-slate-700/50 border-slate-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                      required
                    />
                  </div>
                  <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    You can find the Quiz ID in your assignment or from your teacher.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  } hover:shadow-lg transform hover:scale-105 disabled:opacity-70 disabled:transform-none`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading Quiz...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Load Quiz
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 1.5: Quiz Loaded - Answer Questions */}
          {currentStep === "input" && quizData && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                  {quizData.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-amber-500" />
                  <span className={`text-sm font-medium ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
                    Answer all questions
                  </span>
                </div>
              </div>

              {quizData.sections.map((section, sectionIndex) => (
                <div key={section.id} className="mb-8">
                  <div
                    className={`flex items-center gap-2 mb-4 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        darkMode
                          ? "bg-gradient-to-br from-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-rose-400 to-orange-400"
                      }`}
                    >
                      <span className="text-white font-bold">{sectionIndex + 1}</span>
                    </div>
                    <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {section.subject}
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {section.questions.map((question, questionIndex) => (
                      <div
                        key={question.id}
                        className={`p-4 rounded-xl border ${darkMode ? "bg-slate-700/30 border-slate-600" : "bg-gray-50 border-gray-200"}`}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              darkMode ? "bg-slate-600 text-gray-200" : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            <span className="text-xs font-bold">{questionIndex + 1}</span>
                          </div>
                          <p className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                            {question.question}
                          </p>
                        </div>

                        <div className="ml-9 space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                answers.find((a) => a.questionId === question.id)?.selectedAnswer === option
                                  ? darkMode
                                    ? "bg-purple-600/20 border border-purple-500/50"
                                    : "bg-rose-100 border border-rose-200"
                                  : darkMode
                                    ? "bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50"
                                    : "bg-white border border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option}
                                checked={answers.find((a) => a.questionId === question.id)?.selectedAnswer === option}
                                onChange={() => handleAnswerChange(question.id, option)}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  answers.find((a) => a.questionId === question.id)?.selectedAnswer === option
                                    ? darkMode
                                      ? "border-purple-400 bg-purple-500"
                                      : "border-rose-400 bg-rose-500"
                                    : darkMode
                                      ? "border-gray-500"
                                      : "border-gray-300"
                                }`}
                              >
                                {answers.find((a) => a.questionId === question.id)?.selectedAnswer === option && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <span
                                className={`${
                                  answers.find((a) => a.questionId === question.id)?.selectedAnswer === option
                                    ? "font-medium"
                                    : ""
                                }`}
                              >
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => {
                    setQuizData(null)
                    setQuizId("")
                    setError(null)
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={() => setCurrentStep("review")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  } hover:shadow-lg`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Review Answers
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review Answers */}
          {currentStep === "review" && quizData && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                  Review Your Answers
                </h2>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-green-500" />
                  <span className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>
                    {answers.filter((a) => a.selectedAnswer).length} of {answers.length} questions answered
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl border mb-6 ${darkMode ? "bg-amber-900/20 border-amber-800/30" : "bg-amber-50 border-amber-200"}`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`font-medium ${darkMode ? "text-amber-300" : "text-amber-700"}`}>
                      Please review your answers carefully
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? "text-amber-400/80" : "text-amber-600/80"}`}>
                      Once submitted, you cannot change your answers. Make sure all questions are answered correctly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {quizData.sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 rounded-xl border ${darkMode ? "bg-slate-700/30 border-slate-600" : "bg-gray-50 border-gray-200"}`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 pb-2 border-b ${
                        darkMode ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-200"
                      }`}
                    >
                      {section.subject}
                    </h3>

                    <div className="space-y-4">
                      {section.questions.map((question) => {
                        const answer = answers.find((a) => a.questionId === question.id)
                        return (
                          <div key={question.id} className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                answer?.selectedAnswer
                                  ? darkMode
                                    ? "bg-green-600 text-white"
                                    : "bg-green-500 text-white"
                                  : darkMode
                                    ? "bg-red-600 text-white"
                                    : "bg-red-500 text-white"
                              }`}
                            >
                              {answer?.selectedAnswer ? (
                                <CheckSquare className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                            </div>
                            <div>
                              <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                {question.question}
                              </p>
                              {answer?.selectedAnswer ? (
                                <p className={`mt-1 ${darkMode ? "text-purple-400" : "text-purple-600"} font-medium`}>
                                  Your answer: {answer.selectedAnswer}
                                </p>
                              ) : (
                                <p className={`mt-1 ${darkMode ? "text-red-400" : "text-red-600"} italic`}>
                                  No answer selected
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentStep("input")}
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Questions
                </button>

                <button
                  onClick={handleSubmitAnswers}
                  disabled={submitting}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  } hover:shadow-lg disabled:opacity-70`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Submit Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {currentStep === "result" && result && (
            <div>
              <div
                className={`p-6 rounded-xl border mb-8 ${
                  result.result.status === "PASSED"
                    ? darkMode
                      ? "bg-green-900/20 border-green-800/30"
                      : "bg-green-50 border-green-200"
                    : darkMode
                      ? "bg-amber-900/20 border-amber-800/30"
                      : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      result.result.status === "PASSED"
                        ? darkMode
                          ? "bg-green-600"
                          : "bg-green-500"
                        : darkMode
                          ? "bg-amber-600"
                          : "bg-amber-500"
                    }`}
                  >
                    <div className="text-white text-center">
                      <p className="text-3xl font-bold">
                        {Math.round((result.result.correctAnswers / result.result.totalQuestions) * 100)}%
                      </p>
                      <p className="text-xs font-medium">Score</p>
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2
                      className={`text-2xl font-bold mb-2 ${
                        result.result.status === "PASSED"
                          ? darkMode
                            ? "text-green-300"
                            : "text-green-700"
                          : darkMode
                            ? "text-amber-300"
                            : "text-amber-700"
                      }`}
                    >
                      {result.result.status === "PASSED" ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
                    </h2>
                    <p
                      className={`${
                        result.result.status === "PASSED"
                          ? darkMode
                            ? "text-green-400/80"
                            : "text-green-600/80"
                          : darkMode
                            ? "text-amber-400/80"
                            : "text-amber-600/80"
                      }`}
                    >
                      You answered {result.result.correctAnswers} out of {result.result.totalQuestions} questions
                      correctly.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`text-center p-3 rounded-lg ${darkMode ? "bg-green-800/30" : "bg-green-100"}`}>
                      <p className={`text-2xl font-bold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                        {result.result.correctAnswers}
                      </p>
                      <p className={`text-xs ${darkMode ? "text-green-400" : "text-green-600"}`}>Correct</p>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${darkMode ? "bg-red-800/30" : "bg-red-100"}`}>
                      <p className={`text-2xl font-bold ${darkMode ? "text-red-300" : "text-red-700"}`}>
                        {result.result.wrongAnswers}
                      </p>
                      <p className={`text-xs ${darkMode ? "text-red-400" : "text-red-600"}`}>Incorrect</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {Object.entries(result.data).map(([sectionId, sectionData]: [string, any]) => (
                  <div
                    key={sectionId}
                    className={`p-4 rounded-xl border ${darkMode ? "bg-slate-700/30 border-slate-600" : "bg-gray-50 border-gray-200"}`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 pb-2 border-b ${
                        darkMode ? "text-gray-200 border-gray-600" : "text-gray-800 border-gray-200"
                      }`}
                    >
                      {sectionData.subject}
                    </h3>

                    <div className="space-y-6">
                      {sectionData.QuestionAnswers.map((qa: any) => (
                        <div
                          key={qa.questionId}
                          className={`p-4 rounded-lg border ${
                            qa.isCorrect
                              ? darkMode
                                ? "bg-green-900/20 border-green-800/30"
                                : "bg-green-50 border-green-200"
                              : darkMode
                                ? "bg-red-900/20 border-red-800/30"
                                : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                qa.isCorrect
                                  ? darkMode
                                    ? "bg-green-600 text-white"
                                    : "bg-green-500 text-white"
                                  : darkMode
                                    ? "bg-red-600 text-white"
                                    : "bg-red-500 text-white"
                              }`}
                            >
                              {qa.isCorrect ? <CheckSquare className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                {qa.question}
                              </p>
                              <p
                                className={`mt-2 ${
                                  qa.isCorrect
                                    ? darkMode
                                      ? "text-green-400"
                                      : "text-green-600"
                                    : darkMode
                                      ? "text-red-400"
                                      : "text-red-600"
                                } font-medium`}
                              >
                                Your answer: {qa.selectedAnswer}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Timer className="w-4 h-4 text-gray-400" />
                                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Time spent: {qa.timeSpent} seconds
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/student/attempted")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  } hover:shadow-lg`}
                >
                  <CheckCircle className="w-5 h-5" />
                  View All Attempted Quizzes
                </button>

                <button
                  onClick={() => {
                    setQuizData(null)
                    setQuizId("")
                    setError(null)
                    setCurrentStep("input")
                    setResult(null)
                    setSuccess(false)
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Submit Another Quiz
                </button>
              </div>
            </div>
          )}
        </motion.div>
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
