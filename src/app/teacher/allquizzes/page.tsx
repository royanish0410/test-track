'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
  hover: {
    scale: 1.03,
    boxShadow: '0px 8px 20px rgba(0,0,0,0.15)',
    y: -4,
  },
}

const AllQuizzesPage = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => setDarkMode(!darkMode)

  const quizzes = [
    {
      id: 'quiz-1',
      title: 'JEE Physics Set 1',
      subject: 'Physics',
      date: '2025-06-01',
    },
    {
      id: 'quiz-2',
      title: 'JEE Chemistry Set 1',
      subject: 'Chemistry',
      date: '2025-06-01',
    },
    {
      id: 'quiz-3',
      title: 'JEE Maths Set 1',
      subject: 'Mathematics',
      date: '2025-06-01',
    },
  ]

  return (
    <div
      className={`relative min-h-screen px-4 py-10 transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
          : 'bg-gradient-to-br from-blue-100 via-white to-pink-100 text-gray-900'
      }`}
    >
      {/* Background Circles */}
      <motion.div
        className="absolute -top-28 -left-28 w-[250px] h-[250px] bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-28 -right-28 w-[250px] h-[250px] bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Header and Toggle */}
      <div className="relative z-10 flex justify-center items-center mb-8">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          📚 All Quizzes
        </motion.h1>

        <motion.button
          onClick={toggleTheme}
          className="absolute right-2 top-0 p-2 bg-white rounded-full text-xl shadow-md"
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
        {quizzes.map((quiz, i) => (
          <motion.div
            key={quiz.id}
            className={`rounded-xl p-5 shadow-md transition-all duration-300 ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            }`}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-indigo-300">
              {quiz.title}
            </h2>
            <p className="text-sm mt-2">
              Subject: <span className="font-medium">{quiz.subject}</span>
            </p>
            <p className="text-sm mt-1">Date: {quiz.date}</p>

            <Link href={`/teacher/quiz/${quiz.id}`}>
              <button className="mt-4 bg-blue-500 text-white py-1.5 px-4 rounded-lg hover:bg-blue-600 transition duration-200 text-sm">
                View Quiz
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AllQuizzesPage
