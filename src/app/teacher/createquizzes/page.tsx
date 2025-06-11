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
  Save,
  Plus,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Upload,
  FileText,
} from "lucide-react"

const navLinks = [
  { label: "My Quizzes", href: "/teacher/allquizzes", icon: BookOpen },
  { label: "Create Quiz", href: "/teacher/createquizzes", icon: PlusCircle, active: true },
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

interface Subject {
  id: string
  name: string
}

interface Question {
  question: string
  options: string[]
  correctone: string
}

interface QuizSection {
  subjectId: string
  questions: Question[]
}

export default function CreateQuizPage() {
  const { user, isLoaded } = useUser()
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const profileRef = useRef<HTMLDivElement>(null)

  // Form state
  const [quizName, setQuizName] = useState("")
  const [duration, setDuration] = useState(30)
  const [endsAt, setEndsAt] = useState("")
  const [quizSections, setQuizSections] = useState<QuizSection[]>([])
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Basic Info, 2: Sections & Questions

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

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true)
        // Mock subjects for now - replace with your actual API call
        const mockSubjects = [
          { id: "9df34f7c-1cfe-4d05-bf7b-fa8a00ae6744", name: "Physics" },
          { id: "2a1b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6", name: "Mathematics" },
          { id: "3b2c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7", name: "Chemistry" },
          { id: "4c3d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8", name: "Biology" },
          { id: "5d4e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9", name: "English" },
          { id: "6e5f7g8h-9i0j-1k2l-3m4n-o5p6q7r8s9t0", name: "History" },
        ]
        setSubjects(mockSubjects)
      } catch (error) {
        console.error("Error fetching subjects:", error)
        setSubjects([])
      } finally {
        setLoadingSubjects(false)
      }
    }

    fetchSubjects()
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

  const handleProfileSave = async () => {
    try {
      console.log("Saving profile:", profileData)
      setEditProfileOpen(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleAddSection = () => {
    setQuizSections([...quizSections, { subjectId: "", questions: [] }])
  }

  const handleAddQuestion = (sectionIndex: number) => {
    const updatedSections = [...quizSections]
    updatedSections[sectionIndex].questions.push({
      question: "",
      options: ["", "", "", ""],
      correctone: "",
    })
    setQuizSections(updatedSections)
  }

  const removeSection = (sectionIndex: number) => {
    setQuizSections(quizSections.filter((_, i) => i !== sectionIndex))
  }

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const updatedSections = [...quizSections]
    updatedSections[sectionIndex].questions = updatedSections[sectionIndex].questions.filter(
      (_, i) => i !== questionIndex,
    )
    setQuizSections(updatedSections)
  }

  const updateSection = (sectionIndex: number, field: string, value: any) => {
    const updatedSections = [...quizSections]
    updatedSections[sectionIndex] = { ...updatedSections[sectionIndex], [field]: value }
    setQuizSections(updatedSections)
  }

  const updateQuestion = (sectionIndex: number, questionIndex: number, field: string, value: any) => {
    const updatedSections = [...quizSections]
    updatedSections[sectionIndex].questions[questionIndex] = {
      ...updatedSections[sectionIndex].questions[questionIndex],
      [field]: value,
    }
    setQuizSections(updatedSections)
  }

  const updateOption = (sectionIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const updatedSections = [...quizSections]
    updatedSections[sectionIndex].questions[questionIndex].options[optionIndex] = value
    setQuizSections(updatedSections)
  }

  const uploadPdf = async (): Promise<string | null> => {
    if (!pdfFile) return null
    try {
      const res = await axios.post("/api/commons/signature-url", {
        filename: pdfFile.name,
        filetype: pdfFile.type,
      })

      const { uploadUrl, fileUrl } = res.data

      await axios.put(uploadUrl, pdfFile, {
        headers: {
          "Content-Type": pdfFile.type,
        },
      })

      return fileUrl
    } catch (err) {
      console.error("PDF Upload failed:", err)
      return null
    }
  }

  const submitQuiz = async () => {
    setLoading(true)
    setMessage("")
    setErrors({})

    try {
      let uploadedPdfUrl = ""
      if (pdfFile) {
        const url = await uploadPdf()
        if (!url) {
          setMessage("❌ Failed to upload PDF.")
          setLoading(false)
          return
        }
        uploadedPdfUrl = url
      }

      const response = await axios.post("/api/quiz/teacher/create-quiz", {
        teacherclerkid: user?.id || "user_2xwfgayWB78AYK2m716oqB5fXoW",
        endsAt,
        duration,
        quizname: quizName,
        quizSections,
        pdfUrl: uploadedPdfUrl,
      })

      setSuccess(true)
      setMessage("✅ Quiz created successfully!")
      console.log(response.data)

      // Reset form after successful creation
      setTimeout(() => {
        setQuizName("")
        setDuration(30)
        setEndsAt("")
        setQuizSections([])
        setPdfFile(null)
        setCurrentStep(1)
        setSuccess(false)
        setMessage("")
      }, 3000)
    } catch (err: any) {
      setMessage("❌ Failed to create quiz.")
      setErrors({ submit: err.response?.data?.message || "An error occurred" })
      console.error(err)
    } finally {
      setLoading(false)
    }
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

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
          : "bg-gradient-to-br from-rose-50 via-teal-50 to-violet-50 text-gray-900"
      }`}
    >
      {/* Header - Same as other pages */}
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
                            <h3 className="font-bold text-lg">{displayName}</h3>
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

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`w-full max-w-md rounded-2xl shadow-2xl p-8 text-center ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quiz Created Successfully!</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
                Your quiz has been created and saved. You can now view it in your quiz list.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/teacher/allquizzes"
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  }`}
                >
                  View Quizzes
                </Link>
                <button
                  onClick={() => setSuccess(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Create Another
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/teacher/allquizzes"
              className={`p-3 rounded-xl shadow-lg transition-all duration-300 ${
                darkMode
                  ? "bg-slate-800/50 hover:bg-slate-700/50 text-gray-200"
                  : "bg-white/50 hover:bg-gray-100/50 text-gray-700"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1
                className={`text-3xl sm:text-4xl font-bold mb-2 ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                }`}
              >
                Create New Quiz
              </h1>
              <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Design engaging quizzes for your students
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? darkMode
                      ? "bg-purple-600 text-white"
                      : "bg-rose-500 text-white"
                    : darkMode
                      ? "bg-slate-700 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? "" : "text-gray-500"}`}>Basic Info</span>
            </div>
            <div className={`flex-1 h-1 rounded ${currentStep >= 2 ? "bg-purple-500" : "bg-gray-300"}`}></div>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? darkMode
                      ? "bg-purple-600 text-white"
                      : "bg-rose-500 text-white"
                    : darkMode
                      ? "bg-slate-700 text-gray-400"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? "" : "text-gray-500"}`}>
                Questions & Sections
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        <div
          className={`rounded-2xl shadow-lg p-6 sm:p-8 ${
            darkMode ? "bg-slate-800/50" : "bg-white"
          } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
        >
          {currentStep === 1 ? (
            /* Step 1: Basic Information */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6">Basic Quiz Information</h2>

              {/* Quiz Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quiz Name <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={quizName}
                  onChange={(e) => setQuizName(e.target.value)}
                  placeholder="Enter quiz name (auto-generated if empty)"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-rose-500"
                  }`}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number.parseInt(e.target.value) || 0)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-purple-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-rose-500"
                    }`}
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quiz End Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white focus:ring-purple-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-rose-500"
                    }`}
                  />
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload PDF <span className="text-gray-500">(Optional)</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                    pdfFile
                      ? darkMode
                        ? "border-green-500 bg-green-900/20"
                        : "border-green-500 bg-green-50"
                      : darkMode
                        ? "border-slate-600 hover:border-purple-500 bg-slate-700/50"
                        : "border-gray-300 hover:border-rose-500 bg-gray-50"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPdfFile(e.target.files[0])
                      }
                    }}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      {pdfFile ? (
                        <>
                          <FileText className="w-12 h-12 text-green-500" />
                          <div>
                            <p className="font-medium text-green-600">{pdfFile.name}</p>
                            <p className="text-sm text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-gray-400" />
                          <div>
                            <p className="font-medium">Click to upload PDF</p>
                            <p className="text-sm text-gray-500">Or drag and drop your file here</p>
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end pt-6">
                <motion.button
                  onClick={() => setCurrentStep(2)}
                  disabled={!duration || !endsAt}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    !duration || !endsAt
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : darkMode
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  }`}
                  whileHover={!duration || !endsAt ? {} : { scale: 1.05 }}
                  whileTap={!duration || !endsAt ? {} : { scale: 0.95 }}
                >
                  Next: Add Questions
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Step 2: Quiz Sections & Questions */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Quiz Sections & Questions</h2>
                <motion.button
                  onClick={handleAddSection}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                      : "bg-rose-100 hover:bg-rose-200 text-rose-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </motion.button>
              </div>

              {/* Quiz Sections */}
              <div className="space-y-6">
                {quizSections.map((section, sectionIndex) => (
                  <motion.div
                    key={sectionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-xl border ${
                      darkMode ? "bg-slate-700/50 border-slate-600" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Section {sectionIndex + 1}</h3>
                      <button
                        onClick={() => removeSection(sectionIndex)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subject Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={section.subjectId}
                        onChange={(e) => updateSection(sectionIndex, "subjectId", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                          darkMode
                            ? "bg-slate-700 border-slate-600 text-white focus:ring-purple-500"
                            : "bg-white border-gray-300 text-gray-900 focus:ring-rose-500"
                        }`}
                      >
                        <option value="">Select a subject</option>
                        {loadingSubjects ? (
                          <option disabled>Loading subjects...</option>
                        ) : (
                          subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Questions</h4>
                        <motion.button
                          onClick={() => handleAddQuestion(sectionIndex)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                            darkMode
                              ? "bg-slate-600 hover:bg-slate-500 text-gray-200"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="w-3 h-3" />
                          Add Question
                        </motion.button>
                      </div>

                      {section.questions.map((question, questionIndex) => (
                        <motion.div
                          key={questionIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border ${
                            darkMode ? "bg-slate-800/50 border-slate-500" : "bg-white border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium">Question {questionIndex + 1}</h5>
                            <button
                              onClick={() => removeQuestion(sectionIndex, questionIndex)}
                              className="p-1.5 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Question Text */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">
                              Question Text <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={question.question}
                              onChange={(e) => updateQuestion(sectionIndex, questionIndex, "question", e.target.value)}
                              placeholder="Enter your question..."
                              rows={2}
                              className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 resize-none ${
                                darkMode
                                  ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500"
                                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-rose-500"
                              }`}
                            />
                          </div>

                          {/* Options */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium mb-2">
                              Answer Options <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct_${sectionIndex}_${questionIndex}`}
                                    checked={question.correctone === option}
                                    onChange={() => updateQuestion(sectionIndex, questionIndex, "correctone", option)}
                                    className="w-4 h-4 text-purple-600"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(sectionIndex, questionIndex, optionIndex, e.target.value)
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                                      darkMode
                                        ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500"
                                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-rose-500"
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Correct Answer Indicator */}
                          {question.correctone && (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>Correct answer: {question.correctone}</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <motion.button
                  onClick={() => setCurrentStep(1)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>

                <motion.button
                  onClick={submitQuiz}
                  disabled={loading || quizSections.length === 0}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    loading || quizSections.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : darkMode
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  }`}
                  whileHover={loading || quizSections.length === 0 ? {} : { scale: 1.05 }}
                  whileTap={loading || quizSections.length === 0 ? {} : { scale: 0.95 }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Quiz
                    </>
                  )}
                </motion.button>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-100 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Message */}
              {message && (
                <div
                  className={`p-4 rounded-xl text-center font-medium ${
                    message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </motion.div>
          )}
        </div>
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
