'use client';

import { UserButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  return (
    <main className="min-h-screen w-full py-10 px-5 md:px-20 bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-10"
      >
        <div>
          <h2 className="text-4xl font-bold text-indigo-800">Welcome Back</h2>
          <p className="text-gray-700 mt-2 text-lg">
            Start a new mock interview or review your progress.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AddNewInterview />
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col md:flex-row md:justify-between gap-4 mb-8 mt-8"
      >
        <Input
          placeholder="Search your interviews..."
          className="w-full md:w-2/3 lg:w-3/5 rounded-full px-5 py-3 shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={(value) => setSelectedTopic(value)}>
          <SelectTrigger className="w-full md:w-52 rounded-full px-4 py-2 shadow">
            <SelectValue placeholder="Filter by topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="fullstack">Fullstack</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Previous Interviews */}
      <motion.section
        className="bg-white rounded-3xl shadow-xl p-10 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <InterviewList searchTerm={searchTerm} selectedTopic={selectedTopic} />
      </motion.section>
    </main>
  );
}

export default Dashboard;
