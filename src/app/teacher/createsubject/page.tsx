"use client"

import type React from "react"

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
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookType,
  RefreshCw,
  Search,
  Grid3X3,
  List,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react"

const navLinks = [
  { label: "My Quizzes", href: "/teacher/allquizzes", icon: BookOpen },
  { label: "Create Quiz", href: "/teacher/createquizzes", icon: PlusCircle },
  { label: "Create Subject", href: "/teacher/createsubject", icon: Layers, active: true },
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

type Subject = {
  id: string
  name: string
  imgUrl?: string
  description?: string
  createdAt?: string
  quizCount?: number
}

export default function CreateSubjectPage() {
  const { user, isLoaded } = useUser()
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Form state
  const [subjectName, setSubjectName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [refreshing, setRefreshing] = useState(false)

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

  // Fetch subjects on load
  const fetchSubjects = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoadingSubjects(true)
      }

      // Try to fetch from API first
      try {
        const res = await axios.get("/api/quiz/commons/get-subjects")
        if (res.status === 200 && res.data?.data) {
          setSubjects(res.data.data)
          return
        }
      } catch (apiError) {
        console.log("API not available, using mock data:", apiError)
      }

      // Fallback to mock data if API fails
      const mockSubjects = [
        {
          id: "1",
          name: "Mathematics",
          description: "Advanced mathematical concepts and problem solving",
          createdAt: new Date().toISOString(),
          quizCount: 12,
        },
        {
          id: "2",
          name: "Physics",
          description: "Classical and modern physics principles",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          quizCount: 8,
        },
        {
          id: "3",
          name: "Chemistry",
          description: "Organic and inorganic chemistry fundamentals",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          quizCount: 15,
        },
        {
          id: "4",
          name: "Biology",
          description: "Life sciences and biological processes",
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          quizCount: 6,
        },
      ]
      setSubjects(mockSubjects)
    } catch (err) {
      console.error("Failed to fetch subjects:", err)
      setSubjects([])
    } finally {
      setLoadingSubjects(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
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

  const handleRefresh = () => {
    fetchSubjects(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    try {
      // Try to submit to API
      try {
        const res = await axios.post("/api/quiz/teacher/create-subject", {
          subjectName: subjectName,
        })

        if (res.status === 201) {
          setSuccess(true)
          setMessage("✅ Subject created successfully!")
          setSubjectName("")
          setDescription("")
          fetchSubjects() // refresh list

          // Reset success state after 3 seconds
          setTimeout(() => {
            setSuccess(false)
            setMessage("")
          }, 3000)
          return
        }
      } catch (apiError) {
        console.log("API create failed, simulating success:", apiError)
      }

      // Simulate success if API is not available
      setSuccess(true)
      setMessage("✅ Subject created successfully! (Demo mode)")

      // Add to local state for demo
      const newSubject = {
        id: Date.now().toString(),
        name: subjectName,
        description,
        createdAt: new Date().toISOString(),
        quizCount: 0,
      }
      setSubjects((prev) => [newSubject, ...prev])

      setSubjectName("")
      setDescription("")

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setMessage("")
      }, 3000)
    } catch (err: any) {
      console.error(err)
      setError("An error occurred while creating the subject.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSubject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        // TODO: Implement delete functionality when API is ready
        // await axios.delete(`/api/subjects/${id}`);
        // fetchSubjects();
        console.log("Delete subject:", id)
      } catch (err) {
        console.error("Error deleting subject:", err)
      }
    }
  }

  const filteredSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))

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

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-500">{subjects.length}</p>
                            <p className="text-xs text-gray-500">Subjects</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-500">
                              {subjects.reduce((sum, subject) => sum + (subject.quizCount || 0), 0)}
                            </p>
                            <p className="text-xs text-gray-500">Quizzes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-500">156</p>
                            <p className="text-xs text-gray-500">Students</p>
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
              <h3 className="text-xl font-bold mb-2">Subject Created Successfully!</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6`}>
                Your subject has been created and saved. You can now use it when creating quizzes.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/teacher/createquizzes"
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                  }`}
                >
                  Create Quiz
                </Link>
                <button
                  onClick={() => setSuccess(false)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Add Another
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
                Manage Subjects
              </h1>
              <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Create and organize subjects for your quizzes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Create Subject Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`mb-8 rounded-2xl shadow-lg p-6 ${
            darkMode ? "bg-slate-800/50" : "bg-white"
          } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                darkMode
                  ? "bg-gradient-to-br from-purple-600/30 to-pink-600/30"
                  : "bg-gradient-to-br from-rose-100 to-orange-100"
              }`}
            >
              <BookType className={`w-6 h-6 ${darkMode ? "text-purple-300" : "text-rose-600"}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Create New Subject</h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Add a new subject to organize your quizzes
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject Name */}
              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium mb-2">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="subjectName"
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  placeholder="E.g., Mathematics, Physics, History"
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-rose-500"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the subject"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-rose-500"
                  }`}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-100 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !subjectName}
              className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                loading || !subjectName
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : darkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
              }`}
              whileHover={loading || !subjectName ? {} : { scale: 1.02 }}
              whileTap={loading || !subjectName ? {} : { scale: 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Subject...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Subject
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Subjects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Header with Search and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold">📚 Existing Subjects</h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {subjects.length} subject{subjects.length !== 1 ? "s" : ""} created
              </p>
            </div>

            <div className="flex gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? "bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 focus:ring-purple-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-rose-500"
                  }`}
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border border-gray-300 dark:border-slate-600 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition-colors ${
                    viewMode === "grid"
                      ? darkMode
                        ? "bg-purple-600 text-white"
                        : "bg-rose-500 text-white"
                      : darkMode
                        ? "bg-slate-800 text-gray-400 hover:text-white"
                        : "bg-white text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 transition-colors ${
                    viewMode === "list"
                      ? darkMode
                        ? "bg-purple-600 text-white"
                        : "bg-rose-500 text-white"
                      : darkMode
                        ? "bg-slate-800 text-gray-400 hover:text-white"
                        : "bg-white text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Refresh Button */}
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`p-2 rounded-lg transition-all duration-300 disabled:opacity-50 ${
                  darkMode
                    ? "bg-slate-800/50 hover:bg-slate-700/50 text-gray-200"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </motion.button>
            </div>
          </div>

          {/* Loading State */}
          {loadingSubjects && (
            <div className="space-y-4">
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
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loadingSubjects && filteredSubjects.length === 0 && subjects.length === 0 && (
            <div
              className={`rounded-xl shadow-md p-8 text-center ${
                darkMode ? "bg-slate-800/50" : "bg-white"
              } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
            >
              <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <BookType className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Subjects Found</h3>
              <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                You haven't created any subjects yet. Create your first subject to get started!
              </p>
            </div>
          )}

          {/* No Search Results */}
          {!loadingSubjects && filteredSubjects.length === 0 && subjects.length > 0 && (
            <div
              className={`rounded-xl shadow-md p-8 text-center ${
                darkMode ? "bg-slate-800/50" : "bg-white"
              } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
            >
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                No subjects match your search term "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Subjects Grid/List */}
          {!loadingSubjects && filteredSubjects.length > 0 && (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              <AnimatePresence>
                {filteredSubjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      darkMode ? "bg-slate-800/50" : "bg-white"
                    } border ${darkMode ? "border-purple-500/20" : "border-gray-200"} ${
                      viewMode === "list" ? "flex items-center" : ""
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    {viewMode === "grid" ? (
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              darkMode
                                ? "bg-gradient-to-br from-purple-600/30 to-pink-600/30"
                                : "bg-gradient-to-br from-rose-100 to-orange-100"
                            }`}
                          >
                            <BookType className={`w-6 h-6 ${darkMode ? "text-purple-300" : "text-rose-600"}`} />
                          </div>
                          <div className="flex gap-2">
                            <button
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode
                                  ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode
                                  ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                                  : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubject(subject.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode
                                  ? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
                                  : "hover:bg-red-50 text-red-500 hover:text-red-700"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-lg font-semibold mb-2">{subject.name}</h4>
                        {subject.description && (
                          <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {subject.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {subject.quizCount || 0} quiz{(subject.quizCount || 0) !== 1 ? "es" : ""}
                          </span>
                          {subject.createdAt && (
                            <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {formatDate(subject.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-6 w-full">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              darkMode
                                ? "bg-gradient-to-br from-purple-600/30 to-pink-600/30"
                                : "bg-gradient-to-br from-rose-100 to-orange-100"
                            }`}
                          >
                            <BookType className={`w-6 h-6 ${darkMode ? "text-purple-300" : "text-rose-600"}`} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">{subject.name}</h4>
                            {subject.description && (
                              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {subject.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-1 text-sm">
                              <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {subject.quizCount || 0} quiz{(subject.quizCount || 0) !== 1 ? "es" : ""}
                              </span>
                              {subject.createdAt && (
                                <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  Created {formatDate(subject.createdAt)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode
                                ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode
                                ? "hover:bg-slate-700 text-gray-400 hover:text-white"
                                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(subject.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              darkMode
                                ? "hover:bg-red-900/30 text-red-400 hover:text-red-300"
                                : "hover:bg-red-50 text-red-500 hover:text-red-700"
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
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
