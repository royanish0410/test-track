'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const CreateQuiz = () => {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) {
      alert('Please fill in all fields')
      return
    }

    alert(`Uploaded quiz: ${title} | File: ${file.name}`)
    // TODO: Upload file to backend/cloud storage
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-900'} px-6 py-10 overflow-hidden relative`}>
      {/* Background animated circles */}
      <motion.div
        className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-overlay filter blur-xl opacity-50"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-overlay filter blur-xl opacity-50"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-10 left-1/4 w-48 h-48 bg-pink-500 rounded-full mix-blend-overlay filter blur-xl opacity-50"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      <div className="flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <motion.h1
        className={`text-4xl font-extrabold text-center mb-10 ${darkMode ? 'text-indigo-300' : 'text-indigo-800'} relative z-10`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        Upload Quiz (PDF)
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className={`max-w-xl mx-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-8 rounded-2xl shadow-xl border relative z-10`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        <div className="mb-6">
          <label htmlFor="title" className={`block font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Quiz Title
          </label>
          <motion.input
            type="text"
            id="title"
            className={`w-full px-5 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            placeholder="e.g., JEE Physics Set 1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="pdf" className={`block font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Upload PDF
          </label>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.01 }}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full opacity-0 absolute inset-0 cursor-pointer"
            />
            <div className={`w-full px-5 py-3 border-2 border-dashed ${darkMode ? 'border-indigo-500 text-gray-400' : 'border-indigo-400 text-gray-500'} rounded-lg text-center`}>
              {file ? file.name : 'Click to upload your PDF file'}
            </div>
          </motion.div>
          {file && (
            <motion.p
              className="text-green-400 mt-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {file.name} selected
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Upload Quiz
        </motion.button>
      </motion.form>
    </div>
  )
}

export default CreateQuiz
