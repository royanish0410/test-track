"use client"

import { SignOutButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Sun,
  Moon,
  BookOpen,
  CheckCircle,
  Send,
  Clock,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Edit3,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  TrendingUp,
  Star,
  ExternalLink,
  Trophy,
  Calendar,
  BarChart3,
} from "lucide-react"

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
  phone: string
  location: string
  bio: string
  grade: string
  school: string
}

interface DashboardStats {
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
  rank: number
  quizzesChange: string
  completedChange: string
  scoreChange: string
  rankChange: string
}

interface RecentActivity {
  id: string
  action: string
  subject: string
  time: string
  score?: number
  type: "completed" | "started" | "eligible"
}

export default function StudentDashboard() {
  const { user, isLoaded } = useUser()
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const profileRef = useRef<HTMLDivElement>(null)

  // API Data States
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    rank: 0,
    quizzesChange: "+0%",
    completedChange: "+0%",
    scoreChange: "+0%",
    rankChange: "+0",
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    grade: "",
    school: "",
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

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // TODO: Replace with your actual API endpoints
        // const statsResponse = await fetch('/api/student/dashboard-stats')
        // const statsData = await statsResponse.json()
        // setDashboardStats(statsData)

        // const activitiesResponse = await fetch('/api/student/recent-activities')
        // const activitiesData = await activitiesResponse.json()
        // setRecentActivities(activitiesData)

        // const profileResponse = await fetch('/api/student/profile')
        // const profileData = await profileResponse.json()
        // setProfileData(prev => ({ ...prev, ...profileData }))

        // Temporary mock data - remove when API is connected
        setTimeout(() => {
          setDashboardStats({
            totalQuizzes: 45,
            completedQuizzes: 32,
            averageScore: 85,
            rank: 12,
            quizzesChange: "+8%",
            completedChange: "+15%",
            scoreChange: "+7%",
            rankChange: "+3",
          })

          setRecentActivities([
            {
              id: "1",
              action: "Completed quiz",
              subject: "Mathematics - Algebra",
              time: "2 hours ago",
              score: 92,
              type: "completed",
            },
            {
              id: "2",
              action: "Started quiz",
              subject: "Physics - Motion",
              time: "4 hours ago",
              type: "started",
            },
            {
              id: "3",
              action: "New quiz available",
              subject: "Chemistry - Organic",
              time: "1 day ago",
              type: "eligible",
            },
            {
              id: "4",
              action: "Completed quiz",
              subject: "Biology - Cell Structure",
              time: "2 days ago",
              score: 88,
              type: "completed",
            },
          ])

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    if (user && isLoaded) {
      fetchDashboardData()
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

  const handleProfileSave = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/student/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // })
      // if (response.ok) {
      //   // Show success message
      // }

      console.log("Saving profile:", profileData)
      setEditProfileOpen(false)
      // Show success message
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  const handleSettingsClick = () => {
    setProfileOpen(false)
    setSettingsOpen(true)
    // TODO: Navigate to settings page or open settings modal
    // router.push('/student/settings')
  }

  const handleHelpClick = () => {
    setProfileOpen(false)
    setHelpOpen(true)
    // TODO: Navigate to help page or open help modal
    // router.push('/student/help')
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
                      darkMode
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
                                <span className="text-xs text-yellow-400">Rank #{dashboardStats.rank}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats - Data from API */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-500">{dashboardStats.completedQuizzes}</p>
                            <p className="text-xs text-gray-500">Completed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-500">{dashboardStats.averageScore}%</p>
                            <p className="text-xs text-gray-500">Avg Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-500">#{dashboardStats.rank}</p>
                            <p className="text-xs text-gray-500">Rank</p>
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
                          onClick={handleSettingsClick}
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
                          onClick={handleHelpClick}
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
                      darkMode
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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editProfileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditProfileOpen(false)}
          >
            <motion.div
              className={`w-full max-w-2xl rounded-2xl shadow-2xl ${
                darkMode ? "bg-slate-800" : "bg-white"
              } max-h-[90vh] overflow-y-auto`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Edit Profile</h2>
                  <button
                    onClick={() => setEditProfileOpen(false)}
                    className={`p-2 rounded-lg ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-20 h-20 rounded-xl flex items-center justify-center ${
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
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div>
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? "border-slate-600 hover:bg-slate-700 text-gray-200"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <Camera className="w-4 h-4" />
                        Change Photo
                      </button>
                      <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors ${
                            darkMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors ${
                            darkMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Grade/Class</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.grade}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, grade: e.target.value }))}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg border transition-colors ${
                            darkMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">School</label>
                      <input
                        type="text"
                        value={profileData.school}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, school: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? "bg-slate-700 border-slate-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${
                        darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      onClick={handleProfileSave}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </motion.button>
                    <motion.button
                      onClick={() => setEditProfileOpen(false)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        darkMode
                          ? "bg-slate-700 hover:bg-slate-600 text-gray-200"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Content */}
      <main className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
          }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <h1
              className={`text-4xl sm:text-6xl font-bold mb-6 ${
                darkMode
                  ? "bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              }`}
            >
              Welcome Back, {displayName}! 🎓
            </h1>
          </motion.div>
          <p className={`max-w-3xl mx-auto text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Ready to continue your learning journey? Your personalized dashboard shows your progress and available
            quizzes.
          </p>
        </motion.div>

        {/* Enhanced Stats Cards - Data from API */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              label: "Available Quizzes",
              value: loading ? "..." : dashboardStats.totalQuizzes.toString(),
              icon: BookOpen,
              color: "from-blue-500 to-cyan-500",
              change: dashboardStats.quizzesChange,
              trend: "up",
            },
            {
              label: "Completed Quizzes",
              value: loading ? "..." : dashboardStats.completedQuizzes.toString(),
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
              change: dashboardStats.completedChange,
              trend: "up",
            },
            {
              label: "Average Score",
              value: loading ? "..." : `${dashboardStats.averageScore}%`,
              icon: BarChart3,
              color: "from-purple-500 to-pink-500",
              change: dashboardStats.scoreChange,
              trend: "up",
            },
            {
              label: "Class Rank",
              value: loading ? "..." : `#${dashboardStats.rank}`,
              icon: Trophy,
              color: "from-orange-500 to-red-500",
              change: dashboardStats.rankChange,
              trend: "up",
            },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div
                className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                  darkMode
                    ? "bg-gradient-to-br from-slate-800/80 to-purple-800/80 text-gray-200"
                    : "bg-white text-gray-700"
                } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-1 text-green-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                darkMode ? "bg-slate-800/50 hover:bg-slate-800/80" : "bg-white hover:bg-gray-50"
              } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
            >
              <Link href={link.href} className="flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                    darkMode
                      ? "bg-gradient-to-br from-purple-600/20 to-pink-600/20"
                      : "bg-gradient-to-br from-rose-100 to-orange-100"
                  }`}
                >
                  <link.icon className={`w-8 h-8 ${darkMode ? "text-purple-400" : "text-rose-600"}`} />
                </div>
                <h2 className="text-lg font-semibold mb-2">{link.label}</h2>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {index === 0 && "Browse and discover new quizzes to attempt"}
                  {index === 1 && "Review your completed quizzes and scores"}
                  {index === 2 && "Submit your completed quiz answers"}
                  {index === 3 && "View quizzes you're eligible to take"}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity - Data from API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={`rounded-2xl p-6 shadow-lg ${
            darkMode ? "bg-slate-800/50" : "bg-white"
          } border ${darkMode ? "border-purple-500/20" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <Calendar className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          </div>
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "completed"
                        ? "bg-green-500"
                        : activity.type === "started"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{activity.action}</p>
                      {activity.score && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                          {activity.score}%
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{activity.subject}</p>
                  </div>
                  <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>No recent activity</p>
              </div>
            )}
          </div>
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
        <motion.div
          className={`absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full mix-blend-multiply filter blur-3xl ${
            darkMode ? "bg-blue-900/20" : "bg-blue-300/30"
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className={`absolute bottom-1/3 left-1/4 w-[250px] h-[250px] rounded-full mix-blend-multiply filter blur-3xl ${
            darkMode ? "bg-teal-900/20" : "bg-teal-300/30"
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 17, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
      </div>
    </div>
  )
}
