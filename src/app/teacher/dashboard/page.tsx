'use client'

import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: 'spring', stiffness: 100 },
  }),
  hover: {
    scale: 1.05,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    y: -5,
  }
}

const TeacherDashboard = () => {
  const cards = [
    {
      title: 'Create Quiz',
      description: 'Upload PDFs or type questions for new JEE-style quizzes.',
      link: '/teacher/createquizzes',
      color: 'bg-blue-200',
    },
    {
      title: 'All Quizzes',
      description: 'Manage and edit all existing quizzes.',
      link: '/teacher/allquizzes',
      color: 'bg-green-200',
    },
    {
      title: 'Scores',
      description: 'Analyze student results and performance.',
      link: '/teacher/score',
      color: 'bg-yellow-200',
    },
  ]

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-100 to-purple-100 text-gray-900 px-4 py-6 overflow-hidden">
      {/* Animated Background Circles */}
      <motion.div
        className="absolute -top-20 -left-20 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.7, 0.6],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="relative flex flex-col items-center mb-8 sm:mb-12">
        <motion.h1
          className="text-3xl sm:text-5xl font-extrabold text-center mb-4"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        >
          Teacher Dashboard
        </motion.h1>
      </div>

      <motion.div
        className="absolute right-4 top-16 p-2 sm:p-3 rounded-xl shadow-md bg-red-200 text-center flex items-center justify-center"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        <SignOutButton>
          <button className="text-base sm:text-lg font-medium text-red-600 hover:underline">
            Sign Out
          </button>
        </SignOutButton>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto relative z-10">
        {cards.map((card, i) => (
          <Link href={card.link} key={i} className="block">
            <motion.div
              className={`p-4 sm:p-8 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 ${card.color} transform`}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-center">{card.title}</h2>
              <p className="text-sm sm:text-base text-gray-700 text-center">{card.description}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TeacherDashboard
