'use client'
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { eq, inArray } from 'drizzle-orm'
import { UserAnswer } from '@/utils/schema'
import { MockInterview } from '@/utils/schema'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState({ answers: [], mockMap: {} })
  const router = useRouter()

  useEffect(() => {
    GetFeedback()
  }, [])

  const GetFeedback = async () => {
    const answers = await db.select().from(UserAnswer).orderBy(UserAnswer.mockIdRef, UserAnswer.id)
    const mockIds = [...new Set(answers.map(ans => ans.mockIdRef))]

    const mockDetails = await db.select().from(MockInterview).where(
      inArray(MockInterview.mockId, mockIds)
    )

    const mockMap = mockDetails.reduce((acc, mock) => {
      acc[mock.mockId] = mock
      return acc
    }, {})

    setFeedbackList({ answers, mockMap })
  }

  const groupedFeedback = feedbackList.answers.reduce((acc, item) => {
    const key = item.mockIdRef
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-4">All Interview Feedback</h2>

      {Object.keys(groupedFeedback).length === 0 ? (
        <h2 className='font-bold text-xl text-gray-500'>No Feedback Record Found</h2>
      ) : (
        Object.entries(groupedFeedback).map(([mockId, feedbacks]) => {
          const mockInfo = feedbackList.mockMap[mockId]
          return (
            <div key={mockId} className="border rounded-lg p-6 mb-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Interview ID: {mockId}</h2>
                {mockInfo && (
                  <>
                    <p className="text-sm text-gray-600"><strong>Position:</strong> {mockInfo.jobPosition}</p>
                    <p className="text-sm text-gray-600"><strong>Experience:</strong> {mockInfo.jobExperience}</p>
                    <p className="text-sm text-gray-600"><strong>Description:</strong> {mockInfo.jobDesc}</p>
                  </>
                )}
              </div>

              {feedbacks.map((item, index) => (
                <Collapsible key={index} className='mt-4'>
                  <CollapsibleTrigger className='p-3 bg-secondary rounded-lg my-2 flex justify-between'>
                    <span>{item.question}</span>
                    <ChevronDown className='h-5 w-5' />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className='flex flex-col gap-2 p-3'>
                      <div className='text-sm bg-red-50 border p-2 rounded'><strong>Your Answer:</strong> {item.userAns}</div>
                      <div className='text-sm bg-blue-50 border p-2 rounded'><strong>Correct Answer:</strong> {item.correctAns}</div>
                      <div className='text-sm bg-green-50 border p-2 rounded'><strong>Feedback:</strong> {item.feedback}</div>
                      <div className='text-sm text-gray-500'><strong>Rating:</strong> {item.rating}/10</div>

                      <div className='mt-4'>
                        <p className='text-sm font-semibold mb-2'>Performance Chart</p>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart
                            data={[
                              {
                                name: 'Answer Comparison',
                                User: parseFloat(item.rating) || 0,
                                Ideal: 5,
                              }
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                          >
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="User" fill="#8884d8" />
                            <Bar dataKey="Ideal" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>

                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )
        })
      )}

      <Button onClick={() => router.replace("/dashboard")} className="mt-6">
        Go Back to Dashboard
      </Button>
    </div>
  )
}

export default FeedbackPage
