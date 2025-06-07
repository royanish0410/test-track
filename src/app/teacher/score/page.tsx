'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

const scoreVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
}

const mockScores = [
  {
    student: 'Aarav Sharma',
    quiz: 'JEE Physics Set 1',
    score: 45,
    total: 60,
    status: 'Passed',
  },
  {
    student: 'Isha Mehta',
    quiz: 'JEE Chemistry Set 1',
    score: 52,
    total: 60,
    status: 'Passed',
  },
  {
    student: 'Rohan Verma',
    quiz: 'JEE Maths Set 1',
    score: 30,
    total: 60,
    status: 'Needs Improvement',
  },
]

const ScorePage = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => setDarkMode(!darkMode)

  return (
    <div
      className={`relative min-h-screen px-4 py-10 transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-bl from-gray-900 to-gray-800 text-white'
          : 'bg-gradient-to-bl from-pink-100 via-white to-blue-100 text-gray-900'
      }`}
    >
      {/* Background Bubbles */}
      <motion.div
        className="absolute -top-28 -left-28 w-[250px] h-[250px] bg-purple-300 rounded-full filter blur-3xl opacity-40 animate-pulse z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-28 -right-28 w-[250px] h-[250px] bg-yellow-300 rounded-full filter blur-3xl opacity-40 animate-pulse z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold w-full text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🧾 Quiz Scores
        </motion.h1>

        <motion.button
          onClick={toggleTheme}
          className="absolute right-2 top-0 p-2 rounded-full bg-white text-xl shadow-md sm:right-4"
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>
      </div>

      {/* Score Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
        {mockScores.map((score, i) => (
          <motion.div
            key={`${score.student}-${i}`}
            className={`rounded-xl p-5 border shadow-md hover:shadow-lg transition-all duration-300 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            }`}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={scoreVariants}
          >
            <h2 className="text-lg font-semibold">{score.student}</h2>
            <p className="text-sm mt-1">Quiz: {score.quiz}</p>
            <p className="text-sm mt-1">
              Score: <span className="font-bold">{score.score}</span> / {score.total}
            </p>
            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                score.status === 'Passed'
                  ? darkMode
                    ? 'bg-green-800 text-green-100'
                    : 'bg-green-100 text-green-800'
                  : darkMode
                    ? 'bg-red-800 text-red-100'
                    : 'bg-red-100 text-red-700'
              }`}
            >
              {score.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ScorePage
