'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardCheck,
  FaClock,
  FaShieldAlt,
} from 'react-icons/fa';
import * as THREE from 'three';
import { useRef } from 'react';

// Custom blinking stars
function BlinkingStars() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 500;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          uniform float time;
          varying float vOpacity;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 1.5;
            vOpacity = 0.2 + 0.8 * abs(sin(time + position.x * 0.1));
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vOpacity;
          void main() {
            gl_FragColor = vec4(vec3(1.0), vOpacity);
          }
        `}
        transparent
      />
    </points>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center px-6 pt-32 pb-16 space-y-12">
      {/* 3D Background Stars */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 5]} />
          <BlinkingStars />
          <OrbitControls enableZoom={false} enableRotate={false} />
        </Canvas>
      </div>

      {/* Login/Register Buttons */}
      <div className="absolute top-6 sm:top-8 right-4 z-10 flex flex-col sm:flex-row gap-2 sm:gap-4 items-end">
        <Link href="/login">
          <motion.button
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-800 text-white font-medium transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </Link>
        <Link href="/register">
          <motion.button
            className="px-4 py-2 rounded-lg border border-purple-400 text-purple-300 hover:bg-purple-700 hover:text-white transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </Link>
      </div>

      {/* Heading */}
      <motion.h1
        className="text-4xl sm:text-6xl font-bold text-center z-10 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Welcome to TestTrack
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-lg sm:text-xl text-center text-gray-300 max-w-2xl z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        A smart platform where <strong>teachers</strong> create quizzes and <strong>students</strong> attend them – fast, fair, and fun.
      </motion.p>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 max-w-4xl w-full z-10">
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-md hover:bg-white/20 transition-all"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <FaChalkboardTeacher /> Teacher Features
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2"><FaClipboardCheck /> Create and manage quizzes</li>
            <li className="flex items-center gap-2"><FaClock /> Auto-grading and instant results</li>
            <li className="flex items-center gap-2"><FaShieldAlt /> Secure environment</li>
          </ul>
        </motion.div>

        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-md hover:bg-white/20 transition-all"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <FaUserGraduate /> Student Features
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2"><FaClipboardCheck /> Join and take quizzes</li>
            <li className="flex items-center gap-2"><FaClock /> Instant feedback</li>
            <li className="flex items-center gap-2"><FaShieldAlt /> Fair and secure exams</li>
          </ul>
        </motion.div>
      </div>

      {/* CTA Buttons */}
      <motion.div
        className="mt-12 flex gap-6 flex-wrap justify-center z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Link href="/register">
          <motion.button
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </Link>
        <Link href="/learn-more">
          <motion.button
            className="px-6 py-3 rounded-xl font-semibold border border-purple-400 text-purple-300 hover:bg-purple-700 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center text-gray-400 text-sm mt-16 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <p>🚀 Empowering learning · 💯 Reliable · 🔐 Secure</p>
      </motion.div>
    </div>
  );
}
