'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Quiz = {
  id: string;
  name: string;
  number: number;
  endsAt: string;
  teacher: {
    fullname: string;
  };
  quizsections: {
    subject: {
      name: string;
      imgUrl: string;
    };
  }[];
};

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/quiz/student/get-quizzess');
        const data = await res.json();
        setQuizzes(data.data || []);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-6">
          Available Quizzes
        </h1>

        {loading ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400">No quizzes found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-5"
              >
                <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">{quiz.name}</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                  By {quiz.teacher.fullname}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Ends: {new Date(quiz.endsAt).toLocaleString()}
                </p>

                <div className="mt-4 space-y-3">
                  {quiz.quizsections.map((section, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={section.subject.imgUrl}
                          alt={section.subject.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span className="text-zinc-700 dark:text-zinc-200">{section.subject.name}</span>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md">
                        Attempt Quiz
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
