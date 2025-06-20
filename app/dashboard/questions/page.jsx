// app/dashboard/questions/page.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { generateInterviewQuestions } from '@/utils/geminiService';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filters, setFilters] = useState({
    role: 'software-engineer',
    experience: 'mid-level',
    type: 'standard'
  });

  const roles = [
    { value: 'software-engineer', label: 'Software Engineer' },
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'devops-engineer', label: 'DevOps Engineer' }
  ];

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await generateInterviewQuestions({
        role: filters.role,
        experience: filters.experience,
        count: 10,
        type: filters.type
      });
      setQuestions(data.questions);
      setCurrentIndex(0);
      setShowAnswer(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced effect to prevent rapid API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 300); // 300ms debounce delay
    
    return () => clearTimeout(timer);
  }, [filters.role, filters.experience, filters.type]);

  const currentQuestion = questions[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Interview Questions</h1>
        
        {/* Filters Section */}
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Job Role Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Role</label>
            <Select
              value={filters.role}
              onValueChange={(value) => setFilters({...filters, role: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Experience Level Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Experience</label>
            <Select
              value={filters.experience}
              onValueChange={(value) => setFilters({...filters, experience: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry-level">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid-level">Mid Level (3-5 years)</SelectItem>
                <SelectItem value="senior-level">Senior Level (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Question Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Question Type</label>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({...filters, type: value})}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Questions</SelectItem>
                <SelectItem value="advanced">Advanced Scenarios</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground">Generating questions...</p>
          </div>
        )}

        {/* Question Display */}
        {!loading && currentQuestion && (
          <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
            {/* Question Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{currentQuestion.text}</h2>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {currentQuestion.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Answer Content */}
            <div className="p-6">
              {showAnswer ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Model Answer:</h3>
                    <p className="text-foreground/90 whitespace-pre-line">
                      {currentQuestion.modelAnswer}
                    </p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Evaluation Criteria:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentQuestion.evaluationCriteria.map((criteria, i) => (
                        <li key={i}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                  {currentQuestion.followUps && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Follow-up Questions:</h3>
                      <ul className="space-y-2">
                        {currentQuestion.followUps.map((followUp, i) => (
                          <li key={i} className="text-sm text-foreground/80">• {followUp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Button 
                    onClick={() => setShowAnswer(true)}
                    className="gap-2 w-full md:w-auto"
                  >
                    Reveal Answer
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Try to answer first before revealing the model answer
                  </p>
                </div>
              )}
            </div>

            {/* Question Navigation */}
            <div className="bg-secondary/50 px-6 py-4 flex justify-between items-center">
              <Button 
                variant="outline" 
                disabled={currentIndex === 0}
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              
              <span className="text-sm text-foreground/70">
                Question {currentIndex + 1} of {questions.length}
              </span>
              
              <Button 
                variant="outline"
                disabled={currentIndex === questions.length - 1}
                onClick={handleNext}
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && questions.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            No questions generated yet. Adjust filters and try again.
          </div>
        )}
      </div>
    </div>
  );
}