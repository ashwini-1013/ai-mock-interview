'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LottieInterview = dynamic(() => import('@/components/LottieInterview'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-6 md:px-12 py-20 flex flex-col items-center font-sans text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 w-full max-w-7xl">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl font-extrabold text-indigo-800 mb-6 leading-tight tracking-tight"
          >
            Nail Every Interview with AI Precision
          </motion.h1>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-700 mb-8 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0"
          >
            Dive into immersive mock interviews with role-specific AI questions, facial feedback, and real-time performance insights.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="inline-block"
          >
            <Link href="/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdashboard">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 text-lg rounded-full shadow-lg">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full lg:w-1/2 flex justify-center"
        >
          <div className="w-[300px] sm:w-[420px] md:w-[480px] lg:w-[560px]">
            <LottieInterview />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-28 w-full max-w-7xl text-center">
        <h2 className="text-4xl font-bold text-indigo-800 mb-14">
          🚀 Key Features to Boost Your Confidence
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: '🔮 Gemini AI Question Generation',
              desc: 'Tailored questions based on your job role, experience, and tech stack.'
            },
            {
              title: '🎥 Facial & Gesture Analysis',
              desc: 'Real-time expression, gesture, and posture analysis via webcam.'
            },
            {
              title: '⚠️ Behavior Monitoring',
              desc: 'Warns against distractions like multiple faces or suspicious movements.'
            },
            {
              title: '📊 AI Feedback & Answer Comparison',
              desc: 'Detailed insights with side-by-side answer evaluation.'
            },
            {
              title: '📈 Graphical Progress Reports',
              desc: 'Visual performance analytics to help you track and grow.'
            },
            {
              title: '💻 Real-Life Interview Environment',
              desc: 'Fullscreen simulation with mic/webcam for authentic experience.'
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg p-6 text-left border border-indigo-100 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mt-32 w-full max-w-5xl text-center">
        <h2 className="text-4xl font-bold text-indigo-800 mb-14">
          🧭 How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: '1️⃣', title: 'Enter Job Details', desc: 'Select role, experience level, and tech stack.' },
            { step: '2️⃣', title: 'Get AI Questions', desc: 'Instant Gemini AI-generated questions just for you.' },
            { step: '3️⃣', title: 'Record Responses', desc: 'Answer via webcam/mic while being analyzed in real-time.' },
            { step: '4️⃣', title: 'Review Results', desc: 'See how you did and where you can improve.' },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-white p-6 pt-10 rounded-2xl border border-blue-100 shadow-md hover:shadow-lg text-left relative"
            >
              <div className="text-3xl absolute -top-6 left-6 bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                {item.step}
              </div>
              <h4 className="text-lg font-semibold text-indigo-600 mb-1 mt-6">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-32 text-center w-full max-w-4xl">
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-10 rounded-3xl shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Your Dream Job Awaits</h2>
          <p className="text-lg mb-6">Practice smarter, perform better. Join the AI-powered mock interview revolution today.</p>
          <Link href="/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdashboard">
            <Button className="bg-white text-indigo-600 text-lg font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-all">
              Start Practicing Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
